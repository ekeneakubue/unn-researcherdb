import { ResearcherOverview } from "@/components/researcher/researcher-overview";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { getResearcherOverview } from "@/lib/researcher-dashboard";

export default async function ResearcherDashboardPage() {
  const session = await requireResearcherSession();
  const data = await getResearcherOverview(session);

  return <ResearcherOverview data={data} />;
}
