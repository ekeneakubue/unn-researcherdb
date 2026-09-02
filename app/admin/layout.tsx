import type { Metadata } from "next";
import { AdminLayout } from "@/components/admin/admin-layout";
import { requireStaffSession } from "@/lib/auth/require-staff";
import { getNameInitials } from "@/lib/format-relative-time";

export const metadata: Metadata = {
  title: "Admin — UNN Research",
  description: "Manage research, equipment, and researchers across the University of Nigeria.",
};

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireStaffSession();

  return (
    <AdminLayout
      variant="admin"
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
