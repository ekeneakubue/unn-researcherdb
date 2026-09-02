import { AdminOverview } from "@/components/admin/admin-overview";
import { requireSuperAdminSession } from "@/lib/auth/require-staff";
import { getAdminOverviewData } from "@/lib/admin-overview";
import { adminPortalConfigs } from "@/lib/admin-portal-config";

export default async function SuperAdminOverviewPage() {
  const session = await requireSuperAdminSession();
  const data = await getAdminOverviewData(session.role);

  return (
    <AdminOverview data={data} basePath={adminPortalConfigs["super-admin"].basePath} />
  );
}
