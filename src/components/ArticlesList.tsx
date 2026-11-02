import Link from "next/link";
import { articleExcerpt } from "@/lib/article-mappers";
import type { Article } from "@/types/article";
import styles from "./ArticlesList.module.css";

export default function ArticlesList({ posts }: { posts: Article[] }) {
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/articles/${post.id}`}>{post.title}</Link>
          <p className="muted">{articleExcerpt(post)}</p>
        </li>
      ))}
    </ul>
  );
}
