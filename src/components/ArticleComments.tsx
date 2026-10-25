import { demoDelay } from "@/lib/demoDelay";

import type { ArticleComment } from "@/types/comment";


async function getComments(postId: number): Promise<ArticleComment[] | null> {
  await demoDelay(3000);

  const response = await fetch(`https://dummyjson.com/comments/post/${postId}`);

  if (!response.ok) return null;
  
  const { comments }: { comments: ArticleComment[] }  = await response.json();
  return comments
}


export default async function ArticleComments({postId}: {postId: number}) {
  const comments = await getComments(postId);

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