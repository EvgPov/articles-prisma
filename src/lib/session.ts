import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

export async function requireSession() {
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/login");
  }

  return session;
}
