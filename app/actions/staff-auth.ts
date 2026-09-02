"use server";

import { redirect } from "next/navigation";
import { clearStaffSession, setStaffSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export type StaffLoginResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

export async function loginStaffAction(input: {
  email: string;
  password: string;
}): Promise<StaffLoginResult> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    return { ok: false, error: "Enter your email and password." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, error: "Invalid email or password." };
  }

  if (user.status !== "ACTIVE") {
    return { ok: false, error: "Your account is not active yet. Contact ORID." };
  }

  await setStaffSession({
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastActiveAt: new Date() },
  });

  return {
    ok: true,
    redirectTo: user.role === "SUPER_ADMIN" ? "/super-admin" : "/admin",
  };
}

export async function logoutStaffAction() {
  await clearStaffSession();
  redirect("/login");
}
