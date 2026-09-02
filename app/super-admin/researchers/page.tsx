import { ResearchersTable } from "@/components/admin/researchers-table";
import { getAdminResearchers } from "@/lib/researchers";

export default async function SuperAdminResearchersPage() {
  const researchers = await getAdminResearchers();

  return <ResearchersTable initialResearchers={researchers} />;
}
