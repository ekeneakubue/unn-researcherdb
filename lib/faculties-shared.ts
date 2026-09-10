export type FacultyUnitType =
  | "FACULTY"
  | "CENTER"
  | "INSTITUTE"
  | "SCHOOL"
  | "COLLEGE"
  | "ADMINISTRATION";

export const FACULTY_UNIT_TYPES: FacultyUnitType[] = [
  "FACULTY",
  "CENTER",
  "INSTITUTE",
  "SCHOOL",
  "COLLEGE",
  "ADMINISTRATION",
];

export const FACULTY_UNIT_TYPE_LABELS: Record<FacultyUnitType, string> = {
  FACULTY: "Faculty",
  CENTER: "Center",
  INSTITUTE: "Institute",
  SCHOOL: "School",
  COLLEGE: "College",
  ADMINISTRATION: "Administration",
};

export type FacultyCatalog = {
  faculties: string[];
  departmentsByFaculty: Record<string, string[]>;
};

export function departmentsForFaculty(
  catalog: FacultyCatalog,
  faculty: string,
): string[] {
  return catalog.departmentsByFaculty[faculty] ?? [];
}

export function isFacultyUnitType(value: string): value is FacultyUnitType {
  return (FACULTY_UNIT_TYPES as string[]).includes(value);
}
