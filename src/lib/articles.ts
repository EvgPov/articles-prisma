import { cacheLife } from "next/cache";

import { demoDelay } from "@/lib/demoDelay";

import type { Article } from "@/types/article";
import type { ArticleComment } from "@/types/comment";

export async function getArticles(): Promise<Article[]> {
  'use cache'
  cacheLife('hours')

  await demoDelay(2000);
  const response = await fetch('https://dummyjson.com/posts?limit=15');

  if (!response.ok) throw new Error('Failed to load articles')

  const { posts }:{ posts: Article[] } = await response.json()

  return posts;
}

export async function getArticleById(id: string): Promise<Article | null> {
  'use cache'
  cacheLife('days')

  await demoDelay(2000);

  const response = await fetch(`https://dummyjson.com/posts/${id}`);

  if (response.status === 404) return null;

  if (!response.ok) throw new Error(`Failed to load article ${id}`)

  return response.json()
}

export async function getArticleComments(postId: number): Promise<ArticleComment[] | null> {
  'use cache'
  cacheLife('minutes')

  await demoDelay(3000);

  const response = await fetch(`https://dummyjson.com/comments/post/${postId}`);

  if (!response.ok) return null;
  
  const { comments }: { comments: ArticleComment[] }  = await response.json();
  return comments
}
