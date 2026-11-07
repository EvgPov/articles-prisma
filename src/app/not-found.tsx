import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Страница не найдена",
};

export default function NotFound() {
  return (
    <SiteShell>
      <h1>Страница не найдена</h1>
      <p className="muted">
        Возможно, она была удалена или адрес указан неверно.
      </p>
      <div className={styles.actions}>
        <Link href="/" className="button">
          На главную
        </Link>
        <Link href="/articles" className="button">
          К статьям
        </Link>
      </div>
    </SiteShell>
  );
}
