import { FacultiesTable } from "@/components/admin/faculties-table";
import { ServiceErrorHost } from "@/components/service-error-host";
import { requireSuperAdminSession } from "@/lib/auth/require-staff";
import { getAdminFaculties } from "@/lib/faculties";
import { runSafe } from "@/lib/safe-server";

export default async function SuperAdminFacultiesPage() {
  await requireSuperAdminSession();
  const { data: faculties, errors } = await runSafe(
    "Faculties",
    () => getAdminFaculties(),
    [],
  );

  return (
    <>
      <FacultiesTable initialFaculties={faculties} />
      <ServiceErrorHost errors={errors} />
    </>
  );
}
