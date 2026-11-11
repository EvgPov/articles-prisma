import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Вход",
  description: "Вход пользователй, читающих статьи на сайте",
};

export default function LoginPage() {
  return (
    <>
      <h1>Вход</h1>
      <LoginForm />
      <p>
        Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
      </p>
    </>
  );
}
