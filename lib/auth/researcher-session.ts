import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getSessionSecret, isSecureCookie } from "@/lib/auth/session-secret";
import { logServiceFailure } from "@/lib/service-error";

export const RESEARCHER_SESSION_COOKIE = "unn_researcher_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

export type ResearcherSession = {
  researcherId: string;
  email: string;
  name: string;
  faculty: string;
  reference: string | null;
};

type SessionPayload = ResearcherSession & { exp: number };

function encodeSession(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function parseResearcherSessionToken(token: string): ResearcherSession | null {
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
    const { researcherId, email, name, faculty, reference } = payload;
    return { researcherId, email, name, faculty, reference };
  } catch {
    return null;
  }
}

export async function getResearcherSession(): Promise<ResearcherSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(RESEARCHER_SESSION_COOKIE)?.value;
    if (!token) return null;
    return parseResearcherSessionToken(token);
  } catch (error) {
    logServiceFailure("Researcher session", error);
    return null;
  }
}

export async function setResearcherSession(session: ResearcherSession) {
  const cookieStore = await cookies();
  cookieStore.set(
    RESEARCHER_SESSION_COOKIE,
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

export async function clearResearcherSession() {
  const cookieStore = await cookies();
  cookieStore.delete(RESEARCHER_SESSION_COOKIE);
}
