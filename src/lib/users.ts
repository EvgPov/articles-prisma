import { cacheLife } from "next/cache";

import { prisma } from '@/lib/prisma'
import { demoDelay } from "@/lib/demoDelay";

import type { User } from "@/types/user";

export async function getUserById(userId: number): Promise<User | null> {
  'use cache'
  
  await demoDelay(2000);

  try {
    const user = await prisma.user.findUnique({
        select: { id: true, firstName: true, lastName: true },
        where: { id: userId }
      });
    
    if (!user) {
      cacheLife('minutes');
      return null
    }
  
    cacheLife('weeks')
    return user
  } catch(error) {
    console.error('Failed to load user:', error);
    cacheLife('minutes');
    return null
  }  
}