"use server";

import { revalidatePath } from "next/cache";
import { setResearcherSession } from "@/lib/auth/researcher-session";
import { Prisma } from "@/lib/generated/prisma/client";
import { toServiceError } from "@/lib/service-error";
import { createResearcherAccount } from "@/lib/researchers";
import type { ResearcherSignupInput } from "@/lib/researchers-shared";
import { revalidateAdminSections } from "@/lib/revalidate-admin";

export type RegisterResearcherResult =
  | {
      ok: true;
      researcher: {
        id: string;
        reference: string | null;
        name: string;
        email: string;
      };
      redirectTo: string;
    }
  | {
      ok: false;
      error: string;
    };

export async function registerResearcherAction(
  input: ResearcherSignupInput,
): Promise<RegisterResearcherResult> {
  try {
    const researcher = await createResearcherAccount(input);

    await setResearcherSession({
      researcherId: researcher.id,
      email: researcher.email,
      name: researcher.name,
      faculty: researcher.faculty,
      reference: researcher.reference,
    });

    revalidatePath("/");
    revalidateAdminSections("researchers");

    return { ok: true, researcher, redirectTo: "/researcher" };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        ok: false,
        error: "A researcher with this email already exists.",
      };
    }

    console.error("registerResearcherAction failed:", error);

    return {
      ok: false,
      error: toServiceError(error, "Create account").message,
    };
  }
}
