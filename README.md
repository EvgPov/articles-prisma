# pr01-articles

Учебный сервис статей на Next.js 16, Prisma 7 и PostgreSQL — с полным путём
от коммита до прода: Docker-образы, Docker Compose, CI/CD в GitHub Actions,
релизы по тегам, совместимые миграции и откат.

- Список статей с кратким описанием, страница статьи с автором и комментариями.
- Данные — в PostgreSQL, схема под управлением Prisma Migrate.
- Служебные эндпоинты `/api/health` (жив ли процесс и какая версия) и `/api/db-check` (доступна ли база).

Эксплуатация (выкат, откат, резервные копии, сбои) описана в [RUNBOOK.md](RUNBOOK.md),
история версий — в [CHANGELOG.md](CHANGELOG.md).

## Стек

| Что          | Версия                                         |
| ------------ | ---------------------------------------------- |
| Node.js      | 24 (`.nvmrc`, `engines`)                       |
| Next.js      | 16, Cache Components, standalone-сборка        |
| Prisma       | 7, адаптер `@prisma/adapter-pg`                |
| PostgreSQL   | 18 в Docker (локально подходит Postgres.app)   |
| Конфигурация | zod 4                                          |
| Проверки     | Biome (линтер и форматтер), TypeScript, Vitest |

## Структура

```
src/app/            страницы и API (App Router)
src/components/     компоненты страниц
src/lib/            доступ к данным, конфигурация, чистые функции
src/instrumentation*.ts  проверка конфигурации при старте сервера
prisma/             схема и миграции
db/seed.mts         загрузка тестовых данных (dummyjson)
tests/              модульные тесты Vitest
Dockerfile          этапы deps, migrate, builder, runner
compose.yaml        стек разработки (сборка из исходников)
compose.prod.yaml   прод (готовые образы из ghcr.io по тегу)
```

## Конфигурация

Все переменные приложения проверяются в `src/lib/env.ts` (zod). Без корректного
`DATABASE_URL` сервер не запускается и печатает понятную ошибку.

| Переменная                                          | Где задаётся                     | Назначение                                                                    |
| --------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------- |
| `DATABASE_URL`                                      | `.env.local` (локально), compose | строка подключения, только `postgres://` или `postgresql://`                  |
| `DEMO_DELAY`                                        | `.env.local`                     | `1` — искусственные задержки, чтобы увидеть экраны загрузки; по умолчанию `0` |
| `APP_VERSION`                                       | аргумент сборки Docker           | метка версии в `/api/health`; по умолчанию `dev`                              |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | `.env`                           | база в Docker Compose; пароль обязателен                                      |
| `RELEASE_TAG`                                       | `.env`                           | версия образов для `compose.prod.yaml`, например `v1.1.0`                     |

Шаблон всех переменных — [.env.example](.env.example). Файлы `.env*` в git не попадают.

## Локальный запуск без Docker

Нужны Node.js 24 и PostgreSQL (например, Postgres.app).

```bash
npm ci                          # зависимости строго по package-lock.json (+ prisma generate)
cp .env.example .env.local      # оставить DATABASE_URL и DEMO_DELAY, вписать свои значения
createdb pr01_articles          # пустая база
npm run db:migrate              # создать таблицы миграциями
npm run db:seed                 # загрузить статьи
npm run dev                     # http://localhost:3002
```

## Запуск в Docker (стек разработки)

```bash
cp .env.example .env            # задать POSTGRES_PASSWORD (остальное можно оставить)
docker compose up --build -d    # db → migrate → app
docker compose ps -a            # db и app — healthy, migrate — Exited (0)
docker compose run --rm migrate node db/seed.mts   # загрузить статьи (один раз)
```

Приложение — http://localhost:3002. Остановить: `docker compose down`
(без `-v`: этот флаг удаляет volume с базой).

Порт 3002 занят и `npm run dev`, и этим стеком: одновременно их не запустить.

## Проверки

```bash
npm run lint        # Biome: линтер, форматирование, порядок импортов
npm run format      # исправить то, что Biome умеет исправлять сам
npm run typecheck   # next typegen + tsc --noEmit
npm test            # модульные тесты Vitest
npm run build       # сборка; база не нужна
```

