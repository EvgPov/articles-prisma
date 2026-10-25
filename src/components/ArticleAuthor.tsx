import { demoDelay } from "@/lib/demoDelay";

import type { User } from "@/types/user";


async function getAuthor (userId: number): Promise<User | null> {
  await demoDelay(2000);

  const response = await fetch(`https://dummyjson.com/users/${userId}`);

  if (!response.ok) return null;
  
  return response.json()
}


export default async function ArticleAuthor({userId}: {userId: number}) {
  const author = await getAuthor(userId);

  if (!author) return <p className="muted">Автор неизвестен</p>;

  return (
    <p className="muted">
      Автор: {author.firstName} {author.lastName}
    </p>
  )
}