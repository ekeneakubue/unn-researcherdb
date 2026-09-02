"use client";

import { useEffect, useState, useTransition } from "react";
import { ServiceErrorModal } from "@/components/service-error-modal";
import { toServiceError } from "@/lib/service-error";

export default function RootGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [isPending, startTransition] = useTransition();
  const serviceError = toServiceError(error, "Application");

  useEffect(() => {
    console.error(error);
  }, [error]);

  function handleRetry() {
    startTransition(() => {
      reset();
    });
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-unn-cream text-unn-ink antialiased">
        {!open ? (
          <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
            <h1 className="font-serif text-3xl text-unn-green">UNN Research</h1>
            <p className="mt-3 max-w-md text-sm text-unn-muted">
              Something went wrong while loading the application.
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
      </body>
    </html>
  );
}
