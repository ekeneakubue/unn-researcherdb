"use server";

import { Prisma } from "@/lib/generated/prisma/client";
import { requireStaffSession, requireSuperAdminSession } from "@/lib/auth/require-staff";
import { deleteAdminResearcher, updateAdminResearcher } from "@/lib/researchers";
import type { UpdateAdminResearcherInput } from "@/lib/researchers-shared";
import { revalidateAdminSections } from "@/lib/revalidate-admin";

export type DeleteResearcherResult =
  | { ok: true }
  | { ok: false; error: string };

export type UpdateResearcherActionResult =
  | { ok: true; researcher: Awaited<ReturnType<typeof updateAdminResearcher>> }
  | { ok: false; error: string };

export async function deleteResearcherAction(
  identifier: string,
): Promise<DeleteResearcherResult> {
  try {
    await requireStaffSession();
    const deleted = await deleteAdminResearcher(identifier);

    if (!deleted) {
      return { ok: false, error: "Researcher not found." };
    }

    revalidateAdminSections("researchers");
    return { ok: true };
  } catch (error) {
    console.error("deleteResearcherAction failed:", error);
    return { ok: false, error: "Could not delete researcher. Please try again." };
  }
}

export async function updateResearcherAction(
  identifier: string,
  input: UpdateAdminResearcherInput,
): Promise<UpdateResearcherActionResult> {
  try {
    await requireSuperAdminSession();
    const researcher = await updateAdminResearcher(identifier, input);
    revalidateAdminSections("researchers");
    return { ok: true, researcher };
  } catch (error) {
    return toResearcherActionError(error);
  }
}

function toResearcherActionError(error: unknown): { ok: false; error: string } {
  if (error instanceof Error && error.message === "Researcher not found.") {
    return { ok: false, error: "This researcher could not be found." };
  }
  if (error instanceof Error && error.message.startsWith("Password must")) {
    return { ok: false, error: error.message };
  }
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return { ok: false, error: "A researcher with this email already exists." };
  }
  throw error;
}
