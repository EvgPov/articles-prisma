import { headers } from "next/headers";
import Link from "next/link";
import { getAuth } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

export default async function UserMenu() {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <Link href="/login">Войти</Link>;
  }

  return (
    <>
      <span>{session.user.name}</span>
      <SignOutButton />
    </>
  );
}
