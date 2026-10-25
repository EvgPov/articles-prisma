import type { Metadata } from "next";
import Link from "next/link";

import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Агрегатор статей — главная',
  description: 'Агрегатор статей: свежие публикации на разные темы в одном месте. Выбирайте статью из списка и читайте целиком.',
  openGraph: {
    title:'Агрегатор статей',
    description:'Свежие публикации на разные темы в одном месте.',
  }
}

export default function HomePage() {
  return (
    <div className={styles.hero}>
      <h1>Добро пожаловать в агрегатор статей</h1>
      <p>Здесь собраны публикации на самые разные темы. Откройте список,
        выберите заголовок, который вас заинтересовал, и прочитайте статью целиком.</p>
      <Link href="/articles" className="button">Перейти к списку статей →</Link>
    </div>
  );
}
