import { connection } from "next/server";

import ArticlesList from "@/components/ArticlesList";

import type { Metadata } from "next";

import { getArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: 'Список статей',
  description: 'Все статьи агрегатора: выберите заголовок, чтобы прочитать статью целиком.',
}

export default async function ArticlesPage() {
  await connection()
  const posts = await getArticles();

  return (
    <div>
      <h1>Список статей</h1>
      <ArticlesList posts={posts}/>
    </div>
  )
}