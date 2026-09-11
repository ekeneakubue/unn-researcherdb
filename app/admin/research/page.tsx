import { ResearchTable } from "@/components/admin/research-table";
import { ServiceErrorHost } from "@/components/service-error-host";
import { getFacultyCatalog } from "@/lib/faculties";
import type { FacultyCatalog } from "@/lib/faculties-shared";
import { getAdminResearchProjects } from "@/lib/research";
import { runSafe } from "@/lib/safe-server";

const emptyCatalog: FacultyCatalog = {
  faculties: [],
  departmentsByFaculty: {},
};

export default async function AdminResearchPage() {
  const [
    { data: projects, errors: projectErrors },
    { data: catalog, errors: catalogErrors },
  ] = await Promise.all([
    runSafe("Research projects", getAdminResearchProjects, []),
    runSafe("Faculties", getFacultyCatalog, emptyCatalog),
  ]);

  return (
    <>
      <ResearchTable initialProjects={projects} catalog={catalog} showCsvImport />
      <ServiceErrorHost errors={[...projectErrors, ...catalogErrors]} />
    </>
  );
}
