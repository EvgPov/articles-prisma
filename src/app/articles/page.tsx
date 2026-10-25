import ArticlesList from "@/components/ArticlesList";

import type { Metadata } from "next";
import type { Article } from "@/types/article";

import { demoDelay } from "@/lib/demoDelay";

export const metaData: Metadata = {
  title: 'Список статей',
  description: 'Все статьи агрегатора: выберите заголовок, чтобы прочитать статью целиком.',
}

export default async function ArticlesPage() {
  await demoDelay(2000);
  const response = await fetch('https://dummyjson.com/posts?limit=15');

  if (!response.ok) throw new Error('Failed to load articles')

  const { posts }:{ posts: Article[] } = await response.json()

  return (
    <div>
      <h1>Список статей</h1>
      <ArticlesList posts={posts}/>
    </div>
  )
}