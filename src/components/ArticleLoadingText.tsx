'use client';

import { useParams } from 'next/navigation';

export default function ArticleLoadingText() {
  const { id } = useParams<{ id: string }>();
  return <>Загрузка статьи #{id} ...</>;
}