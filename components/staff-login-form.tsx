"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { loginStaffAction } from "@/app/actions/staff-auth";
import { useServiceErrors } from "@/components/use-service-errors";

export function StaffLoginForm() {
  const router = useRouter();
  const { reportError, errorModal } = useServiceErrors();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      try {
        const result = await loginStaffAction({ email, password });
        if (!result.ok) {
          reportError(new Error(result.error), "Sign in");
          return;
        }
        router.replace(result.redirectTo);
        router.refresh();
      } catch (error) {
        reportError(error, "Sign in");
      }
    });
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-unn-green/10 sm:p-8">
      <p className="text-[11px] uppercase tracking-[0.18em] text-unn-gold">Staff portal</p>
      <h1 className="mt-2 font-serif text-3xl text-unn-green">Sign in</h1>
      <p className="mt-2 text-sm text-unn-muted">
        ORID officers and coordinators use this portal to manage research records.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          UNN email
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 px-3 text-sm outline-none focus:border-unn-gold"
            placeholder="you@unn.edu.ng"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            required
            type="password"
            name="password"
            autoComplete="current-password"
            className="mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 px-3 text-sm outline-none focus:border-unn-gold"
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="h-11 w-full rounded-full bg-unn-green text-sm font-semibold text-white hover:bg-unn-green-mid disabled:opacity-60"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
      {errorModal}
    </div>
  );
}
