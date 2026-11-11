import Link from "next/link";

import type { ReactNode } from "react";
import { Suspense } from "react";
import styles from "./SiteShell.module.css";
import UserMenu from "./UserMenu";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/">Главная</Link>
          <Link href="/articles">Статьи</Link>
          <Link href="/tags">Теги</Link>
          <Link href="/about">О проекте</Link>
          <div className={styles.suspense}>
            <Suspense fallback={null}>
              <UserMenu />
            </Suspense>
          </div>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        Источник данных: PostgreSQL (Prisma)
      </footer>
    </>
  );
}
