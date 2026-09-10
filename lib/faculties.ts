import "server-only";

import type { FacultyCatalog, FacultyUnitType } from "@/lib/faculties-shared";
import { isFacultyUnitType } from "@/lib/faculties-shared";
import { FacultyUnitType as PrismaFacultyUnitType } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { UNN_FACULTIES } from "@/lib/unn-faculties";

export type { FacultyCatalog, FacultyUnitType } from "@/lib/faculties-shared";

export type AdminFaculty = {
  id: string;
  name: string;
  type: FacultyUnitType;
  departmentCount: number;
};

export type AdminDepartment = {
  id: string;
  name: string;
  facultyId: string;
  facultyName: string;
};

let seedPromise: Promise<void> | null = null;

async function ensureFacultyCatalogSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const expected = Object.keys(UNN_FACULTIES).length;
      const count = await prisma.faculty.count();
      if (count >= expected) return;

      // Seed one faculty at a time — a single Neon transaction for the full
      // catalog exceeds Prisma's default 5s interactive transaction timeout.
      for (const [name, departments] of Object.entries(UNN_FACULTIES)) {
        const faculty = await prisma.faculty.upsert({
          where: { name },
          create: {
            name,
            type: "FACULTY",
            departments: {
              create: departments.map((department) => ({ name: department })),
            },
          },
          update: {},
          include: { departments: { select: { name: true } } },
        });

        const existing = new Set(faculty.departments.map((d) => d.name));
        const missing = departments.filter((department) => !existing.has(department));
        if (missing.length === 0) continue;

        await prisma.department.createMany({
          data: missing.map((department) => ({
            name: department,
            facultyId: faculty.id,
          })),
          skipDuplicates: true,
        });
      }
    })().finally(() => {
      seedPromise = null;
    });
  }

  await seedPromise;
}

export async function getAdminFaculties(): Promise<AdminFaculty[]> {
  await ensureFacultyCatalogSeeded();

  const faculties = await prisma.faculty.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { departments: true } } },
  });

  return faculties.map((faculty) => ({
    id: faculty.id,
    name: faculty.name,
    type: faculty.type,
    departmentCount: faculty._count.departments,
  }));
}

export async function getAdminDepartments(): Promise<AdminDepartment[]> {
  await ensureFacultyCatalogSeeded();

  const departments = await prisma.department.findMany({
    orderBy: [{ faculty: { name: "asc" } }, { name: "asc" }],
    include: { faculty: { select: { id: true, name: true } } },
  });

  return departments.map((department) => ({
    id: department.id,
    name: department.name,
    facultyId: department.faculty.id,
    facultyName: department.faculty.name,
  }));
}

export async function getFacultyCatalog(): Promise<FacultyCatalog> {
  await ensureFacultyCatalogSeeded();

  const faculties = await prisma.faculty.findMany({
    orderBy: { name: "asc" },
    include: {
      departments: { orderBy: { name: "asc" }, select: { name: true } },
    },
  });

  const departmentsByFaculty: Record<string, string[]> = {};
  for (const faculty of faculties) {
    departmentsByFaculty[faculty.name] = faculty.departments.map((d) => d.name);
  }

  return {
    faculties: faculties.map((faculty) => faculty.name),
    departmentsByFaculty,
  };
}

export type CreateFacultyInput = {
  name: string;
  type: FacultyUnitType;
};

export async function createFaculty(input: CreateFacultyInput): Promise<AdminFaculty> {
  const name = input.name.trim();
  if (!name) {
    throw new Error("Faculty/Center/Institute name is required.");
  }
  if (!isFacultyUnitType(input.type)) {
    throw new Error("Select a valid type.");
  }

  await ensureFacultyCatalogSeeded();

  const faculty = await prisma.faculty.create({
    data: {
      name,
      type: PrismaFacultyUnitType[input.type],
    },
    include: { _count: { select: { departments: true } } },
  });

  return {
    id: faculty.id,
    name: faculty.name,
    type: faculty.type,
    departmentCount: faculty._count.departments,
  };
}

export type CreateDepartmentInput = {
  name: string;
  facultyId: string;
};

export async function createDepartment(
  input: CreateDepartmentInput,
): Promise<AdminDepartment> {
  const name = input.name.trim();
  const facultyId = input.facultyId.trim();
  if (!name) {
    throw new Error("Department name is required.");
  }
  if (!facultyId) {
    throw new Error("Select a faculty.");
  }

  await ensureFacultyCatalogSeeded();

  const faculty = await prisma.faculty.findUnique({
    where: { id: facultyId },
    select: { id: true, name: true },
  });
  if (!faculty) {
    throw new Error("Selected faculty could not be found.");
  }

  const department = await prisma.department.create({
    data: { name, facultyId: faculty.id },
  });

  return {
    id: department.id,
    name: department.name,
    facultyId: faculty.id,
    facultyName: faculty.name,
  };
}

export type UpdateDepartmentInput = {
  name: string;
  facultyId: string;
};

export async function updateDepartment(
  id: string,
  input: UpdateDepartmentInput,
): Promise<AdminDepartment> {
  const name = input.name.trim();
  const facultyId = input.facultyId.trim();
  if (!name) {
    throw new Error("Department name is required.");
  }
  if (!facultyId) {
    throw new Error("Select a faculty.");
  }

  const existing = await prisma.department.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    throw new Error("Department not found.");
  }

  const faculty = await prisma.faculty.findUnique({
    where: { id: facultyId },
    select: { id: true, name: true },
  });
  if (!faculty) {
    throw new Error("Selected faculty could not be found.");
  }

  const department = await prisma.department.update({
    where: { id },
    data: { name, facultyId: faculty.id },
  });

  return {
    id: department.id,
    name: department.name,
    facultyId: faculty.id,
    facultyName: faculty.name,
  };
}

export async function deleteDepartment(id: string): Promise<void> {
  const existing = await prisma.department.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    throw new Error("Department not found.");
  }

  await prisma.department.delete({ where: { id } });
}
