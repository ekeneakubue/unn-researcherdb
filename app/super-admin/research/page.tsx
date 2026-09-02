import { ResearchTable } from "@/components/admin/research-table";
import { getAdminResearchProjects } from "@/lib/research";

export default async function SuperAdminResearchPage() {
  const projects = await getAdminResearchProjects();

  return <ResearchTable initialProjects={projects} />;
}
