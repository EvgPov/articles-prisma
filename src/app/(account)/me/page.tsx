import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профиль",
  description: "Профиль пользователя: имя, почта, смена имени",
};

export default function MePage() {
  return <h1>Профиль</h1>;
}
