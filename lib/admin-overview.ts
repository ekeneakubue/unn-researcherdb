import "server-only";

import type { ResearchStatus, UserRole } from "@/lib/generated/prisma/client";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { prisma } from "@/lib/prisma";

const researchStatusLabels: Record<ResearchStatus, string> = {
  ACTIVE: "Active",
  RECRUITING: "Recruiting",
  UNDER_REVIEW: "Under review",
  COMPLETED: "Completed",
};

export type AdminOverviewData = {
  stats: {
    label: string;
    value: string;
    hint: string;
  }[];
  recentResearch: {
    id: string;
    title: string;
    lead: string;
    faculty: string;
    status: string;
  }[];
  recentActivity: {
    id: string;
    time: string;
    actor: string;
    action: string;
  }[];
  flaggedEquipment: {
    id: string;
    name: string;
    window: string;
    availability: string;
  }[];
  facultyCounts: { faculty: string; count: number }[];
  maxFacultyCount: number;
  pendingUsers: {
    id: string;
    name: string;
    unit: string;
    status: string;
  }[];
  recentResearchers: {
    id: string;
    name: string;
    faculty: string;
  }[];
};

const availabilityLabels = {
  AVAILABLE: "Available",
  IN_USE: "In use",
  MAINTENANCE: "Maintenance",
} as const;

const accountStatusLabels = {
  ACTIVE: "Active",
  PENDING: "Pending",
  SUSPENDED: "Suspended",
} as const;

const roleLabels = {
  SUPER_ADMIN: "super-admin",
  ADMIN: "admin",
  DIRECTOR: "director",
  OFFICER: "officer",
} as const;

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function getAdminOverviewData(viewerRole: UserRole): Promise<AdminOverviewData> {
  const monthStart = startOfMonth(new Date());
  const hideSuperAdmin = viewerRole !== "SUPER_ADMIN";

  const [
    researchProjects,
    equipmentItems,
    researcherCount,
    researchersThisMonth,
    pendingUsers,
    recentResearchers,
    recentStaffUsers,
  ] = await Promise.all([
    prisma.research.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.equipment.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.researcher.count(),
    prisma.researcher.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.user.findMany({
      where: {
        status: "PENDING",
        ...(hideSuperAdmin ? { role: { not: "SUPER_ADMIN" } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.researcher.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.user.findMany({
      where: hideSuperAdmin ? { role: { not: "SUPER_ADMIN" } } : undefined,
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const activeResearch = researchProjects.filter((project) => project.status === "ACTIVE").length;
  const underReview = researchProjects.filter((project) => project.status === "UNDER_REVIEW").length;
  const maintenanceCount = equipmentItems.filter(
    (item) => item.availability === "MAINTENANCE",
  ).length;
  const inUseCount = equipmentItems.filter((item) => item.availability === "IN_USE").length;

  const facultyMap = new Map<string, number>();
  for (const project of researchProjects) {
    const faculty = project.facultyCenterInstitute;
    facultyMap.set(faculty, (facultyMap.get(faculty) ?? 0) + 1);
  }

  const facultyCounts = [...facultyMap.entries()]
    .map(([faculty, count]) => ({ faculty, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxFacultyCount = facultyCounts[0]?.count ?? 1;

  const activityCandidates = [
    ...researchProjects.slice(0, 8).map((project) => ({
      id: `research-${project.id}`,
      at: project.createdAt,
      actor: project.principalResearcherName,
      action: `added research project “${project.title}”`,
    })),
    ...recentResearchers.map((researcher) => ({
      id: `researcher-${researcher.id}`,
      at: researcher.createdAt,
      actor: researcher.name,
      action: `registered as a researcher (${researcher.faculty})`,
    })),
    ...recentStaffUsers.map((user) => ({
      id: `user-${user.id}`,
      at: user.createdAt,
      actor: user.name,
      action: `joined as ${roleLabels[user.role]} staff`,
    })),
    ...equipmentItems
      .filter((item) => item.availability !== "AVAILABLE")
      .slice(0, 5)
      .map((item) => ({
        id: `equipment-${item.id}`,
        at: item.updatedAt,
        actor: item.lab ?? "Central lab",
        action: `flagged ${item.name} as ${availabilityLabels[item.availability].toLowerCase()}`,
      })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 5);

  return {
    stats: [
      {
        label: "Total research",
        value: String(researchProjects.length),
        hint: underReview > 0 ? `${underReview} under review` : "Catalogue entries",
      },
      {
        label: "Active research",
        value: String(activeResearch),
        hint:
          facultyMap.size > 0
            ? `Across ${facultyMap.size} ${facultyMap.size === 1 ? "faculty" : "faculties"}`
            : "No faculty breakdown yet",
      },
      {
        label: "Shared instruments",
        value: String(equipmentItems.length),
        hint:
          maintenanceCount + inUseCount > 0
            ? `${inUseCount} in use, ${maintenanceCount} in maintenance`
            : "All available",
      },
      {
        label: "Researchers",
        value: String(researcherCount),
        hint:
          researchersThisMonth > 0
            ? `${researchersThisMonth} joined this month`
            : "Registered portal accounts",
      },
    ],
    recentResearch: researchProjects.slice(0, 5).map((project) => ({
      id: project.reference ?? project.id,
      title: project.title,
      lead: project.principalResearcherName,
      faculty: project.facultyCenterInstitute,
      status: researchStatusLabels[project.status],
    })),
    recentActivity: activityCandidates.map((item) => ({
      id: item.id,
      time: formatRelativeTime(item.at),
      actor: item.actor,
      action: item.action,
    })),
    flaggedEquipment: equipmentItems
      .filter((item) => item.availability !== "AVAILABLE")
      .slice(0, 5)
      .map((item) => ({
        id: item.reference ?? item.id,
        name: item.name,
        window: item.availabilityNote ?? "Check with lab custodian",
        availability: availabilityLabels[item.availability],
      })),
    facultyCounts,
    maxFacultyCount,
    pendingUsers: pendingUsers.map((user) => ({
      id: user.reference ?? user.id,
      name: user.name,
      unit: user.unit ?? user.role.replace("_", " "),
      status: accountStatusLabels[user.status],
    })),
    recentResearchers: recentResearchers.map((researcher) => ({
      id: researcher.reference ?? researcher.id,
      name: researcher.name,
      faculty: researcher.faculty,
    })),
  };
}
