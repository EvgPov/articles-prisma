import { cacheLife } from "next/cache";
import { demoDelay } from "@/lib/demoDelay";
import { getPrisma } from "@/lib/prisma";

import type { Author } from "@/types/author";

export async function getAuthorById(userId: number): Promise<Author | null> {
  "use cache";

  await demoDelay(2000);

  try {
    const user = await getPrisma().author.findUnique({
      select: { id: true, firstName: true, lastName: true },
      where: { id: userId },
    });

    if (!user) {
      cacheLife("minutes");
      return null;
    }

    cacheLife("weeks");
    return user;
  } catch (error) {
    console.error("Failed to load user:", error);
    cacheLife("minutes");
    return null;
  }
}
