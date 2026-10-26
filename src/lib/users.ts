import { cacheLife } from "next/cache";

import { pool } from '@/lib/db';
import { demoDelay } from "@/lib/demoDelay";

import type { User } from "@/types/user";

export async function getUserById(userId: number): Promise<User | null> {
  'use cache'
  
  await demoDelay(2000);

  try {
    const { rows } = await pool.query<User>(`
    SELECT id, first_name AS "firstName", last_name AS "lastName"
    FROM users
    WHERE id = $1
  `, [userId]);
    
    if (rows.length === 0) {
      cacheLife('minutes');
      return null
    }
  
    cacheLife('weeks')
    return rows[0]
  } catch(error) {
    console.error('Failed to load user:', error);
    cacheLife('minutes');
    return null
  }  
}