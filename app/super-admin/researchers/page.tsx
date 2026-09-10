import { ResearchersTable } from "@/components/admin/researchers-table";
import { ServiceErrorHost } from "@/components/service-error-host";
import { getFacultyCatalog } from "@/lib/faculties";
import type { FacultyCatalog } from "@/lib/faculties-shared";
import { getAdminResearchers } from "@/lib/researchers";
import { runSafe } from "@/lib/safe-server";

const emptyCatalog: FacultyCatalog = {
  faculties: [],
  departmentsByFaculty: {},
};

export default async function SuperAdminResearchersPage() {
  const [{ data: researchers, errors: researcherErrors }, { data: catalog, errors: catalogErrors }] =
    await Promise.all([
      runSafe("Researchers", getAdminResearchers, []),
      runSafe("Faculties", getFacultyCatalog, emptyCatalog),
    ]);

  return (
    <>
      <ResearchersTable
        initialResearchers={researchers}
        catalog={catalog}
        showEdit
      />
      <ServiceErrorHost errors={[...researcherErrors, ...catalogErrors]} />
    </>
  );
}
