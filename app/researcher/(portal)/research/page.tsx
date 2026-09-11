import { ResearcherResearchPanel } from "@/components/researcher/researcher-research-panel";
import { ServiceErrorHost } from "@/components/service-error-host";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { getFacultyCatalog } from "@/lib/faculties";
import type { FacultyCatalog } from "@/lib/faculties-shared";
import { getResearcherProjects } from "@/lib/researcher-dashboard";
import { runSafe } from "@/lib/safe-server";

const emptyCatalog: FacultyCatalog = {
  faculties: [],
  departmentsByFaculty: {},
};

export default async function ResearcherResearchPage() {
  const session = await requireResearcherSession();
  const [
    { data: projects, errors: projectErrors },
    { data: catalog, errors: catalogErrors },
  ] = await Promise.all([
    runSafe("Research projects", () => getResearcherProjects(session.name), []),
    runSafe("Faculties", getFacultyCatalog, emptyCatalog),
  ]);

  return (
    <>
      <ResearcherResearchPanel
        projects={projects}
        researcherName={session.name}
        researcherEmail={session.email}
        researcherFaculty={session.faculty}
        catalog={catalog}
      />
      <ServiceErrorHost errors={[...projectErrors, ...catalogErrors]} />
    </>
  );
}
