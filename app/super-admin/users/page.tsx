import { UsersTable } from "@/components/admin/users-table";
import { getAssignableRoleLabels } from "@/lib/auth/session";
import { requireSuperAdminSession } from "@/lib/auth/require-staff";
import { getAdminUsers } from "@/lib/users";

export default async function SuperAdminUsersPage() {
  const session = await requireSuperAdminSession();
  const users = await getAdminUsers(session.role);

  return (
    <UsersTable
      initialUsers={users}
      assignableRoles={[...getAssignableRoleLabels(session.role)]}
    />
  );
}
