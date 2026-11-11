import type { Metadata } from "next";
import { Suspense } from "react";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Смена пароля",
  description: "Смена пароля пользователя",
};

export default function PasswordPage() {
  return (
    <>
      <h1>Смена пароля</h1>
      <Suspense fallback={<p className="muted">Загружаем...</p>}>
        <PasswordSection />
      </Suspense>
    </>
  );
}

async function PasswordSection() {
  await requireSession();
  return <p>Здесь будет форма смены пароля</p>;
}
