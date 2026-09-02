import { ResearchersTable } from "@/components/admin/researchers-table";
import { ServiceErrorHost } from "@/components/service-error-host";
import { getAdminResearchers } from "@/lib/researchers";
import { runSafe } from "@/lib/safe-server";

export default async function AdminResearchersPage() {
  const { data: researchers, errors } = await runSafe("Researchers", getAdminResearchers, []);

  return (
    <>
      <ResearchersTable initialResearchers={researchers} />
      <ServiceErrorHost errors={errors} />
    </>
  );
}
