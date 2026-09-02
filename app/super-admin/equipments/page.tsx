import { EquipmentTable } from "@/components/admin/equipment-table";
import { ServiceErrorHost } from "@/components/service-error-host";
import { getAdminEquipment } from "@/lib/equipment";
import { runSafe } from "@/lib/safe-server";

export default async function SuperAdminEquipmentsPage() {
  const { data: items, errors } = await runSafe("Equipment", getAdminEquipment, []);

  return (
    <>
      <EquipmentTable initialItems={items} />
      <ServiceErrorHost errors={errors} />
    </>
  );
}
