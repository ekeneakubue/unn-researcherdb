import { ResearcherProfilePanel } from "@/components/researcher/researcher-profile-panel";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { getResearcherProfile } from "@/lib/researcher-dashboard";

export default async function ResearcherProfilePage() {
  const session = await requireResearcherSession();
  const profile = await getResearcherProfile(session);

  return <ResearcherProfilePanel profile={profile} />;
}
