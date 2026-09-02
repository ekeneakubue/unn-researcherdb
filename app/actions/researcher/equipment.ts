"use server";

import { revalidatePath } from "next/cache";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { updateResearcherEquipment } from "@/lib/equipment";
import type { UpdateResearcherEquipmentInput } from "@/lib/equipment-shared";
import { revalidateAdminSections } from "@/lib/revalidate-admin";

export type UpdateResearcherEquipmentResult =
  | { ok: true; item: Awaited<ReturnType<typeof updateResearcherEquipment>> }
  | { ok: false; error: string };

export async function updateResearcherEquipmentAction(
  identifier: string,
  input: UpdateResearcherEquipmentInput,
): Promise<UpdateResearcherEquipmentResult> {
  const session = await requireResearcherSession();

  try {
    const item = await updateResearcherEquipment(
      identifier,
      session.researcherId,
      session.name,
      input,
    );

    revalidatePath("/researcher");
    revalidatePath("/researcher/equipment");
    revalidatePath("/");
    revalidateAdminSections("equipments");

    return { ok: true, item };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Forbidden")) {
      return { ok: false, error: "You cannot edit this equipment." };
    }
    throw error;
  }
}
