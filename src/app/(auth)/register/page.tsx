import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Регистрация",
  description: "Регистрация пользователей, читающих статьи на сайте",
};

export default function RegisterPage() {
  return (
    <>
      <h1>Регистрация</h1>
      <RegisterForm />
    </>
  );
}
