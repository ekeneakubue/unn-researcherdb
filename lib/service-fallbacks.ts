import type { AdminOverviewData } from "@/lib/admin-overview";
import type { ResearcherOverviewData, ResearcherProfile } from "@/lib/researcher-dashboard-shared";
import type { ResearcherSession } from "@/lib/auth/researcher-session";

export const emptyAdminOverviewData: AdminOverviewData = {
  stats: [],
  recentResearch: [],
  recentActivity: [],
  flaggedEquipment: [],
  facultyCounts: [],
  maxFacultyCount: 0,
  pendingUsers: [],
  recentResearchers: [],
};

export const emptyResearcherOverviewData: ResearcherOverviewData = {
  stats: [],
  recentProjects: [],
  custodianEquipment: [],
  availableEquipmentCount: 0,
};

export function researcherProfileFallback(session: ResearcherSession): ResearcherProfile {
  return {
    id: session.reference ?? session.researcherId,
    name: session.name,
    email: session.email,
    faculty: session.faculty,
    status: "—",
    memberSince: "—",
  };
}
