import { AdminOverview } from "@/components/admin/admin-overview";
import { ServiceErrorHost } from "@/components/service-error-host";
import { requireSuperAdminSession } from "@/lib/auth/require-staff";
import { getAdminOverviewData } from "@/lib/admin-overview";
import { adminPortalConfigs } from "@/lib/admin-portal-config";
import { runSafe } from "@/lib/safe-server";
import { emptyAdminOverviewData } from "@/lib/service-fallbacks";

export default async function SuperAdminOverviewPage() {
  const session = await requireSuperAdminSession();
  const { data, errors } = await runSafe(
    "Overview",
    () => getAdminOverviewData(session.role),
    emptyAdminOverviewData,
  );

  return (
    <>
      <AdminOverview data={data} basePath={adminPortalConfigs["super-admin"].basePath} />
      <ServiceErrorHost errors={errors} />
    </>
  );
}
