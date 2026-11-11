import type { Metadata } from "next";
import { Suspense } from "react";
import { requireSession } from "@/lib/session";
import styles from "./page.module.css";

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
  const session = await requireSession();
  const registrationDate = new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "long",
    timeZone: "Europe/Moscow",
  }).format(session.user.createdAt);
  return (
    <dl className={styles.profile}>
      <dt className="muted">Имя</dt>
      <dd>{session.user.name}</dd>
      <dt className="muted">Почта</dt>
      <dd>{session.user.email}</dd>
      <dt className="muted">Дата регистрации</dt>
      <dd>{registrationDate}</dd>
    </dl>
  );
}
