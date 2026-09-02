import { ResearcherOverview } from "@/components/researcher/researcher-overview";
import { ServiceErrorHost } from "@/components/service-error-host";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { getResearcherOverview } from "@/lib/researcher-dashboard";
import { runSafe } from "@/lib/safe-server";
import { emptyResearcherOverviewData } from "@/lib/service-fallbacks";

export default async function ResearcherDashboardPage() {
  const session = await requireResearcherSession();
  const { data, errors } = await runSafe(
    "Dashboard",
    () => getResearcherOverview(session),
    emptyResearcherOverviewData,
  );

  return (
    <>
      <ResearcherOverview data={data} />
      <ServiceErrorHost errors={errors} />
    </>
  );
}
