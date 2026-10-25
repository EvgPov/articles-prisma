import { getUserById } from "@/lib/users";

export default async function ArticleAuthor({userId}: {userId: number}) {
  const author = await getUserById(userId);

  if (!author) return <p className="muted">Автор неизвестен</p>;

  return (
    <p className="muted">
      Автор: {author.firstName} {author.lastName}
    </p>
  )
}