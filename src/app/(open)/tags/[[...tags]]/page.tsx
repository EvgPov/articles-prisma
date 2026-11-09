import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import ArticlesList from "@/components/ArticlesList";
import { getArticlesByTags, getTagCounts } from "@/lib/articles";
import { normalizeTags, tagCrumbs } from "@/lib/tags";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: PageProps<"/tags/[[...tags]]">): Promise<Metadata> {
  const { tags } = await params;
  const normalized: string[] = normalizeTags(tags);

  if (normalized.length === 0) return { title: "Теги" };
  if (normalized.length === 1) return { title: `Тег ${normalized[0]}` };
  return { title: `Теги ${normalized.join(", ")}` };
}

export default async function TagsPage({
  params,
}: PageProps<"/tags/[[...tags]]">) {
  const { tags } = await params;
  const normalized: string[] = normalizeTags(tags);

  if (normalized.join("/") !== (tags ?? []).join("/")) {
    const correctRoute =
      normalized.length !== 0 ? `/tags/${normalized.join("/")}` : "/tags";
    permanentRedirect(correctRoute);
  }

  const tagCounts = await getTagCounts([]);
  const allTags = new Set(tagCounts.map((item) => item.tag));

  const allTagsExist = normalized.every((tag) => allTags.has(tag));

  if (!allTagsExist) notFound();

  if (normalized.length === 0) {
    return (
      <div>
        <h1>Теги</h1>
        <ul className={styles.list}>
          {tagCounts.map((item) => (
            <li key={item.tag}>
              <Link href={`/tags/${item.tag}`}>
                {item.tag} ({item.count})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const crumbs = tagCrumbs(normalized);
  const [articles, clarifyTagCounts] = await Promise.all([
    getArticlesByTags(normalized),
    getTagCounts(normalized),
  ]);

  return (
    <div>
      <nav aria-label="Хлебные крошки">
        <ol className={styles.crumbs}>
          <li>
            <Link href="/tags">Теги</Link>
          </li>
          {crumbs.map((crumb, index) => (
            <li key={crumb.href}>
              {index === crumbs.length - 1 ? (
                <span aria-current="page">{crumb.label}</span>
              ) : (
                <Link href={crumb.href}>{crumb.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <h1>
        Статьи с {normalized.length === 1 ? "тегом" : "тегами"}{" "}
        {normalized.join(", ")} ({articles.length})
      </h1>
      {articles.length === 0 ? (
        <div>
          <p className="muted">
            Статей сразу со всеми этими тегами нет. Посмотрите каждый тег
            отдельно:
          </p>
          <ul className={styles.list}>
            {normalized.map((tag) => (
              <li key={tag}>
                <Link href={`/tags/${tag}`}>{tag}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ArticlesList posts={articles} />
      )}
      {clarifyTagCounts.length !== 0 && (
        <section>
          <h2>Уточнить</h2>
          <ul className={styles.list}>
            {clarifyTagCounts.map((item) => (
              <li key={item.tag}>
                <Link
                  href={`/tags/${normalizeTags([...normalized, item.tag]).join("/")}`}
                >
                  {item.tag} ({item.count})
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
