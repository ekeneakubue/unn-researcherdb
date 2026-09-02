"use server";

import { redirect } from "next/navigation";
import {
  clearResearcherSession,
  setResearcherSession,
} from "@/lib/auth/researcher-session";
import { verifyPassword } from "@/lib/password";
import { findResearcherForLogin } from "@/lib/auth/researcher-login";

export type ResearcherLoginResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

export async function loginResearcherAction(input: {
  email: string;
  password: string;
}): Promise<ResearcherLoginResult> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    return { ok: false, error: "Enter your email and password." };
  }

  const researcher = await findResearcherForLogin(email);

  if (!researcher?.passwordHash || !verifyPassword(password, researcher.passwordHash)) {
    return { ok: false, error: "Invalid email or password." };
  }

  if (researcher.status !== "ACTIVE") {
    return { ok: false, error: "Your account is not active. Contact ORID." };
  }

  await setResearcherSession({
    researcherId: researcher.id,
    email: researcher.email,
    name: researcher.name,
    faculty: researcher.faculty,
    reference: researcher.reference,
  });

  return { ok: true, redirectTo: "/researcher" };
}

export async function logoutResearcherAction() {
  await clearResearcherSession();
  redirect("/researcher/login");
}
