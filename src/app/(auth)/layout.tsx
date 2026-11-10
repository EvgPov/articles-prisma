import Link from "next/link";
import styles from "./auth.module.css";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={styles.page}>
      <Link href="/">← На главную</Link>
      <div className={styles.card}>{children}</div>
    </div>
  );
}
