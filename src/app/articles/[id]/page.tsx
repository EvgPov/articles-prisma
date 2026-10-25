import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import BackButton from "@/components/BackButton";
import ArticleAuthor from "@/components/ArticleAuthor"
import ArticleComments from "@/components/ArticleComments"

import { getArticleById } from "@/lib/articles";


export async function generateMetadata({ params }: PageProps<'/articles/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) return { title: 'Статья не найдена' };

  return {
    title: article.title,
    description: article.body.slice(0, 160)
  }
}

export default async function ArticlePage({ params }: PageProps<'/articles/[id]'>) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) notFound();

  return (
  <article>
    <BackButton/>
    <h1>{article.title}</h1>

    <Suspense fallback={<p className="muted">Загружаем автора...</p>}>
        <ArticleAuthor userId={article.userId} />
    </Suspense>

    <p>{article.body}</p>

    <Suspense fallback={<p className="muted">Загружаем комментарии...</p>}>
        <ArticleComments postId={article.id} />
    </Suspense>

    <p className="muted">
      Теги: {article.tags.join(', ')} · Просмотры: {article.views}
    </p>
  </article>
  )
}