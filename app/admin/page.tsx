import { AdminOverview } from "@/components/admin/admin-overview";
import { requireStaffSession } from "@/lib/auth/require-staff";
import { getAdminOverviewData } from "@/lib/admin-overview";
import { adminPortalConfigs } from "@/lib/admin-portal-config";

export default async function AdminOverviewPage() {
  const session = await requireStaffSession();
  const data = await getAdminOverviewData(session.role);

  return <AdminOverview data={data} basePath={adminPortalConfigs.admin.basePath} />;
}
