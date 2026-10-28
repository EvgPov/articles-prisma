import 'server-only';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/generated/prisma/client';

import { getConfig } from './env';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };


export function getPrisma(): PrismaClient {
  const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter: new PrismaPg({ connectionString: getConfig().DATABASE_URL }),
    });

  globalForPrisma.prisma = prisma;

  return prisma
}