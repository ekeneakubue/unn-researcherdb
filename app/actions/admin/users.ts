"use server";

import { Prisma } from "@/lib/generated/prisma/client";
import { requireStaffSession, requireSuperAdminSession } from "@/lib/auth/require-staff";
import {
  type CreateAdminUserInput,
  createAdminUser,
  updateAdminUser,
} from "@/lib/users";
import type { UpdateAdminUserInput } from "@/lib/users-shared";
import { revalidateAdminSections } from "@/lib/revalidate-admin";

export type CreateUserActionResult =
  | { ok: true; user: Awaited<ReturnType<typeof createAdminUser>> }
  | { ok: false; error: string };

export type UpdateUserActionResult =
  | { ok: true; user: Awaited<ReturnType<typeof updateAdminUser>> }
  | { ok: false; error: string };

export async function createUserAction(
  input: CreateAdminUserInput,
): Promise<CreateUserActionResult> {
  const session = await requireStaffSession();

  try {
    const user = await createAdminUser(input, session.role);
    revalidateAdminSections("users");
    return { ok: true, user };
  } catch (error) {
    return toUserActionError(error);
  }
}

export async function updateUserAction(
  identifier: string,
  input: UpdateAdminUserInput,
): Promise<UpdateUserActionResult> {
  const session = await requireSuperAdminSession();

  try {
    const user = await updateAdminUser(identifier, input, session.role);
    revalidateAdminSections("users");
    return { ok: true, user };
  } catch (error) {
    return toUserActionError(error);
  }
}

function toUserActionError(error: unknown): { ok: false; error: string } {
  if (error instanceof Error && error.message.startsWith("Forbidden")) {
    return { ok: false, error: error.message.replace(/^Forbidden:?\s*/i, "") };
  }
  if (error instanceof Error && error.message === "User not found.") {
    return { ok: false, error: "This user could not be found." };
  }
  if (error instanceof Error && error.message.startsWith("Password must")) {
    return { ok: false, error: error.message };
  }
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return { ok: false, error: "A user with this email already exists." };
  }
  throw error;
}
