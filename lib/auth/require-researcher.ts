import "server-only";

import { redirect } from "next/navigation";
import {
  getResearcherSession,
  type ResearcherSession,
} from "@/lib/auth/researcher-session";

export async function requireResearcherSession(): Promise<ResearcherSession> {
  const session = await getResearcherSession();
  if (!session) redirect("/researcher/login");
  return session;
}

export async function getOptionalResearcherSession(): Promise<ResearcherSession | null> {
  return getResearcherSession();
}
