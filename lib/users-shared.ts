import type { AdminUserStatus } from "@/lib/admin-data";

export type UpdateAdminUserInput = {
  name: string;
  email: string;
  unit: string;
  role: string;
  status: AdminUserStatus;
  password?: string;
};
