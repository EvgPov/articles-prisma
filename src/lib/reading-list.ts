import type { ArticleRef, ReadingEntry } from "@/types/reading-list";

export function createEntry(article: ArticleRef): ReadingEntry {
  if (article.title.trim() === "")
    throw new Error("Статья должна иметь заголовок");
  if (article.id <= 0 || !Number.isInteger(article.id))
    throw new Error("id статьи должен быть целым положительным числом");
  return {
    articleId: article.id,
    title: article.title,
    read: false,
  };
}
