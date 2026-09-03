import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

/**
 * pg v8 treats sslmode=require/prefer/verify-ca as verify-full and warns that
 * future versions will change that. Neon works with explicit verify-full.
 */
function normalizeDatabaseUrl(connectionString: string | undefined) {
  if (!connectionString) return connectionString;

  try {
    const url = new URL(connectionString);
    const mode = url.searchParams.get("sslmode");
    if (mode === "require" || mode === "prefer" || mode === "verify-ca") {
      url.searchParams.set("sslmode", "verify-full");
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

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
