import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import styles from "./account.module.css";

export default function AccountLayout({ children }: LayoutProps<"/">) {
  return (
    <SiteShell>
      <div className={styles.layout}>
        <nav aria-label="Личный кабинет">
          <ul className={styles.list}>
            <li>
              <Link href="/me">Профиль</Link>
            </li>
            <li>
              <Link href="/me/password">Смена пароля</Link>
            </li>
            <li>
              <Link href="/me/sessions">Активные входы</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.content}>{children}</div>
      </div>
    </SiteShell>
  );
}
