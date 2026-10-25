import Link from "next/link";
import styles from './ArticlesList.module.css'

import type { Article } from "@/types/article";

export default function ArticlesList({ posts }: { posts: Article[] }) {
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/articles/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )  
}    
