/**
 * Prisma 7 config — connection URL lives here (not in schema.prisma).
 * `prisma migrate` / `prisma db push` read this file. Runtime queries go
 * through src/lib/prisma.ts, which builds a PrismaPg adapter from the same
 * DATABASE_URL env var.
 *
 * docs: https://pris.ly/d/config-datasource
 */
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
});
