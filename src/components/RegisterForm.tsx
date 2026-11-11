"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";
import styles from "./AuthForm.module.css";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const { error } = await authClient.signUp.email({
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    setPending(false);
    if (error) {
      setError(authErrorMessage(error.code));
      return;
    }
    router.replace("/");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="name">Имя</label>
      <input id="name" type="text" name="name" autoComplete="name" required />

      <label htmlFor="email">Почта</label>
      <input
        id="email"
        type="email"
        name="email"
        autoComplete="email"
        required
      />

      <label htmlFor="password">Пароль</label>
      <input
        id="password"
        type="password"
        name="password"
        autoComplete="new-password"
        required
        minLength={8}
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Регистрируем..." : "Зарегистрироваться"}
      </button>
    </form>
  );
}
