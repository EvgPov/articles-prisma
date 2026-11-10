# RUNBOOK

Как обслуживать прод pr01-articles: проверить состояние, выкатить и откатить версию,
сделать и восстановить резервную копию, разобраться со сбоем.

Прод — стек `compose.prod.yaml` на одной машине с Docker. Все команды выполняются
из папки проекта. В каждой команде Compose нужен `-f compose.prod.yaml`:
без него команда обратится к стеку разработки.

## Как устроен прод

| Сервис    | Образ                                                   | Что делает                                       |
| --------- | ------------------------------------------------------- | ------------------------------------------------ |
| `db`      | `postgres:18.6`                                         | база; данные в volume `articles-prod_pgdata`     |
| `migrate` | `ghcr.io/evgpov/articles-prisma-migrate:${RELEASE_TAG}` | применяет новые миграции и завершается с кодом 0 |
| `app`     | `ghcr.io/evgpov/articles-prisma:${RELEASE_TAG}`         | сервер; порт хоста **3003**                      |

- Порядок запуска: `db` healthy → `migrate` завершился успешно → `app`.
- Версия задаётся одной строкой `RELEASE_TAG=vX.Y.Z` в `.env`.
- Имя проекта `articles-prod` (ключ `name:`): контейнеры и volume отдельно от стека разработки.
- Перезапуск: `db` и `app` — `unless-stopped`; `migrate` — не перезапускается.

**Никогда не выполнять `docker compose -f compose.prod.yaml down -v`** — флаг `-v` удаляет volume с базой.

## 1. Проверить состояние

```bash
docker compose -f compose.prod.yaml ps -a
curl -i localhost:3003/api/health      # 200 {"status":"ok","version":"vX.Y.Z"}
curl -i localhost:3003/api/db-check    # 200 {"db":"ok"}; 503 {"db":"error"} — база недоступна
```

Норма: `db` и `app` — `Up (healthy)`, `migrate` — `Exited (0)`.

Логи: `docker compose -f compose.prod.yaml logs <сервис>`, последние строки — `--tail 50`,
следить в реальном времени — `-f`.

## 2. Первый запуск

```bash
# в .env: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, RELEASE_TAG=vX.Y.Z
docker compose -f compose.prod.yaml config > /dev/null   # проверить файл и переменные
docker compose -f compose.prod.yaml pull
docker compose -f compose.prod.yaml up -d
docker compose -f compose.prod.yaml run --rm migrate node db/seed.mts   # тестовые данные, один раз
```

Затем — раздел 1.

## 3. Резервная копия

Перед каждым выкатом, в котором есть новая миграция:

```bash
mkdir -p ~/backups
docker compose -f compose.prod.yaml exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  > ~/backups/articles-prod-$(date +%Y%m%d-%H%M).sql
ls -lh ~/backups                                   # размер больше нуля
head -5 ~/backups/<файл>                           # «-- PostgreSQL database dump»
```

- `-T` обязателен: без него Docker может испортить поток служебными символами терминала.
- Одинарные кавычки: переменные подставляются внутри контейнера, а не на хосте.
- Копии хранить **вне репозитория**: в них все данные базы.
- Запомнить, какая версия (`RELEASE_TAG`) работала, когда сделана копия.

## 4. Выкат новой версии

1. Проверить, что релиз собран: в GitHub Actions запуск тега зелёный, в Packages у обоих образов есть тег `vX.Y.Z`.
2. Прочитать раздел версии в CHANGELOG: есть ли миграция, совместима ли она.
3. Если есть миграция — резервная копия (раздел 3).
4. Выкат:

```bash
# в .env: RELEASE_TAG=vX.Y.Z
docker compose -f compose.prod.yaml pull app migrate
docker compose -f compose.prod.yaml up -d
```

5. Проверить:

```bash
docker compose -f compose.prod.yaml ps -a          # образы :vX.Y.Z, app healthy, migrate Exited (0)
docker compose -f compose.prod.yaml logs migrate   # Applying migration … / No pending migrations
curl localhost:3003/api/health                     # "version":"vX.Y.Z"
```

Стратегия — recreate: Compose пересоздаёт только `migrate` и `app`, база не перезапускается,
простой — несколько секунд.

## 5. Откат

Когда: новая версия unhealthy, отвечает ошибками или работает неправильно.

