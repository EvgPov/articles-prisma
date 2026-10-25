import { cacheLife } from "next/cache";

import { demoDelay } from "@/lib/demoDelay";

import type { User } from "@/types/user";

export async function getUserById (userId: number): Promise<User | null> {
  'use cache'
 
   await demoDelay(2000);
 
   const response = await fetch(`https://dummyjson.com/users/${userId}`);
 
   if (!response.ok) {
    cacheLife('minutes');
    return null;
   } 
   
   cacheLife('weeks');
   return response.json()
}