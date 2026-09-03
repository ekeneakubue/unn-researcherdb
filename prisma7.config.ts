import "dotenv/config";
import { defineConfig, env } from "prisma/config";

function normalizeDatabaseUrl(connectionString: string) {
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

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: normalizeDatabaseUrl(env("DATABASE_URL")),
  },
});
