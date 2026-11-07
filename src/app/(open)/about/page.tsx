import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О проекте",
  description:
    "Учебный агрегатор статей на Next.js 16: как он устроен, откуда данные и на чём сделан.",
};

export default function AboutPage() {
  return (
    <div>
      <h1>О проекте</h1>
      <p>
        Агрегатор статей — учебный проект, в котором собраны публикации на
        разные темы: можно открыть список, выбрать статью и прочитать её вместе
        с комментариями читателей.
      </p>
      <p>
        Проект вырос из первой практической работы по Next.js и с тех пор
        развивается как настоящее приложение: у него есть база данных, сборка в
        Docker, автоматические проверки и выпуски версий.
      </p>
      <h2>Откуда данные</h2>
      <p>
        Статьи, авторы и комментарии взяты из открытого тестового API{" "}
        <a
          href="https://dummyjson.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          DummyJSON
        </a>{" "}
        и импортированы в собственную базу PostgreSQL. Сайт читает данные из
        своей базы, а не из внешнего сервиса.
      </p>
      <h2>Как сделано</h2>
      <ul>
        <li>
          <strong>Next.js 16 (App Router)</strong>: страницы рендерятся на
          сервере, данные кэшируются через Cache Components.
        </li>
        <li>
          <strong>PostgreSQL и Prisma</strong>: схема базы и её изменения
          описаны миграциями.
        </li>
        <li>
          <strong>Docker</strong>: приложение и миграции собираются в образы и
          публикуются в GitHub Container Registry.
        </li>
        <li>
          <strong>GitHub Actions</strong>: при каждом изменении проверяются
          стиль кода, типы и тесты, проект собирается.
        </li>
        <li>
          <strong>Релизы</strong>: версии по семантическому версионированию,
          история изменений в CHANGELOG.
        </li>
      </ul>
      <p>
        Исходный код —{" "}
        <a
          href="https://github.com/EvgPov/articles-prisma"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/EvgPov/articles-prisma
        </a>
      </p>
    </div>
  );
}
