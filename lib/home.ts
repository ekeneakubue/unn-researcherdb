import "server-only";

import type {
  EquipmentAvailability,
  EquipmentCondition,
  ResearchOutputType,
  ResearchStatus,
} from "@/lib/generated/prisma/client";
import type {
  HomeEquipmentDetail,
  HomeEquipmentItem,
  HomeResearchDetail,
  HomeResearchProject,
} from "@/lib/home-shared";
import { prisma } from "@/lib/prisma";

const statusLabels: Record<ResearchStatus, string> = {
  ACTIVE: "Active",
  RECRUITING: "Recruiting",
  UNDER_REVIEW: "Under review",
  COMPLETED: "Completed",
};

const outputLabels: Record<ResearchOutputType, string> = {
  ARTICLES: "Articles",
  PAPERS: "Papers",
  JOURNAL: "Journal",
  PATENTS_INNOVATION: "Patents/Innovation",
};

const availabilityLabels: Record<EquipmentAvailability, string> = {
  AVAILABLE: "Available",
  IN_USE: "In use",
  MAINTENANCE: "Maintenance",
};

const equipmentConditionLabels: Record<EquipmentCondition, string> = {
  AVAILABLE: "Available",
  IN_USE: "In-use",
  UNDER_REPAIR: "Under-repair",
  DAMAGED: "Damaged",
};

const availabilityWindowFallback: Record<EquipmentAvailability, string> = {
  AVAILABLE: "Book through your lab coordinator",
  IN_USE: "Currently in use",
  MAINTENANCE: "Under maintenance",
};

const researchDetailInclude = {
  coResearchers: { orderBy: { sortOrder: "asc" as const } },
  collaborators: { orderBy: { sortOrder: "asc" as const } },
  equipmentLinks: {
    include: { equipment: true },
  },
};

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function truncateAbstract(text: string, max = 160): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export async function getHomeResearchProjects(): Promise<HomeResearchProject[]> {
  const projects = await prisma.research.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return projects.map((project) => ({
    id: project.reference ?? project.id,
    title: project.title,
    faculty: project.facultyCenterInstitute,
    lead: project.principalResearcherName,
    unit: project.department,
    year: String(project.startDate.getUTCFullYear()),
    summary: truncateAbstract(project.abstract),
    status: statusLabels[project.status],
  }));
}

export async function getHomeEquipmentItems(): Promise<HomeEquipmentItem[]> {
  const items = await prisma.equipment.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return items.map((item) => ({
    id: item.reference ?? item.id,
    name: item.name,
    lab: item.lab ?? "Campus laboratory",
    location: item.location ?? "University of Nigeria, Nsukka",
    availability: availabilityLabels[item.availability],
    window: item.availabilityNote ?? availabilityWindowFallback[item.availability],
  }));
}

export async function getHomeResearchDetail(
  identifier: string,
): Promise<HomeResearchDetail | null> {
  const research = await prisma.research.findFirst({
    where: {
      OR: [{ reference: identifier }, { id: identifier }],
    },
    include: researchDetailInclude,
  });

  if (!research) return null;

  return {
    id: research.reference ?? research.id,
    title: research.title,
    abstract: research.abstract,
    startDate: formatDisplayDate(research.startDate),
    endDate: formatDisplayDate(research.endDate),
    principalResearcher: research.principalResearcherName,
    principalResearcherEmail: research.principalResearcherEmail ?? "",
    coResearchers: research.coResearchers.map((person) => ({
      name: person.name,
      email: person.email ?? "",
    })),
    collaborators: research.collaborators.map((person) => ({
      name: person.name,
      email: person.email ?? "",
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

export async function getHomeEquipmentDetail(
  identifier: string,
): Promise<HomeEquipmentDetail | null> {
  const item = await prisma.equipment.findFirst({
    where: {
      OR: [{ reference: identifier }, { id: identifier }],
    },
    include: {
      custodian: { select: { name: true } },
      researchLinks: {
        include: {
          research: { select: { title: true } },
        },
      },
    },
  });

  if (!item) return null;

  return {
    id: item.reference ?? item.id,
    name: item.name,
    model: item.model ?? "",
    make: item.make ?? "",
    lab: item.lab ?? "Campus laboratory",
    location: item.location ?? "University of Nigeria, Nsukka",
    availability: availabilityLabels[item.availability],
    availabilityNote: item.availabilityNote ?? availabilityWindowFallback[item.availability],
    condition: equipmentConditionLabels[item.condition],
    custodian: item.custodian?.name ?? "—",
    linkedResearch: item.researchLinks.map((link) => link.research.title),
  };
}
