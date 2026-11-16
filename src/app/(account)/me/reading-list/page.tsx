import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Прочитать позже",
  description: "Статьи, отложенные для чтения позже",
};

export default function ReadingListPage() {
  return (
    <>
      <h1>Прочитать позже</h1>
      <Suspense fallback={<p className="muted">Загружаем…</p>}>
        <ReadingListSection />
      </Suspense>
    </>
  );
}

async function ReadingListSection() {
  await requireSession();
  return (
    <>
      <p>Список пока пуст.</p>
      <p className="muted">
        Здесь будут статьи, которые вы отложили, чтобы вернуться к ним позже.
      </p>
      <Link href="/articles">Перейти к статьям →</Link>
    </>
  );
}
