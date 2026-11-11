import type { Metadata } from "next";
import { Suspense } from "react";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Профиль",
  description: "Профиль пользователя: имя, почта, смена имени",
};

export default function MePage() {
  return (
    <>
      <h1>Профиль</h1>
      <Suspense fallback={<p className="muted">Загружаем…</p>}>
        <MeSection />
      </Suspense>
    </>
  );
}

async function MeSection() {
  await requireSession();
  return <p>Здесь будет форма профиля</p>;
}
