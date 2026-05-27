/**
 * Prisma client singleton.
 *
 * - Uses the Prisma 7 `prisma-client` generator output at ../../generated/client
 * - Wires the PrismaPg adapter from the DATABASE_URL env var
 * - Stores the instance on `globalThis` in dev so Next.js HMR doesn't open
 *   a new connection on every reload
 */
import { PrismaClient } from '../../generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
