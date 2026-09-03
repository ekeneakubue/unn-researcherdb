"use client";

import { useEffect, useId, useRef, useState } from "react";
import { availabilityStyles, StatusBadge } from "@/components/admin/status-badge";
import type { HomeEquipmentDetail } from "@/lib/home-shared";

type HomeEquipmentDetailModalProps = {
  open: boolean;
  loading: boolean;
  detail: HomeEquipmentDetail | null;
  onClose: () => void;
};

export function HomeEquipmentDetailModal({
  open,
  loading,
  detail,
  onClose,
}: HomeEquipmentDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open, mounted]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  // Avoid SSR/hydration mismatch from native <dialog> (same pattern as ServiceErrorHost).
  if (!mounted || !open) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto max-h-[min(90vh,56rem)] w-[min(44rem,calc(100vw-2rem))] flex-col rounded-2xl border-0 bg-white p-0 text-unn-ink shadow-xl open:flex backdrop:bg-unn-ink/40"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 sm:px-8">
          <div>
            <p className="font-mono text-xs text-unn-muted">{detail?.id ?? "Equipment"}</p>
            <h2 id={titleId} className="mt-1 font-serif text-2xl text-unn-green">
              {detail?.name ?? "Equipment details"}
            </h2>
            {detail ? (
              <div className="mt-3">
                <StatusBadge label={detail.availability} styles={availabilityStyles} />
              </div>
            ) : null}
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

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {loading ? (
            <p className="text-sm text-unn-muted">Loading equipment details…</p>
          ) : detail ? (
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailField label="Model" value={detail.model} />
              <DetailField label="Make" value={detail.make} />
              <DetailField label="Laboratory" value={detail.lab} />
              <DetailField label="Location" value={detail.location} />
              <DetailField label="Condition" value={detail.condition} />
              <DetailField label="Custodian" value={detail.custodian} />
              <DetailField
                label="Availability note"
                value={detail.availabilityNote}
                className="sm:col-span-2"
              />
              <DetailField
                label="Linked research"
                value={
                  detail.linkedResearch.length > 0
                    ? detail.linkedResearch.join("\n")
                    : "—"
                }
                className="sm:col-span-2"
              />
            </dl>
          ) : (
            <p className="text-sm text-unn-muted">Could not load equipment details.</p>
          )}
        </div>

        <div className="flex shrink-0 justify-end border-t border-unn-green/10 px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full bg-unn-green px-5 text-sm font-semibold text-white hover:bg-unn-green-mid"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}

function DetailField({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wider text-unn-muted">{label}</dt>
      <dd className="mt-1 text-sm text-unn-ink whitespace-pre-wrap">{value || "—"}</dd>
    </div>
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
