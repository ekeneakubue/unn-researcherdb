"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginResearcherAction } from "@/app/actions/researcher-auth";
import { useServiceErrors } from "@/components/use-service-errors";

export function ResearcherLoginForm() {
  const router = useRouter();
  const { reportError, errorModal } = useServiceErrors();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      try {
        const result = await loginResearcherAction({ email, password });
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
      <p className="text-[11px] uppercase tracking-[0.18em] text-unn-gold">Researcher portal</p>
      <h1 className="mt-2 font-serif text-3xl text-unn-green">Sign in</h1>
      <p className="mt-2 text-sm text-unn-muted">
        Access your projects, equipment catalogue, and ORID researcher profile.
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
          <div className="relative mt-1.5">
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              className="h-11 w-full rounded-xl border border-unn-green/15 px-3 pr-11 text-sm outline-none focus:border-unn-gold"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-unn-green/50 transition-colors hover:text-unn-green"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="h-11 w-full rounded-full bg-unn-green text-sm font-semibold text-white hover:bg-unn-green-mid disabled:opacity-60"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-unn-muted">
        New investigator?{" "}
        <Link href="/#join" className="font-medium text-unn-green hover:underline">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-unn-muted">
        ORID staff?{" "}
        <Link href="/login" className="font-medium text-unn-green hover:underline">
          Staff sign in
        </Link>
      </p>
      {errorModal}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.5 10.6A2.6 2.6 0 0 0 12 14.6m4.1-1.3C17.6 12.5 18.8 11.4 19.5 10.8c.6-.5.6-1.1 0-1.6C17.6 7.6 15 5 12 5c-1.1 0-2.2.4-3.2 1M6.2 7.3C4.4 8.6 3.2 10.2 2.5 11.2c-.6.5-.6 1.1 0 1.6C4.4 14.4 7 17 12 17c1.5 0 2.8-.3 4-.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
