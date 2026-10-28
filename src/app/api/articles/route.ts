import { connection } from "next/server";

import { getArticles } from "@/lib/articles";

export async function GET () {
  await connection()
  const articles = await getArticles()
  return Response.json(articles)
}