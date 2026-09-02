import { ResearcherResearchPanel } from "@/components/researcher/researcher-research-panel";
import { ServiceErrorHost } from "@/components/service-error-host";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { getResearcherProjects } from "@/lib/researcher-dashboard";
import { runSafe } from "@/lib/safe-server";

export default async function ResearcherResearchPage() {
  const session = await requireResearcherSession();
  const { data: projects, errors } = await runSafe(
    "Research projects",
    () => getResearcherProjects(session.name),
    [],
  );

  return (
    <>
      <ResearcherResearchPanel
        projects={projects}
        researcherName={session.name}
        researcherEmail={session.email}
        researcherFaculty={session.faculty}
      />
      <ServiceErrorHost errors={errors} />
    </>
  );
}
