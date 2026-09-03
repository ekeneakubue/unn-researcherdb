"use client";

import { useEffect, useState, useTransition } from "react";
import { ServiceErrorModal } from "@/components/service-error-modal";
import { logServiceFailure, toServiceError } from "@/lib/service-error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [isPending, startTransition] = useTransition();
  const serviceError = toServiceError(error, "Page");

  useEffect(() => {
    logServiceFailure("Page", error);
  }, [error]);

  function handleRetry() {
    startTransition(() => {
      reset();
    });
  }

  return (
    <div className="min-h-screen bg-unn-cream">
      {!open ? (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <h1 className="font-serif text-3xl text-unn-green">UNN Research</h1>
          <p className="mt-3 max-w-md text-sm text-unn-muted">
            This page could not finish loading. You can try again or continue with the rest of the
            site.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="h-11 rounded-full px-5 text-sm font-semibold text-unn-green hover:bg-white"
            >
              View details
            </button>
            <button
              type="button"
              onClick={handleRetry}
              disabled={isPending}
              className="h-11 rounded-full bg-unn-green px-5 text-sm font-semibold text-white hover:bg-unn-green-mid disabled:opacity-60"
            >
              {isPending ? "Retrying…" : "Try again"}
            </button>
          </div>
        </div>
      ) : null}

      <ServiceErrorModal
        open={open}
        errors={[serviceError]}
        onClose={() => setOpen(false)}
        onRetry={handleRetry}
        retrying={isPending}
      />
    </div>
  );
}
