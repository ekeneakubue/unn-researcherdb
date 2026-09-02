import type { Metadata } from "next";
import { AdminLayout } from "@/components/admin/admin-layout";
import { requireSuperAdminSession } from "@/lib/auth/require-staff";
import { getNameInitials } from "@/lib/format-relative-time";

export const metadata: Metadata = {
  title: "Super Admin — UNN Research",
  description: "Manage research, equipment, and researchers across the University of Nigeria.",
};

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSuperAdminSession();

  return (
    <AdminLayout
      variant="super-admin"
      staffUser={{
        name: session.name,
        email: session.email,
        initials: getNameInitials(session.name),
      }}
    >
      {children}
    </AdminLayout>
  );
}
