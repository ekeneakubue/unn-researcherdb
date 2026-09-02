import { EquipmentTable } from "@/components/admin/equipment-table";
import { getAdminEquipment } from "@/lib/equipment";

export default async function AdminEquipmentsPage() {
  const items = await getAdminEquipment();

  return <EquipmentTable initialItems={items} />;
}
