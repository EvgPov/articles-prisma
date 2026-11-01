import { connection } from "next/server";
import { getConfig } from "@/lib/env";

export async function GET() {
  await connection();
  return Response.json({ status: "ok", version: getConfig().APP_VERSION });
}