Те же проверки выполняет CI.

## CI/CD

Файл `.github/workflows/ci.yaml`, три задачи:

| Задача    | Когда                                  | Что делает                                                                      |
| --------- | -------------------------------------- | ------------------------------------------------------------------------------- |
| `check`   | каждый push и pull request             | `npm ci`, Biome, TypeScript, Vitest, сборка                                     |
| `publish` | push в `main`, после зелёного `check`  | образы `:latest` для `linux/amd64` и `linux/arm64`, версия `main-<хэш коммита>` |
| `release` | push тега `v*`, после зелёного `check` | образы с тегом версии, например `:v1.1.0`                                       |

Образы в GitHub Container Registry (публичные):

- `ghcr.io/evgpov/articles-prisma` — приложение (этап `runner`);
- `ghcr.io/evgpov/articles-prisma-migrate` — миграции и seed (этап `migrate`).

## Релизы

Версии по [SemVer](https://semver.org/lang/ru/), изменения — в [CHANGELOG.md](CHANGELOG.md).

```bash
# 1. CHANGELOG.md: новый раздел; package.json: "version"
git commit -m "chore(release): v1.2.0"
git push origin prisma:main
# 2. аннотированный тег на этот коммит
git tag -a v1.2.0 -m "Краткое описание релиза"
git push origin v1.2.0          # запускает check → release
```

Теги версий не переносят и не перезаписывают: на них выкатывают прод и к ним откатываются.

## Инженерные решения

**Сборка без базы.** Страницы и API получают данные при запросе (`await connection()`),
а не при `next build`. Поэтому образ собирается в CI без PostgreSQL. Клиент Prisma
создаётся лениво (`getPrisma()`), конфигурация проверяется при старте сервера
(`register()` в `instrumentation.ts`), а не при импорте модулей.

**Fail fast.** Неверная конфигурация — сервер завершается с кодом 1 и сообщением zod,
а не работает с ошибками в каждом запросе. В Compose пароль и `RELEASE_TAG`
обязательны (`${VAR:?…}`), миграции идут до приложения (`service_completed_successfully`).

**Многоэтапный Dockerfile.** Итоговый образ — только standalone-сервер Next.js
(около 300 МБ вместо 1,4 ГБ). Процесс `node` запускается без `npm`, поэтому получает
сигналы остановки. `HOSTNAME=0.0.0.0` задан явно: Docker подставляет туда id контейнера.
Сервер работает от пользователя `node`, не от root.

**Отдельный образ миграций.** CLI Prisma не нужен в рабочем образе. Миграции
выполняются одноразовым сервисом `migrate` перед стартом приложения.

**Совместимые миграции (expand / contract).** Во время выката и после отката старый код
работает с новой схемой, поэтому релиз только добавляет колонки, которые могут быть пустыми.
Удаление и переименование — отдельным поздним релизом. Пример — миграция v1.1.0
`add_article_summary`: v1.0.0 работает с ней без изменений, откат проверен.

**Версия внутри образа.** CI передаёт `APP_VERSION` аргументом сборки
(`ARG` → `ENV` в этапе `runner`), `/api/health` её показывает — по ответу видно,
что именно запущено, и что откат сработал.

**Тестируемость.** Логика преобразований вынесена в чистые функции
(`src/lib/article-mappers.ts`) без Next.js и Prisma, поэтому её проверяют модульные тесты.

**Две архитектуры.** Образы собираются под `amd64` (серверы) и `arm64` (Apple Silicon);
Docker сам выбирает вариант при `pull`.

## Полезно знать

- Массовое форматирование при переходе на Biome записано в `.git-blame-ignore-revs`.
  Чтобы локальный `git blame` его пропускал: `git config blame.ignoreRevsFile .git-blame-ignore-revs`.
- Список статей кэшируется (`'use cache'`): изменения в базе появляются на странице не сразу.
- Рекомендованные расширения VS Code (Biome, GitHub Actions) — в `.vscode/extensions.json`.
