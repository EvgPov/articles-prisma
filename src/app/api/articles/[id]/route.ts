  import { getArticleById } from "@/lib/articles";

  export async function GET(
    _request: Request,
    { params }: RouteContext<'/api/articles/[id]'>
  ) {
  const { id } = await params;
  const article = await getArticleById(id)

  if (!article) return Response.json({ error: 'Article not found' }, { status: 404 });

  return Response.json(article)
  }