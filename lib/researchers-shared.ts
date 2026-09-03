import type { AdminUserStatus } from "@/lib/admin-data";

export type ResearcherSignupInput = {
  name: string;
  email: string;
  faculty: string;
  password: string;
};

export type AdminResearcherRow = {
  id: string;
  name: string;
  email: string;
  faculty: string;
  projects: number;
  status: AdminUserStatus;
};

export type UpdateAdminResearcherInput = {
  name: string;
  email: string;
  faculty: string;
  status: AdminUserStatus;
  password?: string;
};
