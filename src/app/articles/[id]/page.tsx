export default async function ArticlePage({ params }: PageProps<'/articles/[id]'>) {
  const { id } = await params;
  return <h1>Статья #{id}</h1>;
}