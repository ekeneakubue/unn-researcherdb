import { UsersTable } from "@/components/admin/users-table";
import { ServiceErrorHost } from "@/components/service-error-host";
import { getAssignableRoleLabels } from "@/lib/auth/session";
import { requireSuperAdminSession } from "@/lib/auth/require-staff";
import { getAdminUsers } from "@/lib/users";
import { runSafe } from "@/lib/safe-server";

export default async function SuperAdminUsersPage() {
  const session = await requireSuperAdminSession();
  const { data: users, errors } = await runSafe(
    "Users",
    () => getAdminUsers(session.role),
    [],
  );

  return (
    <>
      <UsersTable
        initialUsers={users}
        assignableRoles={[...getAssignableRoleLabels(session.role)]}
        showEdit
      />
      <ServiceErrorHost errors={errors} />
    </>
  );
}
