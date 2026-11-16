"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";
import styles from "./AuthForm.module.css";

export default function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setUpdateMessage("");

    const formElement = event.currentTarget;

    const form = new FormData(formElement);
    const newPass = String(form.get("newPassword"));
    const confPass = String(form.get("confirmPassword"));
    const currentPass = String(form.get("currentPassword"));

    if (newPass !== confPass) {
      setError("Новые пароли не совпадают");
      return;
    }

    setPending(true);

    const { error } = await authClient.changePassword({
      currentPassword: currentPass,
      newPassword: newPass,
      revokeOtherSessions: true,
    });

    setPending(false);
    if (error) {
      setError(authErrorMessage(error.code));
      return;
    }
    setUpdateMessage("Пароль изменён");
    formElement.reset();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="currentPassword">Текущий пароль</label>
      <input
        id="currentPassword"
        type="password"
        name="currentPassword"
        autoComplete="current-password"
        required
      />

      <label htmlFor="newPassword">Новый пароль</label>
      <input
        id="newPassword"
        type="password"
        name="newPassword"
        autoComplete="new-password"
        minLength={8}
        required
      />

      <label htmlFor="confirmPassword">Повторите новый пароль</label>
      <input
        id="confirmPassword"
        type="password"
        name="confirmPassword"
        autoComplete="new-password"
        minLength={8}
        required
      />
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <p className={styles.success} role="status">
        {updateMessage}
      </p>

      <button className="button" type="submit" disabled={pending}>
        {pending ? "Сохраняем…" : "Сохранить"}
      </button>
    </form>
  );
}
