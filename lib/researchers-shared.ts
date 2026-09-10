import type { AdminUserStatus } from "@/lib/admin-data";

export type ResearcherSignupInput = {
  name: string;
  email: string;
  faculty: string;
  department: string;
  password: string;
};

export type AdminResearcherRow = {
  id: string;
  name: string;
  email: string;
  faculty: string;
  department: string;
  projects: number;
  status: AdminUserStatus;
};

export type UpdateAdminResearcherInput = {
  name: string;
  email: string;
  faculty: string;
  department: string;
  status: AdminUserStatus;
  password?: string;
};
