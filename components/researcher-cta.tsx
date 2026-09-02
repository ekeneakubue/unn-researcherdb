"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { registerResearcherAction } from "@/app/actions/researcher-signup";

const emptyForm = {
  name: "",
  email: "",
  faculty: "",
  password: "",
};

export function ResearcherCta() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await registerResearcherAction({
        name: form.name.trim(),
        email: form.email.trim(),
        faculty: form.faculty.trim(),
        password: form.password,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setForm(emptyForm);
      setShowPassword(false);
      router.push(result.redirectTo);
      router.refresh();
    });
  }

  return (
    <section id="join" className="scroll-mt-32 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-unn-green text-white shadow-xl ring-1 ring-unn-gold/30">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-unn-gold-soft">
                Are you a researcher?
              </p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                Claim your UNN research profile
              </h2>
              <p className="mt-4 max-w-xl text-white/80">
                Faculty, research fellows, and postgraduate investigators can
                publish a living record of projects, request equipment, and
                invite collaborators from other departments.
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "ORCID-linked publications indexed under your department",
                  "Book shared instruments with supervisor approval",
                  "Find co-investigators across the 16 faculties",
                  "Submit ethics and TETFund paperwork from one dashboard",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-unn-gold text-[11px] font-bold text-unn-ink">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/10 bg-black/15 p-8 sm:p-12 lg:border-l lg:border-t-0">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {error ? (
                  <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-100 ring-1 ring-red-300/30">
                    {error}
                  </p>
                ) : null}
                <div>
                  <label htmlFor="full-name" className="text-sm font-medium">
                    Full name
                  </label>
                  <input
                    id="full-name"
                    name="name"
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                    className="mt-1.5 h-11 w-full rounded-xl border border-white/15 bg-white/8 px-3 text-sm outline-none placeholder:text-white/40 focus:border-unn-gold"
                    placeholder="Prof. Adaeze Okonkwo"
                  />
                </div>
                <div>
                  <label htmlFor="staff-email" className="text-sm font-medium">
                    UNN email
                  </label>
                  <input
                    id="staff-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, email: event.target.value }))
                    }
                    className="mt-1.5 h-11 w-full rounded-xl border border-white/15 bg-white/8 px-3 text-sm outline-none placeholder:text-white/40 focus:border-unn-gold"
                    placeholder="you@unn.edu.ng"
                  />
                </div>
                <div>
                  <label htmlFor="faculty" className="text-sm font-medium">
                    Faculty / department
                  </label>
                  <input
                    id="faculty"
                    name="faculty"
                    required
                    value={form.faculty}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, faculty: event.target.value }))
                    }
                    className="mt-1.5 h-11 w-full rounded-xl border border-white/15 bg-white/8 px-3 text-sm outline-none placeholder:text-white/40 focus:border-unn-gold"
                    placeholder="Faculty of Agriculture"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, password: event.target.value }))
                      }
                      className="h-11 w-full rounded-xl border border-white/15 bg-white/8 px-3 pr-11 text-sm outline-none placeholder:text-white/40 focus:border-unn-gold"
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-unn-gold-soft transition-colors hover:text-white"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-12 w-full rounded-full bg-unn-gold text-sm font-semibold text-unn-ink transition-colors hover:bg-unn-gold-soft disabled:opacity-60"
                >
                  {isPending ? "Creating account…" : "Create researcher account"}
                </button>
                <p className="text-center text-xs text-white/60">
                  Already registered?{" "}
                  <Link
                    href="/researcher/login"
                    className="underline decoration-unn-gold underline-offset-2"
                  >
                    Sign in to your dashboard
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
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
