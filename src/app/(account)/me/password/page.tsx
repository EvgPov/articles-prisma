import type { Metadata } from "next";
import { Suspense } from "react";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Смена пароля",
  description: "Смена пароля пользователя",
};

export default function PasswordPage() {
  return (
    <>
      <h1>Смена пароля</h1>
      <p className="muted">
        После смены пароля на этом устройстве вы останетесь в системе, а на
        остальных нужно будет войти заново.
      </p>
      <Suspense fallback={<p className="muted">Загружаем...</p>}>
        <PasswordSection />
      </Suspense>
    </>
  );
}

async function PasswordSection() {
  await requireSession();
  return <ChangePasswordForm />;
}
