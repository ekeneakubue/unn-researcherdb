"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginStaffAction } from "@/app/actions/staff-auth";

export function StaffLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setError(null);
    startTransition(async () => {
      const result = await loginStaffAction({ email, password });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.replace(result.redirectTo);
      router.refresh();
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

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="h-11 w-full rounded-full bg-unn-green text-sm font-semibold text-white hover:bg-unn-green-mid disabled:opacity-60"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
