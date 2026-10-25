import { getArticleComments } from "@/lib/articles";

export default async function ArticleComments({postId}: {postId: number}) {
  const comments = await getArticleComments(postId);

  if (!comments) return <p className="muted">Не удалось загрузить комментарии</p>;
  if (comments.length === 0) return <p className="muted">Комментариев пока нет</p>;

  return (
    <section>
      <h2>Комментарии ({comments.length})</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.user.fullName}</strong>: {comment.body}
          </li>
        ))}
      </ul>
    </section>
  )
}