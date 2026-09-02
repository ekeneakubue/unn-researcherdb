import "server-only";

import type { EquipmentAvailability, EquipmentCondition, ResearchStatus } from "@/lib/generated/prisma/client";
import type { ResearcherSession } from "@/lib/auth/researcher-session";
import type {
  ResearcherEquipmentRow,
  ResearcherOverviewData,
  ResearcherProfile,
  ResearcherProjectRow,
} from "@/lib/researcher-dashboard-shared";
import { prisma } from "@/lib/prisma";

const researchStatusLabels: Record<ResearchStatus, string> = {
  ACTIVE: "Active",
  RECRUITING: "Recruiting",
  UNDER_REVIEW: "Under review",
  COMPLETED: "Completed",
};

const availabilityLabels: Record<EquipmentAvailability, string> = {
  AVAILABLE: "Available",
  IN_USE: "In use",
  MAINTENANCE: "Maintenance",
};

const availabilityWindowFallback: Record<EquipmentAvailability, string> = {
  AVAILABLE: "Book through your lab coordinator",
  IN_USE: "Currently in use",
  MAINTENANCE: "Under maintenance",
};

const accountStatusLabels = {
  ACTIVE: "Active",
  PENDING: "Pending",
  SUSPENDED: "Suspended",
} as const;

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

const conditionLabels: Record<EquipmentCondition, string> = {
  AVAILABLE: "Available",
  IN_USE: "In-use",
  UNDER_REPAIR: "Under-repair",
  DAMAGED: "Damaged",
};

function toEquipmentRow(
  item: {
    reference: string | null;
    id: string;
    name: string;
    model: string | null;
    make: string | null;
    lab: string | null;
    location: string | null;
    availability: EquipmentAvailability;
    availabilityNote: string | null;
    condition: EquipmentCondition;
    custodian: { name: string } | null;
    custodianId: string | null;
  },
  researcherId: string,
): ResearcherEquipmentRow {
  return {
    id: item.reference ?? item.id,
    name: item.name,
    model: item.model ?? "",
    make: item.make ?? "",
    lab: item.lab ?? "Campus laboratory",
    location: item.location ?? "University of Nigeria, Nsukka",
    availability: availabilityLabels[item.availability],
    availabilityNote: item.availabilityNote ?? "",
    window: item.availabilityNote ?? availabilityWindowFallback[item.availability],
    condition: conditionLabels[item.condition],
    custodian: item.custodian?.name ?? "—",
    isCustodian: item.custodianId === researcherId,
  };
}

export async function getResearcherProjects(
  researcherName: string,
): Promise<ResearcherProjectRow[]> {
  const key = normalizeName(researcherName);
  const projects = await prisma.research.findMany({
    include: { coResearchers: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return projects
    .filter(
      (project) =>
        normalizeName(project.principalResearcherName) === key ||
        project.coResearchers.some((person) => normalizeName(person.name) === key),
    )
    .map((project) => ({
      id: project.reference ?? project.id,
      title: project.title,
      faculty: project.facultyCenterInstitute,
      department: project.department,
      role:
        normalizeName(project.principalResearcherName) === key ? "Principal" : "Co-researcher",
      status: researchStatusLabels[project.status],
      year: String(project.startDate.getUTCFullYear()),
      funding: project.funding,
    }));
}

async function getResearcherProjectIds(researcherName: string): Promise<string[]> {
  const key = normalizeName(researcherName);
  const projects = await prisma.research.findMany({
    select: {
      id: true,
      principalResearcherName: true,
      coResearchers: { select: { name: true } },
    },
  });

  return projects
    .filter(
      (project) =>
        normalizeName(project.principalResearcherName) === key ||
        project.coResearchers.some((person) => normalizeName(person.name) === key),
    )
    .map((project) => project.id);
}

export async function getResearcherEquipment(
  researcherId: string,
  researcherName: string,
): Promise<ResearcherEquipmentRow[]> {
  const projectIds = await getResearcherProjectIds(researcherName);

  const items = await prisma.equipment.findMany({
    where: {
      OR: [
        { custodianId: researcherId },
        ...(projectIds.length > 0
          ? [{ researchLinks: { some: { researchId: { in: projectIds } } } }]
          : []),
      ],
    },
    include: { custodian: true },
    orderBy: { createdAt: "desc" },
  });

  return items.map((item) => toEquipmentRow(item, researcherId));
}

export async function getResearcherProfile(
  session: ResearcherSession,
): Promise<ResearcherProfile> {
  const researcher = await prisma.researcher.findUniqueOrThrow({
    where: { id: session.researcherId },
  });

  return {
    id: researcher.reference ?? researcher.id,
    name: researcher.name,
    email: researcher.email,
    faculty: researcher.faculty,
    status: accountStatusLabels[researcher.status],
    memberSince: researcher.createdAt.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

export async function getResearcherOverview(
  session: ResearcherSession,
): Promise<ResearcherOverviewData> {
  const [projects, equipment] = await Promise.all([
    getResearcherProjects(session.name),
    prisma.equipment.findMany({
      include: { custodian: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const principalCount = projects.filter((project) => project.role === "Principal").length;
  const availableCount = equipment.filter((item) => item.availability === "AVAILABLE").length;
  const custodianItems = equipment
    .filter((item) => item.custodianId === session.researcherId)
    .map((item) => toEquipmentRow(item, session.researcherId));

  return {
    stats: [
      {
        label: "My projects",
        value: String(projects.length),
        hint:
          principalCount > 0
            ? `${principalCount} as principal investigator`
            : "Matched by your registered name",
      },
      {
        label: "Active projects",
        value: String(projects.filter((project) => project.status === "Active").length),
        hint: "Across UNN faculties",
      },
      {
        label: "Instruments available",
        value: String(availableCount),
        hint: `${equipment.length} shared campus-wide`,
      },
      {
        label: "Custodian labs",
        value: String(custodianItems.length),
        hint: "Equipment you oversee",
      },
    ],
    recentProjects: projects.slice(0, 5),
    custodianEquipment: custodianItems.slice(0, 4),
    availableEquipmentCount: availableCount,
  };
}
