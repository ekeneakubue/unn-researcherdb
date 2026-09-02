"use server";

import { revalidatePath } from "next/cache";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { createAdminResearch } from "@/lib/research";
import type { NewResearch } from "@/lib/research-shared";
import { runSafeAction } from "@/lib/safe-action";
import { revalidateAdminSections } from "@/lib/revalidate-admin";

export async function createResearcherResearchAction(input: NewResearch) {
  return runSafeAction("Create research", async () => {
    const session = await requireResearcherSession();

    const project = await createAdminResearch({
      ...input,
      principalResearcher: session.name,
      principalResearcherEmail: session.email,
      faculty: input.faculty.trim() || session.faculty,
    });

    revalidatePath("/researcher");
    revalidatePath("/researcher/research");
    revalidatePath("/researcher/equipment");
    revalidatePath("/");
    revalidateAdminSections("research");

    return project;
  });
}
