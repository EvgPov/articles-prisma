import { getArticles } from "@/lib/articles";

export async function GET () {
  const articles = await getArticles()
  return Response.json(articles)
}