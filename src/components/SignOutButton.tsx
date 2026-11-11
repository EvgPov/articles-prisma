"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import styles from "./SignOutButton.module.css";

export default function SignOutButton() {
  const router = useRouter();

  async function handleClick() {
    await authClient.signOut();
    router.refresh();
  }

  return (
    <button className={styles.button} type="button" onClick={handleClick}>
      Выйти
    </button>
  );
}
