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
import type { CreateResearchFiles, NewResearch } from "@/lib/research-shared";
import { uploadEquipmentPhoto, uploadResearchDocument } from "@/lib/r2";
import { runSafeAction, type SafeActionResult } from "@/lib/safe-action";
import { revalidateAdminSections } from "@/lib/revalidate-admin";

async function withUploadedFiles(
  input: NewResearch,
  files?: CreateResearchFiles,
): Promise<CreateAdminResearchInput> {
  let documentUrl: string | null = null;
  let documentName: string | null = null;
  let equipmentPhotoUrl: string | null = null;

  if (files?.document) {
    const uploaded = await uploadResearchDocument(files.document);
    documentUrl = uploaded.url;
    documentName = uploaded.name;
  }

  if (files?.equipmentPhoto && input.equipment.name.trim()) {
    const uploaded = await uploadEquipmentPhoto(files.equipmentPhoto);
    equipmentPhotoUrl = uploaded.url;
  }

  return {
    ...input,
    documentUrl,
    documentName,
    equipmentPhotoUrl,
  };
}

export async function createResearchAction(
  input: NewResearch,
  files?: CreateResearchFiles,
) {
  return runSafeAction("Create research", async () => {
    await requireStaffSession();
    const project = await createAdminResearch(await withUploadedFiles(input, files));
    revalidateAdminSections("research", "equipments");
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
