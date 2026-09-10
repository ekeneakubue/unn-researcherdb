import { DepartmentsTable } from "@/components/admin/departments-table";
import { ServiceErrorHost } from "@/components/service-error-host";
import { requireSuperAdminSession } from "@/lib/auth/require-staff";
import { getAdminDepartments, getAdminFaculties } from "@/lib/faculties";
import { runSafe } from "@/lib/safe-server";

export default async function SuperAdminDepartmentsPage() {
  await requireSuperAdminSession();
  const [{ data: departments, errors: departmentErrors }, { data: faculties, errors: facultyErrors }] =
    await Promise.all([
      runSafe("Departments", () => getAdminDepartments(), []),
      runSafe("Faculties", () => getAdminFaculties(), []),
    ]);

  return (
    <>
      <DepartmentsTable initialDepartments={departments} faculties={faculties} />
      <ServiceErrorHost errors={[...departmentErrors, ...facultyErrors]} />
    </>
  );
}
