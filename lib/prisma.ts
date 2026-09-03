import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

/**
 * Keep Neon-compatible sslmode=require. pg v8 warns about the alias; uselibpqcompat
 * preserves current semantics without forcing verify-full (which can fail on serverless).
 */
function normalizeDatabaseUrl(connectionString: string | undefined) {
  if (!connectionString) return connectionString;

  try {
    const url = new URL(connectionString);
    const mode = url.searchParams.get("sslmode");
    if (
      (mode === "require" || mode === "prefer" || mode === "verify-ca") &&
      !url.searchParams.has("uselibpqcompat")
    ) {
      url.searchParams.set("uselibpqcompat", "true");
    }
    return url.toString();
  } catch {
    return connectionString;
  }
}

function createPrismaClient() {
  const connectionString = normalizeDatabaseUrl(process.env.DATABASE_URL);
  const pool =
    globalForPrisma.pool ??
    new pg.Pool({
      connectionString,
      // Neon pooler: fail fast so pages can show the connection modal instead of hanging.
      connectionTimeoutMillis: 8_000,
      idleTimeoutMillis: 20_000,
      max: 5,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
