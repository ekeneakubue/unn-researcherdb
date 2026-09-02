import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;

  const derived = scryptSync(password, salt, 64).toString("hex");
  const hashBuffer = Buffer.from(hash, "hex");
  const derivedBuffer = Buffer.from(derived, "hex");

  if (hashBuffer.length !== derivedBuffer.length) return false;
  return timingSafeEqual(hashBuffer, derivedBuffer);
}
