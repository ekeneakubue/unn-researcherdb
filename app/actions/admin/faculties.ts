"use server";

import { Prisma } from "@/lib/generated/prisma/client";
import { requireSuperAdminSession } from "@/lib/auth/require-staff";
import {
  createDepartment,
  createFaculty,
  deleteDepartment,
  updateDepartment,
  type CreateDepartmentInput,
  type CreateFacultyInput,
  type UpdateDepartmentInput,
} from "@/lib/faculties";
import { revalidateAdminSections } from "@/lib/revalidate-admin";
import { revalidatePath } from "next/cache";

export type CreateFacultyActionResult =
  | { ok: true; faculty: Awaited<ReturnType<typeof createFaculty>> }
  | { ok: false; error: string };

export type CreateDepartmentActionResult =
  | { ok: true; department: Awaited<ReturnType<typeof createDepartment>> }
  | { ok: false; error: string };

export type UpdateDepartmentActionResult =
  | { ok: true; department: Awaited<ReturnType<typeof updateDepartment>> }
  | { ok: false; error: string };

export type DeleteDepartmentActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createFacultyAction(
  input: CreateFacultyInput,
): Promise<CreateFacultyActionResult> {
  await requireSuperAdminSession();

  try {
    const faculty = await createFaculty(input);
    revalidateAdminSections("faculties", "departments");
    revalidatePath("/");
    return { ok: true, faculty };
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Faculty/Center/Institute name is required." ||
        error.message === "Select a valid type.")
    ) {
      return { ok: false, error: error.message };
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, error: "A faculty with this name already exists." };
    }
    throw error;
  }
}

export async function createDepartmentAction(
  input: CreateDepartmentInput,
): Promise<CreateDepartmentActionResult> {
  await requireSuperAdminSession();

  try {
    const department = await createDepartment(input);
    revalidateAdminSections("faculties", "departments");
    revalidatePath("/");
    return { ok: true, department };
  } catch (error) {
    return toDepartmentActionError(error);
  }
}

export async function updateDepartmentAction(
  id: string,
  input: UpdateDepartmentInput,
): Promise<UpdateDepartmentActionResult> {
  await requireSuperAdminSession();

  try {
    const department = await updateDepartment(id, input);
    revalidateAdminSections("faculties", "departments");
    revalidatePath("/");
    return { ok: true, department };
  } catch (error) {
    return toDepartmentActionError(error);
  }
}

export async function deleteDepartmentAction(
  id: string,
): Promise<DeleteDepartmentActionResult> {
  await requireSuperAdminSession();

  try {
    await deleteDepartment(id);
    revalidateAdminSections("faculties", "departments");
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    return toDepartmentActionError(error);
  }
}

function toDepartmentActionError(error: unknown): { ok: false; error: string } {
  if (
    error instanceof Error &&
    (error.message === "Department name is required." ||
      error.message === "Select a faculty." ||
      error.message === "Selected faculty could not be found." ||
      error.message === "Department not found.")
  ) {
    return { ok: false, error: error.message };
  }
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return {
      ok: false,
      error: "A department with this name already exists in that faculty.",
    };
  }
  throw error;
}
