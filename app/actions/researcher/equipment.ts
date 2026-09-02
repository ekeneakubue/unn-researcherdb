"use server";

import { revalidatePath } from "next/cache";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { updateResearcherEquipment } from "@/lib/equipment";
import type { UpdateResearcherEquipmentInput } from "@/lib/equipment-shared";
import { runSafeAction, type SafeActionResult } from "@/lib/safe-action";
import { revalidateAdminSections } from "@/lib/revalidate-admin";

export async function updateResearcherEquipmentAction(
  identifier: string,
  input: UpdateResearcherEquipmentInput,
): Promise<
  SafeActionResult<Awaited<ReturnType<typeof updateResearcherEquipment>>>
> {
  return runSafeAction("Save equipment", async () => {
    const session = await requireResearcherSession();

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

    return item;
  });
}
