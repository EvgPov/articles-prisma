"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";
import styles from "./AuthForm.module.css";

export default function ProfileNameForm({ name }: { name: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setUpdateMessage("");

    const form = new FormData(event.currentTarget);
    const newName = String(form.get("name")).trim();
    if (newName === "") {
      setError("Имя не может состоять из одних пробелов");
      return;
    }

    setPending(true);

    const { error } = await authClient.updateUser({
      name: newName,
    });

    setPending(false);
    if (error) {
      setError(authErrorMessage(error.code));
      return;
    }
    setUpdateMessage("Имя сохранено");
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="name">Новое имя</label>
      <input
        id="name"
        type="text"
        name="name"
        defaultValue={name}
        autoComplete="name"
        required
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <p className="seccess" role="status">
        {updateMessage}
      </p>

      <button className="button" type="submit" disabled={pending}>
        {pending ? "Сохраняем…" : "Сохранить"}
      </button>
    </form>
  );
}
