import type { NextConfig } from "next";
import path from "node:path";

function r2RemotePattern() {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) return null;

  try {
    const url = new URL(publicUrl);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      pathname: "/**" as const,
    };
  } catch {
    return null;
  }
}

const r2Pattern = r2RemotePattern();

const nextConfig: NextConfig = {
  // Parent folder has a stray package-lock.json; pin Turbopack to this app.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: r2Pattern ? [r2Pattern] : [],
  },
};

export default nextConfig;
