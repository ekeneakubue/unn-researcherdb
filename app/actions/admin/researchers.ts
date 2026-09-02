"use server";

import { requireStaffSession } from "@/lib/auth/require-staff";
import { deleteAdminResearcher } from "@/lib/researchers";
import { revalidateAdminSections } from "@/lib/revalidate-admin";

export type DeleteResearcherResult =
  | { ok: true }
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
