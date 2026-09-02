import { ResearcherProfilePanel } from "@/components/researcher/researcher-profile-panel";
import { ServiceErrorHost } from "@/components/service-error-host";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { getResearcherProfile } from "@/lib/researcher-dashboard";
import { runSafe } from "@/lib/safe-server";
import { researcherProfileFallback } from "@/lib/service-fallbacks";

export default async function ResearcherProfilePage() {
  const session = await requireResearcherSession();
  const { data: profile, errors } = await runSafe(
    "Profile",
    () => getResearcherProfile(session),
    researcherProfileFallback(session),
  );

  return (
    <>
      <ResearcherProfilePanel profile={profile} />
      <ServiceErrorHost errors={errors} />
    </>
  );
}
