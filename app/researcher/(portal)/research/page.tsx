import { ResearcherResearchPanel } from "@/components/researcher/researcher-research-panel";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { getResearcherProjects } from "@/lib/researcher-dashboard";

export default async function ResearcherResearchPage() {
  const session = await requireResearcherSession();
  const projects = await getResearcherProjects(session.name);

  return (
    <ResearcherResearchPanel
      projects={projects}
      researcherName={session.name}
      researcherEmail={session.email}
      researcherFaculty={session.faculty}
    />
  );
}
