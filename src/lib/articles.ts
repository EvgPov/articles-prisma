import { cacheLife } from "next/cache";

import type { Article } from '@/types/article';
import type { ArticleComment } from "@/types/comment";

import { demoDelay } from "@/lib/demoDelay";
import { toArticle, toArticleComment, parseArticleId } from "@/lib/article-mappers";

import { getPrisma } from "./prisma";

export async function getArticles(): Promise<Article[]> {
  'use cache'
  cacheLife('hours')

  await demoDelay(2000);

  const rows = await getPrisma().article.findMany({
    orderBy: { id: 'asc' },
    take: 15,
  });

  return rows.map(toArticle);
}

export async function getArticleById(id: string): Promise<Article | null> {
  'use cache'

  const articleId = parseArticleId(id);

  if (articleId === null) {
    cacheLife('minutes');
    return null;
  }

  await demoDelay(2000);

  const article = await getPrisma().article.findUnique({
    where: { id: articleId }
  });

  if (!article) {
    cacheLife('minutes');
    return null
  }

  cacheLife('days')
  return toArticle(article);
}

export async function getArticleComments(postId: number): Promise<ArticleComment[] | null> {
  'use cache'
  cacheLife('minutes')

  await demoDelay(3000);

  try {
    const comments = await getPrisma().comment.findMany({
      where: { postId: postId },
      orderBy: { id: 'asc' },
      select: {  id: true, body: true, likes: true,
        user: {
          select: { id: true, username: true, firstName: true, lastName: true },
        },
      },
    });

    return comments.map(toArticleComment);
  } catch(error) {
    console.error('Failed to load comments:', error);
    return null
  }
}
