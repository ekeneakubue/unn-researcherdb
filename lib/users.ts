import type { AccountStatus, User, UserRole } from "@/lib/generated/prisma/client";
import type { AdminUser, AdminUserStatus } from "@/lib/admin-data";
import { getAssignableRoleLabels } from "@/lib/auth/session";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import type { UpdateAdminUserInput } from "@/lib/users-shared";

export type { UpdateAdminUserInput } from "@/lib/users-shared";

const roleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: "Super-admin",
  ADMIN: "Admin",
  DIRECTOR: "Director",
  OFFICER: "Officer",
};

const roleValues: Record<(typeof roleLabels)[UserRole], UserRole> = {
  "Super-admin": "SUPER_ADMIN",
  Admin: "ADMIN",
  Director: "DIRECTOR",
  Officer: "OFFICER",
};

const statusLabels: Record<AccountStatus, AdminUserStatus> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  SUSPENDED: "Suspended",
};

const statusValues: Record<AdminUserStatus, AccountStatus> = {
  Active: "ACTIVE",
  Pending: "PENDING",
  Suspended: "SUSPENDED",
};

function formatLastActive(date: Date | null): string {
  if (!date) return "Never";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function toAdminUser(user: User): AdminUser {
  return {
    id: user.reference ?? user.id,
    name: user.name,
    email: user.email,
    unit: user.unit ?? "",
    role: roleLabels[user.role],
    lastActive: formatLastActive(user.lastActiveAt),
    status: statusLabels[user.status],
  };
}

async function nextUserReference() {
  const users = await prisma.user.findMany({
    where: { reference: { startsWith: "UNN-U-" } },
    select: { reference: true },
  });

  const max = users.reduce((highest, user) => {
    const value = Number(user.reference?.replace("UNN-U-", "") ?? 0);
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 0);

  return `UNN-U-${String(max + 1).padStart(4, "0")}`;
}

export async function getAdminUsers(viewerRole: UserRole): Promise<AdminUser[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    ...(viewerRole === "SUPER_ADMIN"
      ? {}
      : {
          where: { role: { not: "SUPER_ADMIN" } },
        }),
  });

  return users.map(toAdminUser);
}

export type CreateAdminUserInput = {
  name: string;
  email: string;
  password: string;
  role: string;
  status: AdminUserStatus;
};

export async function createAdminUser(
  input: CreateAdminUserInput,
  callerRole: UserRole,
): Promise<AdminUser> {
  const assignableRoles = getAssignableRoleLabels(callerRole);
  if (!assignableRoles.includes(input.role)) {
    throw new Error("Forbidden: you cannot assign this role.");
  }

  const resolvedRole = roleValues[input.role as keyof typeof roleValues];
  if (!resolvedRole) {
    throw new Error("Invalid role.");
  }

  if (resolvedRole === "SUPER_ADMIN" && callerRole !== "SUPER_ADMIN") {
    throw new Error("Forbidden: only super-admins can create super-admin accounts.");
  }

  const user = await prisma.user.create({
    data: {
      reference: await nextUserReference(),
      name: input.name,
      email: input.email,
      passwordHash: hashPassword(input.password),
      role: resolvedRole,
      status: statusValues[input.status],
    },
  });

  return toAdminUser(user);
}

export async function updateAdminUser(
  identifier: string,
  input: UpdateAdminUserInput,
  callerRole: UserRole,
): Promise<AdminUser> {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ reference: identifier }, { id: identifier }],
    },
  });

  if (!existing) {
    throw new Error("User not found.");
  }

  if (existing.role === "SUPER_ADMIN" && callerRole !== "SUPER_ADMIN") {
    throw new Error("Forbidden: you cannot edit super-admin accounts.");
  }

  const assignableRoles = getAssignableRoleLabels(callerRole);
  const roleOptions =
    existing.role === "SUPER_ADMIN" && !assignableRoles.includes("Super-admin")
      ? [...assignableRoles, "Super-admin"]
      : assignableRoles;

  if (!roleOptions.includes(input.role)) {
    throw new Error("Forbidden: you cannot assign this role.");
  }

  const resolvedRole = roleValues[input.role as keyof typeof roleValues];
  if (!resolvedRole) {
    throw new Error("Invalid role.");
  }

  if (resolvedRole === "SUPER_ADMIN" && callerRole !== "SUPER_ADMIN") {
    throw new Error("Forbidden: only super-admins can assign the super-admin role.");
  }

  const password = input.password?.trim();
  if (password && password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const user = await prisma.user.update({
    where: { id: existing.id },
    data: {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      unit: input.unit.trim() || null,
      role: resolvedRole,
      status: statusValues[input.status],
      ...(password ? { passwordHash: hashPassword(password) } : {}),
    },
  });

  return toAdminUser(user);
}
