"use client";

import { useEffect, useId, useRef } from "react";
import { researchStatusStyles, StatusBadge } from "@/components/admin/status-badge";
import type { HomePerson, HomeResearchDetail } from "@/lib/home-shared";

type HomeResearchDetailModalProps = {
  open: boolean;
  loading: boolean;
  detail: HomeResearchDetail | null;
  onClose: () => void;
};

export function HomeResearchDetailModal({
  open,
  loading,
  detail,
  onClose,
}: HomeResearchDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

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
            <p className="font-mono text-xs text-unn-muted">{detail?.id ?? "Research project"}</p>
            <h2 id={titleId} className="mt-1 font-serif text-2xl text-unn-green">
              {detail?.title ?? "Research details"}
            </h2>
            {detail ? (
              <div className="mt-3">
                <StatusBadge label={detail.status} styles={researchStatusStyles} />
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
            <p className="text-sm text-unn-muted">Loading project details…</p>
          ) : detail ? (
            <>
              <section className="space-y-4">
                <h3 className="font-serif text-xl text-unn-green">Research Details</h3>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <DetailField label="Abstract" value={detail.abstract} className="sm:col-span-2" />
                  <DetailField label="Start date" value={detail.startDate} />
                  <DetailField label="End date" value={detail.endDate} />
                  <DetailField label="Principal researcher" value={detail.principalResearcher} />
                  <DetailField
                    label="Principal researcher email"
                    value={detail.principalResearcherEmail}
                  />
                  <DetailField
                    label="Co-researchers"
                    value={formatPeopleList(detail.coResearchers)}
                    className="sm:col-span-2"
                  />
                  <DetailField
                    label="Collaborators"
                    value={formatPeopleList(detail.collaborators)}
                    className="sm:col-span-2"
                  />
                  <DetailField label="Research area" value={detail.researchArea} />
                  <DetailField label="Faculty/Center/Institute" value={detail.faculty} />
                  <DetailField label="Department" value={detail.department} className="sm:col-span-2" />
                  <DetailField label="Research output" value={detail.researchOutput} />
                  <DetailField label="Research funding" value={detail.funding} />
                </dl>
              </section>

              <section className="mt-8 space-y-4 border-t border-unn-green/10 pt-6">
                <h3 className="font-serif text-xl text-unn-green">Research Equipment</h3>
                {detail.equipment.length > 0 ? (
                  <div className="space-y-4">
                    {detail.equipment.map((item) => (
                      <div
                        key={`${item.name}-${item.model}-${item.make}`}
                        className="rounded-xl bg-unn-cream/60 p-4 ring-1 ring-unn-green/10"
                      >
                        <dl className="grid gap-3 sm:grid-cols-2">
                          <DetailField label="Equipment name" value={item.name} className="sm:col-span-2" />
                          <DetailField label="Model" value={item.model || "—"} />
                          <DetailField label="Make" value={item.make || "—"} />
                          <DetailField label="Location/Ownership" value={item.location || "—"} />
                          <DetailField label="Condition" value={item.condition} />
                        </dl>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-unn-muted">No equipment linked to this project.</p>
                )}
              </section>
            </>
          ) : (
            <p className="text-sm text-unn-muted">Could not load project details.</p>
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

function formatPeopleList(people: HomePerson[]) {
  if (people.length === 0) return "—";
  return people
    .map((person) => (person.email ? `${person.name} (${person.email})` : person.name))
    .join(", ");
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
