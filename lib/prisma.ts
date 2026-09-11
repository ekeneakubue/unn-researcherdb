import "server-only";

import dns from "node:dns";
import net from "node:net";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

// Neon resolves to both A and AAAA records. On networks without IPv6 routing the
// happy-eyeballs attempt fails and node reports the whole connect as ETIMEDOUT,
// so pin lookups to IPv4 and connect to a single address.
dns.setDefaultResultOrder("ipv4first");
net.setDefaultAutoSelectFamily(false);

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
      // Neon autosuspend wake can exceed 8s; align with URL connect_timeout.
      connectionTimeoutMillis: 60_000,
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
