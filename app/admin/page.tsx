import { AdminOverview } from "@/components/admin/admin-overview";
import { ServiceErrorHost } from "@/components/service-error-host";
import { requireStaffSession } from "@/lib/auth/require-staff";
import { getAdminOverviewData } from "@/lib/admin-overview";
import { adminPortalConfigs } from "@/lib/admin-portal-config";
import { runSafe } from "@/lib/safe-server";
import { emptyAdminOverviewData } from "@/lib/service-fallbacks";

export default async function AdminOverviewPage() {
  const session = await requireStaffSession();
  const { data, errors } = await runSafe(
    "Overview",
    () => getAdminOverviewData(session.role),
    emptyAdminOverviewData,
  );

  return (
    <>
      <AdminOverview data={data} basePath={adminPortalConfigs.admin.basePath} />
      <ServiceErrorHost errors={errors} />
    </>
  );
}
