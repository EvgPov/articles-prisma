import { cacheLife } from "next/cache";
import { demoDelay } from "@/lib/demoDelay";
import { getPrisma } from "@/lib/prisma";

import type { Author } from "@/types/author";

export async function getAuthorById(authorId: number): Promise<Author | null> {
  "use cache";

  await demoDelay(2000);

  try {
    const author = await getPrisma().author.findUnique({
      select: { id: true, firstName: true, lastName: true },
      where: { id: authorId },
    });

    if (!author) {
      cacheLife("minutes");
      return null;
    }

    cacheLife("weeks");
    return author;
  } catch (error) {
    console.error("Failed to load author:", error);
    cacheLife("minutes");
    return null;
  }
}
