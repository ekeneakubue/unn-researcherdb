"use server";

import { requireStaffSession } from "@/lib/auth/require-staff";
import {
  type CreateAdminResearchInput,
  createAdminResearch,
  getAdminResearchDetail,
  type ResearchStatusLabel,
  updateAdminResearchStatus,
} from "@/lib/research";
import { revalidateAdminSections } from "@/lib/revalidate-admin";

export async function createResearchAction(input: CreateAdminResearchInput) {
  await requireStaffSession();
  const project = await createAdminResearch(input);
  revalidateAdminSections("research");
  return project;
}

export async function getResearchDetailAction(identifier: string) {
  await requireStaffSession();
  return getAdminResearchDetail(identifier);
}

export async function updateResearchStatusAction(
  identifier: string,
  status: ResearchStatusLabel,
) {
  await requireStaffSession();
  const project = await updateAdminResearchStatus(identifier, status);
  revalidateAdminSections("research");
  return project;
}
