import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { UserRole } from "@/lib/generated/prisma/client";
import { getSessionSecret, isSecureCookie } from "@/lib/auth/session-secret";
import { logServiceFailure } from "@/lib/service-error";

export const STAFF_SESSION_COOKIE = "unn_staff_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type StaffSession = {
  userId: string;
  role: UserRole;
  email: string;
  name: string;
};

type SessionPayload = StaffSession & { exp: number };

function encodeSession(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function parseSessionToken(token: string): StaffSession | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    const { userId, role, email, name } = payload;
    return { userId, role, email, name };
  } catch {
    return null;
  }
}

export async function getStaffSession(): Promise<StaffSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(STAFF_SESSION_COOKIE)?.value;
    if (!token) return null;
    return parseSessionToken(token);
  } catch (error) {
    logServiceFailure("Staff session", error);
    return null;
  }
}

export async function setStaffSession(session: StaffSession) {
  const cookieStore = await cookies();
  cookieStore.set(
    STAFF_SESSION_COOKIE,
    encodeSession({ ...session, exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: isSecureCookie(),
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    },
  );
}

export async function clearStaffSession() {
  const cookieStore = await cookies();
  cookieStore.delete(STAFF_SESSION_COOKIE);
}

export function canAccessSuperAdmin(role: UserRole): boolean {
  return role === "SUPER_ADMIN";
}

export function getAssignableRoleLabels(role: UserRole): readonly string[] {
  if (role === "SUPER_ADMIN") {
    return ["Super-admin", "Admin", "Director", "Officer"];
  }
  return ["Admin", "Director", "Officer"];
}

export function canCreateSuperAdminUser(role: UserRole): boolean {
  return role === "SUPER_ADMIN";
}
