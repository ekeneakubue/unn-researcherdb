import "server-only";

import type { Researcher } from "@/lib/generated/prisma/client";
import { hashPassword } from "@/lib/password";
import type { AdminResearcherRow, ResearcherSignupInput } from "@/lib/researchers-shared";
import { prisma } from "@/lib/prisma";

export type { AdminResearcherRow, ResearcherSignupInput } from "@/lib/researchers-shared";

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

async function buildProjectCounts(names: string[]) {
  const counts = new Map<string, number>();
  for (const name of names) {
    counts.set(normalizeName(name), 0);
  }

  const projects = await prisma.research.findMany({
    select: {
      principalResearcherName: true,
      coResearchers: { select: { name: true } },
    },
  });

  for (const project of projects) {
    const principalKey = normalizeName(project.principalResearcherName);
    if (counts.has(principalKey)) {
      counts.set(principalKey, (counts.get(principalKey) ?? 0) + 1);
    }

    for (const coResearcher of project.coResearchers) {
      const coKey = normalizeName(coResearcher.name);
      if (counts.has(coKey)) {
        counts.set(coKey, (counts.get(coKey) ?? 0) + 1);
      }
    }
  }

  return counts;
}

export function toAdminResearcherRow(
  researcher: Researcher,
  projectCounts: Map<string, number>,
): AdminResearcherRow {
  return {
    id: researcher.reference ?? researcher.id,
    name: researcher.name,
    email: researcher.email,
    faculty: researcher.faculty,
    projects: projectCounts.get(normalizeName(researcher.name)) ?? 0,
  };
}

export async function getAdminResearchers(): Promise<AdminResearcherRow[]> {
  const researchers = await prisma.researcher.findMany({
    orderBy: { createdAt: "desc" },
  });

  const projectCounts = await buildProjectCounts(researchers.map((person) => person.name));

  return researchers.map((researcher) => toAdminResearcherRow(researcher, projectCounts));
}

async function nextResearcherReference() {
  const researchers = await prisma.researcher.findMany({
    where: { reference: { startsWith: "UNN-R-" } },
    select: { reference: true },
  });

  const max = researchers.reduce((highest, researcher) => {
    const value = Number(researcher.reference?.replace("UNN-R-", "") ?? 0);
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 0);

  return `UNN-R-${String(max + 1).padStart(4, "0")}`;
}

export async function createResearcherAccount(input: ResearcherSignupInput) {
  return prisma.researcher.create({
    data: {
      reference: await nextResearcherReference(),
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      passwordHash: hashPassword(input.password),
      faculty: input.faculty.trim(),
      status: "ACTIVE",
    },
    select: {
      id: true,
      reference: true,
      name: true,
      email: true,
      faculty: true,
    },
  });
}

export async function deleteAdminResearcher(identifier: string): Promise<boolean> {
  const researcher = await prisma.researcher.findFirst({
    where: {
      OR: [{ reference: identifier }, { id: identifier }],
    },
    select: { id: true },
  });

  if (!researcher) return false;

  await prisma.researcher.delete({ where: { id: researcher.id } });
  return true;
}
