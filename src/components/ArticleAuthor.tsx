import { getAuthorById } from "@/lib/authors";

export default async function ArticleAuthor({
  authorId,
}: {
  authorId: number;
}) {
  const author = await getAuthorById(authorId);

  if (!author) return <p className="muted">Автор неизвестен</p>;

  return (
    <p className="muted">
      Автор: {author.firstName} {author.lastName}
    </p>
  );
}
