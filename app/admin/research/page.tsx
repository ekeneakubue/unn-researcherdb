import { ResearchTable } from "@/components/admin/research-table";
import { ServiceErrorHost } from "@/components/service-error-host";
import { getAdminResearchProjects } from "@/lib/research";
import { runSafe } from "@/lib/safe-server";

export default async function AdminResearchPage() {
  const { data: projects, errors } = await runSafe(
    "Research projects",
    getAdminResearchProjects,
    [],
  );

  return (
    <>
      <ResearchTable initialProjects={projects} showCsvImport />
      <ServiceErrorHost errors={errors} />
    </>
  );
}
