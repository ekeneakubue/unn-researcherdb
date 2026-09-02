import Link from "next/link";
import { redirect } from "next/navigation";
import { StaffLoginForm } from "@/components/staff-login-form";
import { UnnCrest } from "@/components/unn-crest";
import { getOptionalStaffSession } from "@/lib/auth/require-staff";

export default async function StaffLoginPage() {
  const session = await getOptionalStaffSession();
  if (session) {
    redirect(session.role === "SUPER_ADMIN" ? "/super-admin" : "/admin");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-unn-cream">
      <header className="border-b border-unn-green/10 px-4 py-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-3 text-unn-green">
          <UnnCrest className="h-9 w-auto" />
          <span className="font-serif text-lg">UNN Research</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <StaffLoginForm />
      </main>
    </div>
  );
}
