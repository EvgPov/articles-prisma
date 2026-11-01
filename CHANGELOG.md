# Changelog

Все заметные изменения проекта записываются в этот файл.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/),
проект следует [семантическому версионированию](https://semver.org/lang/ru/).

## [Unreleased]

## [1.0.0] - 2026-11-01

### Added

- Docker-образ приложения: многоэтапная сборка на основе Next.js standalone,
  сервер запускается командой `node server.js` от непривилегированного пользователя `node`.
- Отдельный образ миграций: выполняет `prisma migrate deploy` и завершается.
- Стек Docker Compose: PostgreSQL 18 с именованным volume и healthcheck,
  одноразовый сервис `migrate` и приложение со своим healthcheck.
  Приложение запускается только после успешных миграций.
- `/api/health` сообщает, что процесс жив и какая версия запущена.
- `/api/db-check` сообщает, доступна ли база данных (`503`, если нет).
- Проверка конфигурации при запуске (zod): без корректного `DATABASE_URL`
  сервер завершается с понятной ошибкой.
- Схема базы данных под управлением Prisma Migrate (начальная миграция `0_init`).
- CI на каждый push и pull request: Biome, проверка типов TypeScript,
  модульные тесты Vitest, сборка.
- CD: образы для `linux/amd64` и `linux/arm64` публикуются в ghcr.io —
  `latest` из ветки `main` и `vX.Y.Z` по тегам версий.

### Changed

- Страницы получают данные при запросе, поэтому сборке больше не нужна база данных.
- Версия Node.js 24 закреплена в `.nvmrc` и `engines`.
- Biome заменил ESLint в роли линтера и добавил форматирование кода.

### Fixed

- Заголовок и описание страницы `/articles` не применялись
  из-за опечатки в имени экспорта `metadata`.
- У кнопок указан явный `type`: они больше не отправляют форму, внутри которой находятся.

### Removed

- `db/schema.sql`: схему создают миграции.
- Неиспользуемые изображения из шаблона create-next-app.

[Unreleased]: https://github.com/EvgPov/articles-prisma/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/EvgPov/articles-prisma/releases/tag/v1.0.0
