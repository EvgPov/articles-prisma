import type { Article as ArticleRow } from "@/generated/prisma/client";
import type { Article } from "@/types/article";
import type { ArticleComment } from "@/types/comment";

type CommentRow = {
  id: number;
  body: string;
  likes: number;
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  }
}

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

export function toArticleComment({user, ...comment}: CommentRow): ArticleComment {
  return {
    ...comment,
    user: {
      id: user.id,
      username: user.username,
      fullName: `${user.firstName} ${user.lastName}`
    },
  }
}