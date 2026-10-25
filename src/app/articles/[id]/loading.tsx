import { Suspense } from "react";

import ArticleLoadingText from '@/components/ArticleLoadingText'

export default async function Loading() {
  return (
    <p className="muted">
      <Suspense fallback="Загрузка статьи ...">
        <ArticleLoadingText />
      </Suspense>
    </p>
  ) 
}