import type { Metadata } from "next";
import { Suspense } from "react";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Активные входы",
  description: "Активные входы пользователя",
};

export default function SessionsPage() {
  return (
    <>
      <h1>Активные входы</h1>
      <Suspense fallback={<p className="muted">Загружаем...</p>}>
        <SessionSection />
      </Suspense>
    </>
  );
}

async function SessionSection() {
  await requireSession();
  return <p>Здесь будет список активных входов</p>;
}
