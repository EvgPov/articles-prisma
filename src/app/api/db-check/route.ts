import { connection } from "next/server";

import { getPrisma } from "@/lib/prisma";

export async function GET () {
  await connection()
  
  try {
    await getPrisma().$queryRaw`SELECT 1`

    return Response.json({ "db": "ok" }, { status: 200 })
  } catch (err) {
      console.error(err)
      return Response.json({ "db": "error" }, { status: 503 })
  }
}
