"use server";

import { redirect } from "next/navigation";
import {
  clearResearcherSession,
  setResearcherSession,
} from "@/lib/auth/researcher-session";
import { SessionConfigError } from "@/lib/auth/session-secret";
import { findResearcherForLogin } from "@/lib/auth/researcher-login";
import { verifyPassword } from "@/lib/password";
import { logServiceFailure, toServiceError } from "@/lib/service-error";

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

  try {
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
  } catch (error) {
    logServiceFailure("Researcher login", error);
    if (error instanceof SessionConfigError) {
      return {
        ok: false,
        error: "Sign-in is not configured on this server. Set SESSION_SECRET and try again.",
      };
    }
    return { ok: false, error: toServiceError(error, "Sign in").message };
  }
}

export async function logoutResearcherAction() {
  await clearResearcherSession();
  redirect("/researcher/login");
}
