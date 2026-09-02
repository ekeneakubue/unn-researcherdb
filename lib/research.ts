import "server-only";

import type {
  EquipmentCondition,
  Research,
  ResearchOutputType,
  ResearchStatus,
} from "@/lib/generated/prisma/client";
import type {
  AdminResearchDetail,
  AdminResearchRow,
  CreateAdminResearchInput,
  NewResearch,
  ResearchStatusLabel,
} from "@/lib/research-shared";
import { prisma } from "@/lib/prisma";

export type {
  AdminResearchDetail,
  AdminResearchRow,
  CreateAdminResearchInput,
  NewResearch,
  ResearchStatusLabel,
} from "@/lib/research-shared";

const statusLabels: Record<ResearchStatus, string> = {
  ACTIVE: "Active",
  RECRUITING: "Recruiting",
  UNDER_REVIEW: "Under review",
  COMPLETED: "Completed",
};

const statusValues: Record<ResearchStatusLabel, ResearchStatus> = {
  Active: "ACTIVE",
  Recruiting: "RECRUITING",
  "Under review": "UNDER_REVIEW",
  Completed: "COMPLETED",
};

const researchDetailInclude = {
  coResearchers: { orderBy: { sortOrder: "asc" as const } },
  collaborators: { orderBy: { sortOrder: "asc" as const } },
  equipmentLinks: {
    include: { equipment: true },
  },
};

const outputValues: Record<NewResearch["researchOutput"], ResearchOutputType> = {
  Articles: "ARTICLES",
  Papers: "PAPERS",
  Journal: "JOURNAL",
  "Patents/Innovation": "PATENTS_INNOVATION",
};

const outputLabels: Record<ResearchOutputType, string> = {
  ARTICLES: "Articles",
  PAPERS: "Papers",
  JOURNAL: "Journal",
  PATENTS_INNOVATION: "Patents/Innovation",
};

const equipmentConditionLabels: Record<EquipmentCondition, string> = {
  AVAILABLE: "Available",
  IN_USE: "In-use",
  UNDER_REPAIR: "Under-repair",
  DAMAGED: "Damaged",
};

const equipmentConditionValues: Record<
  NewResearch["equipment"]["condition"],
  EquipmentCondition
> = {
  Available: "AVAILABLE",
  "In-use": "IN_USE",
  "Under-repair": "UNDER_REPAIR",
  Damaged: "DAMAGED",
};

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

type ResearchWithDetails = Research & {
  coResearchers: Array<{ name: string; email: string | null }>;
  collaborators: Array<{ name: string; email: string | null }>;
  equipmentLinks: Array<{
    condition: EquipmentCondition;
    equipment: {
      name: string;
      model: string | null;
      make: string | null;
      location: string | null;
    };
  }>;
};

export function toAdminResearchDetail(research: ResearchWithDetails): AdminResearchDetail {
  return {
    id: research.reference ?? research.id,
    title: research.title,
    abstract: research.abstract,
    startDate: formatDisplayDate(research.startDate),
    endDate: formatDisplayDate(research.endDate),
    principalResearcher: research.principalResearcherName,
    principalResearcherEmail: research.principalResearcherEmail ?? "",
    coResearchers: research.coResearchers.map((entry) => ({
      name: entry.name,
      email: entry.email ?? "",
    })),
    collaborators: research.collaborators.map((entry) => ({
      name: entry.name,
      email: entry.email ?? "",
    })),
    researchArea: research.researchArea,
    faculty: research.facultyCenterInstitute,
    department: research.department,
    researchOutput: outputLabels[research.researchOutput],
    funding: research.funding,
    status: statusLabels[research.status],
    equipment: research.equipmentLinks.map((link) => ({
      name: link.equipment.name,
      model: link.equipment.model ?? "",
      make: link.equipment.make ?? "",
      location: link.equipment.location ?? "",
      condition: equipmentConditionLabels[link.condition],
    })),
  };
}

export function toAdminResearchRow(research: Research): AdminResearchRow {
  return {
    id: research.reference ?? research.id,
    title: research.title,
    faculty: research.facultyCenterInstitute,
    lead: research.principalResearcherName,
    unit: research.department,
    year: String(research.startDate.getUTCFullYear()),
    status: statusLabels[research.status],
    funding: research.funding,
  };
}

async function nextResearchReference() {
  const projects = await prisma.research.findMany({
    where: { reference: { startsWith: "RES-" } },
    select: { reference: true },
  });

  const max = projects.reduce((highest, project) => {
    const value = Number(project.reference?.replace("RES-", "") ?? 0);
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 0);

  return `RES-${String(max + 1).padStart(4, "0")}`;
}

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export async function getAdminResearchProjects(): Promise<AdminResearchRow[]> {
  const projects = await prisma.research.findMany({
    orderBy: { createdAt: "desc" },
  });

  return projects.map(toAdminResearchRow);
}

export async function getAdminResearchDetail(
  identifier: string,
): Promise<AdminResearchDetail | null> {
  const research = await prisma.research.findFirst({
    where: {
      OR: [{ reference: identifier }, { id: identifier }],
    },
    include: researchDetailInclude,
  });

  if (!research) return null;

  return toAdminResearchDetail(research);
}

export async function updateAdminResearchStatus(
  identifier: string,
  status: ResearchStatusLabel,
): Promise<AdminResearchDetail | null> {
  const existing = await prisma.research.findFirst({
    where: {
      OR: [{ reference: identifier }, { id: identifier }],
    },
    select: { id: true },
  });

  if (!existing) return null;

  const research = await prisma.research.update({
    where: { id: existing.id },
    data: { status: statusValues[status] },
    include: researchDetailInclude,
  });

  return toAdminResearchDetail(research);
}

export async function createAdminResearch(
  input: CreateAdminResearchInput,
): Promise<AdminResearchRow> {
  const reference = await nextResearchReference();

  const research = await prisma.$transaction(async (tx) => {
    const created = await tx.research.create({
      data: {
        reference,
        title: input.title,
        abstract: input.abstract,
        startDate: parseDate(input.startDate),
        endDate: parseDate(input.endDate),
        researchArea: input.researchArea,
        facultyCenterInstitute: input.faculty,
        department: input.department,
        researchOutput: outputValues[input.researchOutput],
        funding: input.funding,
        status: "UNDER_REVIEW",
        principalResearcherName: input.principalResearcher.trim(),
        principalResearcherEmail: input.principalResearcherEmail.trim() || null,
        collaborators: {
          create: input.collaborators.map((person, index) => ({
            name: person.name.trim(),
            email: person.email.trim() || null,
            sortOrder: index,
          })),
        },
        coResearchers: {
          create: input.coResearchers.map((person, index) => ({
            name: person.name.trim(),
            email: person.email.trim() || null,
            sortOrder: index,
          })),
        },
      },
    });

    if (input.equipment.name) {
      const equipment = await tx.equipment.create({
        data: {
          name: input.equipment.name,
          model: input.equipment.model || null,
          make: input.equipment.make || null,
          location: input.equipment.location || null,
        },
      });

      await tx.researchEquipment.create({
        data: {
          researchId: created.id,
          equipmentId: equipment.id,
          condition: equipmentConditionValues[input.equipment.condition],
        },
      });
    }

    return created;
  });

  return toAdminResearchRow(research);
}
