import { cacheLife } from "next/cache";

import { pool } from '@/lib/db';
import { demoDelay } from "@/lib/demoDelay";

import type { Article } from "@/types/article";
import type { ArticleComment } from "@/types/comment";

const MAX_INTEGER = 2_147_483_647;

const ARTICLE_COLUMNS = `
  id, title, body, tags, views,
  user_id AS "userId",
  json_build_object('likes', likes, 'dislikes', dislikes) AS reactions
`;

export async function getArticles(): Promise<Article[]> {
  'use cache'
  cacheLife('hours')

  await demoDelay(2000);
  const { rows } = await pool.query<Article>(`
    SELECT ${ARTICLE_COLUMNS}
    FROM articles
    ORDER BY id
    LIMIT 15
  `);

  return rows;
}

export async function getArticleById(id: string): Promise<Article | null> {
  'use cache'

  if (!/^\d+$/.test(id) || Number(id) > MAX_INTEGER) {
    cacheLife('minutes');
    return null
  }  

  const articleId = Number(id);

  await demoDelay(2000);

  const { rows } = await pool.query<Article>(`
  SELECT ${ARTICLE_COLUMNS}
  FROM articles
  WHERE id = $1
`, [articleId]);
  
  if (rows.length === 0) {
    cacheLife('minutes');
    return null
  }

  cacheLife('days')
  return rows[0];
}

export async function getArticleComments(postId: number): Promise<ArticleComment[] | null> {
  'use cache'
  cacheLife('minutes')

  await demoDelay(3000);

  try {
    const { rows } = await pool.query<ArticleComment>(`
    SELECT c.id, c.body, c.likes,
      json_build_object(
      'id', u.id,
      'username', u.username,
      'fullName', u.first_name || ' ' || u.last_name
    ) AS "user"
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.post_id = $1
    ORDER BY c.id
    `, [postId]);

    return rows
  } catch(error) {
    console.error('Failed to load comments:', error);
    return null
  }  
}
