import type { Article as ArticleRow } from "@/generated/prisma/client";
import type { Article } from "@/types/article";
import type { ArticleComment } from "@/types/comment";

type CommentRow = {
  id: number;
  body: string;
  likes: number;
  author: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  };
};

export const MAX_INTEGER = 2_147_483_647;

export function parseArticleId(id: string): number | null {
  if (!/^\d+$/.test(id) || Number(id) > MAX_INTEGER) {
    return null;
  }
  return Number(id);
}

export function toArticle({ likes, dislikes, ...rest }: ArticleRow): Article {
  return { ...rest, reactions: { likes, dislikes } };
}

export function toArticleComment({
  author,
  ...comment
}: CommentRow): ArticleComment {
  return {
    ...comment,
    author: {
      id: author.id,
      username: author.username,
      fullName: `${author.firstName} ${author.lastName}`,
    },
  };
}

export function articleExcerpt(
  { summary, body }: Pick<Article, "summary" | "body">,
  maxLength = 160,
): string {
  const summaryTrim = summary?.trim();
  if (summaryTrim) return summaryTrim;

  const bodyTrim = body.trim();
  if (bodyTrim.length <= maxLength) return bodyTrim;

  let normalShortBody = bodyTrim.slice(0, maxLength);

  const space = normalShortBody.lastIndexOf(" ");
  if (space !== -1) {
    normalShortBody = normalShortBody.slice(0, space);
  }

  return `${normalShortBody}…`;
}
