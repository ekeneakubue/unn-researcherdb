"use server";

import { revalidatePath } from "next/cache";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { createAdminResearch } from "@/lib/research";
import type { CreateResearchFiles, NewResearch } from "@/lib/research-shared";
import { uploadEquipmentPhoto, uploadResearchDocument } from "@/lib/r2";
import { runSafeAction } from "@/lib/safe-action";
import { revalidateAdminSections } from "@/lib/revalidate-admin";

export async function createResearcherResearchAction(
  input: NewResearch,
  files?: CreateResearchFiles,
) {
  return runSafeAction("Create research", async () => {
    const session = await requireResearcherSession();

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

    const project = await createAdminResearch({
      ...input,
      principalResearcher: session.name,
      principalResearcherEmail: session.email,
      faculty: input.faculty.trim() || session.faculty,
      documentUrl,
      documentName,
      equipmentPhotoUrl,
    });

    revalidatePath("/researcher");
    revalidatePath("/researcher/research");
    revalidatePath("/researcher/equipment");
    revalidatePath("/");
    revalidateAdminSections("research", "equipments");

    return project;
  });
}
