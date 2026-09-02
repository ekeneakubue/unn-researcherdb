export type AdminPortalVariant = "super-admin" | "admin";

export type AdminPortalConfig = {
  basePath: string;
  portalLabel: string;
  userName: string;
  userEmail: string;
  userInitials: string;
};

export type PortalStaffProfile = {
  name: string;
  email: string;
  initials: string;
};

export function mergePortalConfig(
  variant: AdminPortalVariant,
  staffUser?: PortalStaffProfile | null,
): AdminPortalConfig {
  const base = adminPortalConfigs[variant];

  if (!staffUser) return base;

  return {
    ...base,
    userName: staffUser.name,
    userEmail: staffUser.email,
    userInitials: staffUser.initials,
  };
}

export const adminPortalConfigs: Record<AdminPortalVariant, AdminPortalConfig> = {
  "super-admin": {
    basePath: "/super-admin",
    portalLabel: "Super Admin",
    userName: "ORID Super Admin",
    userEmail: "admin@unn.edu.ng",
    userInitials: "SA",
  },
  admin: {
    basePath: "/admin",
    portalLabel: "Admin",
    userName: "ORID Admin",
    userEmail: "orid.admin@unn.edu.ng",
    userInitials: "AD",
  },
};

export type AdminNavItem = {
  href: string;
  label: string;
  segment: string;
};

const navSegments = [
  { segment: "", label: "Overview" },
  { segment: "users", label: "Users" },
  { segment: "research", label: "Research" },
  { segment: "equipments", label: "Equipment" },
  { segment: "researchers", label: "Researchers" },
  { segment: "settings", label: "Settings" },
] as const;

export function getAdminNav(config: AdminPortalConfig): AdminNavItem[] {
  return navSegments.map(({ segment, label }) => ({
    segment,
    label,
    href: segment ? `${config.basePath}/${segment}` : config.basePath,
  }));
}

export function getAdminPageTitle(pathname: string, config: AdminPortalConfig): string {
  const item = getAdminNav(config).find(
    (entry) =>
      entry.href === pathname ||
      (entry.segment !== "" && pathname.startsWith(`${config.basePath}/${entry.segment}`)),
  );

  return item?.label ?? config.portalLabel;
}

export function adminPath(basePath: string, segment: string): string {
  return segment ? `${basePath}/${segment}` : basePath;
}
