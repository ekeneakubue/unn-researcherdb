import "server-only";

import { redirect } from "next/navigation";
import {
  canAccessSuperAdmin,
  getStaffSession,
  type StaffSession,
} from "@/lib/auth/session";

export async function requireStaffSession(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireSuperAdminSession(): Promise<StaffSession> {
  const session = await requireStaffSession();
  if (!canAccessSuperAdmin(session.role)) redirect("/admin");
  return session;
}

export async function getOptionalStaffSession(): Promise<StaffSession | null> {
  return getStaffSession();
}
