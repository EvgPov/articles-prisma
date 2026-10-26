import { cacheLife } from "next/cache";

import type { Article as ArticleRow } from "@/generated/prisma/client";
import type { Article } from '@/types/article'

import { demoDelay } from "@/lib/demoDelay";
import { prisma } from '@/lib/prisma'

import type { ArticleComment } from "@/types/comment";

const MAX_INTEGER = 2_147_483_647;

function toArticle({ likes, dislikes, ...rest }: ArticleRow): Article {
  return { ...rest, reactions: { likes, dislikes } };
}

export async function getArticles(): Promise<Article[]> {
  'use cache'
  cacheLife('hours')

  await demoDelay(2000);

  const rows = await prisma.article.findMany({
    orderBy: { id: 'asc' },
    take: 15,
  });

  return rows.map(toArticle);
}

export async function getArticleById(id: string): Promise<Article | null> {
  'use cache'

  if (!/^\d+$/.test(id) || Number(id) > MAX_INTEGER) {
    cacheLife('minutes');
    return null
  }  

  const articleId = Number(id);

  await demoDelay(2000);

  const article = await prisma.article.findUnique({
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
    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      orderBy: { id: 'asc' },
      select: {  id: true, body: true, likes: true,
        user: {
          select: { id: true, username: true, firstName: true, lastName: true },
        },
      },    
    });

    return comments.map(( { user, ...comment }) => ({
      ... comment,
      user: {
        id: user.id,
        username: user.username,
        fullName: `${user.firstName} ${user.lastName}`
      },
    }));
  } catch(error) {
    console.error('Failed to load comments:', error);
    return null
  }  
}
