import Link from "next/link";

import styles from "./layout.module.css";

export default function OpenLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/">Главная</Link>
          <Link href="/articles">Статьи</Link>
          <Link href="/about">О проекте</Link>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        Источник данных: PostgreSQL (Prisma)
      </footer>
    </>
  );
}
