import { ResearchTable } from "@/components/admin/research-table";
import { getAdminResearchProjects } from "@/lib/research";

export default async function AdminResearchPage() {
  const projects = await getAdminResearchProjects();

  return <ResearchTable initialProjects={projects} />;
}
