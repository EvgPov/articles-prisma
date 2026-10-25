import pg from 'pg';

type DummyUser = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
};

type DummyPost = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: { likes: number; dislikes: number };
  views: number;
  userId: number;
};

type DummyComment = {
  id: number;
  body: string;
  likes: number;
  postId: number;
  user: { id: number };
};

async function fetchAll<T>(resource: string): Promise<T[]> {
  const response = await fetch(`https://dummyjson.com/${resource}?limit=0`);
  if (!response.ok) throw new Error(`Failed to fetch ${resource}: ${response.status}`);
  const data = await response.json();
  return data[resource];
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  const [users, posts, comments] = await Promise.all([
    fetchAll<DummyUser>('users'),
    fetchAll<DummyPost>('posts'),
    fetchAll<DummyComment>('comments'),
  ]);

  await client.query('BEGIN');
  await client.query('TRUNCATE comments, articles, users');

  for (const user of users) {
    await client.query(
      'INSERT INTO users (id, username, first_name, last_name) VALUES ($1, $2, $3, $4)',
      [user.id, user.username, user.firstName, user.lastName],
    );
  }

  for (const article of posts) {
    await client.query(
      'INSERT INTO articles (id, title, body, tags, likes, dislikes, views, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [article.id, article.title, article.body, article.tags, article.reactions.likes, article.reactions.dislikes, article.views, article.userId],
    );
  }

  for (const comment of comments) {
    await client.query(
      'INSERT INTO comments (id, body, likes, post_id, user_id) VALUES ($1, $2, $3, $4, $5)',
      [comment.id, comment.body, comment.likes, comment.postId, comment.user.id],
    );
  }

  await client.query('COMMIT');
  console.log(
    `Seeded: ${users.length} users, ${posts.length} articles, ${comments.length} comments`,
  );
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  await client.end();
}