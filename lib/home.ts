import "server-only";

import type { EquipmentAvailability, ResearchStatus } from "@/lib/generated/prisma/client";
import type { HomeEquipmentItem, HomeResearchProject } from "@/lib/home-shared";
import { prisma } from "@/lib/prisma";

const statusLabels: Record<ResearchStatus, string> = {
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
