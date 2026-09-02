"use server";

import { revalidatePath } from "next/cache";
import { requireStaffSession, requireSuperAdminSession } from "@/lib/auth/require-staff";
import {
  type CreateAdminResearchInput,
  createAdminResearch,
  deleteAdminResearch,
  getAdminResearchDetail,
  type ResearchStatusLabel,
  updateAdminResearchStatus,
} from "@/lib/research";
import { runSafeAction, type SafeActionResult } from "@/lib/safe-action";
import { revalidateAdminSections } from "@/lib/revalidate-admin";

export async function createResearchAction(input: CreateAdminResearchInput) {
  return runSafeAction("Create research", async () => {
    await requireStaffSession();
    const project = await createAdminResearch(input);
    revalidateAdminSections("research");
    return project;
  });
}

export async function getResearchDetailAction(
  identifier: string,
): Promise<SafeActionResult<Awaited<ReturnType<typeof getAdminResearchDetail>>>> {
  return runSafeAction("Project details", async () => {
    await requireStaffSession();
    return getAdminResearchDetail(identifier);
  });
}

export async function updateResearchStatusAction(
  identifier: string,
  status: ResearchStatusLabel,
) {
  return runSafeAction("Update status", async () => {
    await requireStaffSession();
    const project = await updateAdminResearchStatus(identifier, status);
    revalidateAdminSections("research");
    return project;
  });
}

export async function deleteResearchAction(identifier: string) {
  return runSafeAction("Delete research", async () => {
    await requireSuperAdminSession();

    const deleted = await deleteAdminResearch(identifier);
    if (!deleted) {
      throw new Error("This research project could not be found.");
    }

    revalidateAdminSections("research");
    revalidatePath("/");
    revalidatePath("/researcher");
    revalidatePath("/researcher/research");

    return { id: identifier };
  });
}
