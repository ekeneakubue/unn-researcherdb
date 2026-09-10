import "dotenv/config";
import { defineConfig, env } from "prisma/config";

function normalizeDatabaseUrl(connectionString: string) {
  try {
    const url = new URL(connectionString);
    const mode = url.searchParams.get("sslmode");
    // channel_binding can fail with some Neon + driver combinations
    url.searchParams.delete("channel_binding");
    if (
      (mode === "require" || mode === "prefer" || mode === "verify-ca") &&
      !url.searchParams.has("uselibpqcompat")
    ) {
      url.searchParams.set("uselibpqcompat", "true");
    }
    // Neon cold starts often exceed Prisma's default ~5s window (P1001)
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "60");
    }
    return url.toString();
  } catch {
    return connectionString;
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: normalizeDatabaseUrl(env("DATABASE_URL")),
  },
});
