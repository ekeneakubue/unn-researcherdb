"use client";

import { createContext, useContext } from "react";
import {
  type AdminPortalConfig,
  type AdminPortalVariant,
  adminPortalConfigs,
  mergePortalConfig,
  type PortalStaffProfile,
} from "@/lib/admin-portal-config";

const AdminPortalContext = createContext<AdminPortalConfig>(adminPortalConfigs.admin);

export function AdminPortalProvider({
  variant,
  staffUser,
  children,
}: {
  variant: AdminPortalVariant;
  staffUser?: PortalStaffProfile | null;
  children: React.ReactNode;
}) {
  return (
    <AdminPortalContext.Provider value={mergePortalConfig(variant, staffUser)}>
      {children}
    </AdminPortalContext.Provider>
  );
}

export function useAdminPortal() {
  return useContext(AdminPortalContext);
}
