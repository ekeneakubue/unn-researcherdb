import { Suspense } from "react";
import {
  AdminMenuProvider,
  AdminSidebar,
  AdminTopbar,
} from "@/components/admin/admin-shell";
import { AdminPortalProvider } from "@/components/admin/admin-portal-context";
import type { AdminPortalVariant, PortalStaffProfile } from "@/lib/admin-portal-config";

export function AdminLayout({
  variant,
  staffUser,
  children,
}: {
  variant: AdminPortalVariant;
  staffUser?: PortalStaffProfile | null;
  children: React.ReactNode;
}) {
  return (
    <AdminPortalProvider variant={variant} staffUser={staffUser}>
      <AdminMenuProvider>
        <div className="flex min-h-full flex-1 bg-unn-cream">
          <Suspense fallback={<div className="hidden w-64 shrink-0 bg-unn-green lg:block" />}>
            <AdminSidebar />
          </Suspense>
          <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
            <Suspense
              fallback={
                <header className="h-[4.25rem] border-b border-unn-green/10 bg-unn-cream" />
              }
            >
              <AdminTopbar />
            </Suspense>
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          </div>
        </div>
      </AdminMenuProvider>
    </AdminPortalProvider>
  );
}
