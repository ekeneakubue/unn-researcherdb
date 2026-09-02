import { ResearcherEquipmentPanel } from "@/components/researcher/researcher-equipment-panel";
import { ServiceErrorHost } from "@/components/service-error-host";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { getResearcherEquipment } from "@/lib/researcher-dashboard";
import { runSafe } from "@/lib/safe-server";

export default async function ResearcherEquipmentPage() {
  const session = await requireResearcherSession();
  const { data: items, errors } = await runSafe(
    "Equipment",
    () => getResearcherEquipment(session.researcherId, session.name),
    [],
  );

  return (
    <>
      <ResearcherEquipmentPanel items={items} />
      <ServiceErrorHost errors={errors} />
    </>
  );
}