```bash
# в .env: RELEASE_TAG=<предыдущая версия>
docker compose -f compose.prod.yaml up -d
docker compose -f compose.prod.yaml ps -a          # образы предыдущей версии, app healthy
curl localhost:3003/api/health                     # предыдущая версия
```

- Миграции назад **не откатываются**: схема остаётся новой. Это безопасно, потому что
  миграции только добавляют (expand / contract). Образ миграций старой версии
  печатает `No pending migrations to apply` — это норма.
- Если всё же нужна старая схема или данные испорчены — восстановление из копии (раздел 6).

Проверено:
- откат v1.1.0 → v1.0.0 с данными в новой колонке `articles.summary` —
  сервис работает, данные в колонке сохранились.
- откат v1.2.0 → v1.1.0 после миграции add_authors — v1.1.0 работает:
  она читает users и user_id, которые миграция не изменила;
  возврат на v1.2.0 без перезапуска базы.

## 6. Восстановление из резервной копии

Восстанавливать копию, сделанную на той же версии, на которую выкатываетесь
(для копии «before-v1.1.0» — `RELEASE_TAG=v1.0.0`). В копии есть таблица
`_prisma_migrations`, поэтому после восстановления миграции будут в нужном состоянии.

**Удаляет текущие данные.** Перед началом сделать копию текущего состояния (раздел 3).

```bash
docker compose -f compose.prod.yaml stop app
docker compose -f compose.prod.yaml exec -T db sh -c \
  'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"'
docker compose -f compose.prod.yaml exec -T db sh -c \
  'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < ~/backups/<файл>.sql
# в .env: RELEASE_TAG=<версия, на которой сделана копия>
docker compose -f compose.prod.yaml up -d
```

Затем — раздел 1 и проверка данных, например:

```bash
docker compose -f compose.prod.yaml exec db sh -c \
  'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT count(*) FROM articles;"'
```

## 7. Сбои

| Симптом                                                     | Где смотреть              | Причина и что делать                                                                                                                                                   |
| ----------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `required variable … is missing a value` при любой команде  | вывод Compose             | в `.env` нет `RELEASE_TAG` или переменной `POSTGRES_*`; дописать                                                                                                       |
| `pull` — `manifest unknown` / `not found`                   | Packages на GitHub        | такого тега нет: релиз не собран или опечатка в `RELEASE_TAG`                                                                                                          |
| `pull` — `no such host`, `dial tcp`                         | интернет, VPN             | нет сети или DNS; проверить сеть, перезапустить Docker Desktop                                                                                                         |
| `migrate` — `Exited (1)`, `app` не запускается              | `logs migrate`            | миграция не применилась (ошибка SQL, нет связи с базой). Не исправлять базу руками: откатить `RELEASE_TAG`, разобраться, при необходимости — восстановление (раздел 6) |
| `app` — `Exited (1)`, в логе `Invalid configuration`        | `logs app`                | неверный `DATABASE_URL`; проверить `POSTGRES_*` в `.env`, `docker compose … config`                                                                                    |
| `app` — `unhealthy`                                         | `logs app`, `/api/health` | процесс завис или отвечает ошибкой; `restart app`; если повторяется — откат (раздел 5)                                                                                 |
| `/api/db-check` — 503, `Can't reach database server` в логе | `ps -a`, `logs db`        | база остановлена или unhealthy; `up -d`, смотреть `logs db`                                                                                                            |
| `db` — `unhealthy`                                          | `logs db`                 | неверные `POSTGRES_*`, нет места на диске (`docker system df`)                                                                                                         |
| `port is already allocated`                                 | `docker ps`               | порт 3003 занят другим контейнером; остановить его                                                                                                                     |
| изменения в базе не видны на `/articles`                    | —                         | кэш `'use cache'`, обновится сам; немедленно — `restart app`                                                                                                           |

## 8. Остановка и запуск

```bash
docker compose -f compose.prod.yaml stop        # остановить, контейнеры и данные сохраняются
docker compose -f compose.prod.yaml start       # запустить снова
docker compose -f compose.prod.yaml down        # удалить контейнеры; volume с базой остаётся
```

## Правила

- На прод — только теги версий, не `latest`.
- Перед выкатом с миграцией — резервная копия.
- В одном релизе миграции только добавляют; удаление и переименование — отдельным релизом позже.
- Теги версий не переносят и не перезаписывают.
- Никаких `down -v` на проде.
- Версии сторонних образов закреплены (`postgres:18.6`), без плавающих тегов вроде `postgres:18`.
