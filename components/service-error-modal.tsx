"use client";

import { useEffect, useId, useRef } from "react";
import type { ServiceErrorPayload } from "@/lib/service-error";

type ServiceErrorModalProps = {
  open: boolean;
  errors: ServiceErrorPayload[];
  onClose: () => void;
  onRetry?: () => void;
  retrying?: boolean;
};

export function ServiceErrorModal({
  open,
  errors,
  onClose,
  onRetry,
  retrying = false,
}: ServiceErrorModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const hasRetry = Boolean(onRetry && errors.some((error) => error.retryable));
  const headline = errors.length === 1 ? errors[0].title : "We couldn't load everything";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  if (errors.length === 0) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto max-h-[min(90vh,40rem)] w-[min(32rem,calc(100vw-2rem))] flex-col rounded-2xl border-0 bg-white p-0 text-unn-ink shadow-xl open:flex backdrop:bg-unn-ink/50"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-start gap-4 px-6 pt-6 sm:px-8">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-unn-gold/15 text-unn-green"
            aria-hidden="true"
          >
            <OfflineIcon />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="font-serif text-2xl text-unn-green">
              {headline}
            </h2>
            <p className="mt-2 text-sm text-unn-muted">
              The page is still available, but some data could not be loaded right now.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-unn-muted hover:bg-unn-cream hover:text-unn-ink"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8">
          <ul className="space-y-3">
            {errors.map((error) => (
              <li
                key={`${error.label}-${error.message}`}
                className="rounded-xl border border-unn-green/10 bg-unn-cream/60 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-unn-green">
                  {error.label}
                </p>
                <p className="mt-1 text-sm text-unn-ink">{error.message}</p>
                {error.detail ? (
                  <p className="mt-2 text-xs text-unn-muted">{error.detail}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-unn-green/10 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full px-5 text-sm font-semibold text-unn-green hover:bg-unn-cream"
          >
            Continue browsing
          </button>
          {hasRetry ? (
            <button
              type="button"
              onClick={onRetry}
              disabled={retrying}
              className="h-11 rounded-full bg-unn-green px-5 text-sm font-semibold text-white hover:bg-unn-green-mid disabled:opacity-60"
            >
              {retrying ? "Retrying…" : "Try again"}
            </button>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}

function OfflineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M2.5 12a9.5 9.5 0 0 1 16.2-6.7M5.5 12a6.5 6.5 0 0 1 10.8-2.8M8.5 12a3.5 3.5 0 0 1 5.4-1.5M12 16v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 4l16 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
