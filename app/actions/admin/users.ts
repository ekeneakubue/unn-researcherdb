"use server";

import { Prisma } from "@/lib/generated/prisma/client";
import { requireStaffSession } from "@/lib/auth/require-staff";
import { type CreateAdminUserInput, createAdminUser } from "@/lib/users";
import { revalidateAdminSections } from "@/lib/revalidate-admin";

export type CreateUserActionResult =
  | { ok: true; user: Awaited<ReturnType<typeof createAdminUser>> }
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
    if (error instanceof Error && error.message.startsWith("Forbidden")) {
      return { ok: false, error: error.message.replace(/^Forbidden:?\s*/i, "") };
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, error: "A user with this email already exists." };
    }
    throw error;
  }
}
