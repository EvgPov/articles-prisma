import type { Article } from "@/types/article";

export type ArticleRef = Pick<Article, "id" | "title">;

export type ReadingEntry = {
  articleId: number;
  title: string;
  read: boolean;
};
