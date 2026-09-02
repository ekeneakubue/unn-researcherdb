"use client";

import { useTransition } from "react";
import { logoutResearcherAction } from "@/app/actions/researcher-auth";

export function ResearcherLogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => logoutResearcherAction())}
      className="mt-2 block w-full rounded-xl px-3 py-2 text-left text-sm text-white/75 hover:bg-white/8 hover:text-white disabled:opacity-60"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
