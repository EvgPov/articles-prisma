import Link from "next/link";
import localFont from 'next/font/local'

import type { Metadata } from "next";

import "./globals.css";
import styles from './layout.module.css'

const mainFont = localFont({
  src: [
    { path: './fonts/Montserrat-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/Montserrat-Bold.ttf', weight: '700', style: 'normal'}
  ],
  variable: "--font-main",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s — Агрегатор статей',
    default: 'Агрегатор статей',
  },
  description: 'Агрегатор статей: свежие публикации на разные темы в одном месте.',
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={mainFont.variable}
    >
      <body>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <Link href="/">Главная</Link>
            <Link href="/articles">Статьи</Link>
          </nav>
        </header>

        <main className={styles.main}>{children}</main>

        <footer className={styles.footer}>
          Источник данных:{' '}
          <a href="https://dummyjson.com" target="_blank" rel="noopener noreferrer">
            DummyJSON API
          </a>
        </footer>
      </body>
    </html>
  );
}
