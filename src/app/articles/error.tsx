'use client';

import { useEffect } from 'react';

type ErrorProps = {
  error: unknown;
  retry: () => void;
};

export default function ArticlesError({ error, retry }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h1>Не удалось загрузить статьи</h1>
      <p className="muted">Попробуйте ещё раз через несколько секунд.</p>
      <button className="button" onClick={() => retry()}>
        Попробовать снова
      </button>
    </div>
  );
}