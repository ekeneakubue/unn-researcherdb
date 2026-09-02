import { ResearcherEquipmentPanel } from "@/components/researcher/researcher-equipment-panel";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { getResearcherEquipment } from "@/lib/researcher-dashboard";

export default async function ResearcherEquipmentPage() {
  const session = await requireResearcherSession();
  const items = await getResearcherEquipment(session.researcherId, session.name);

  return <ResearcherEquipmentPanel items={items} />;
}
