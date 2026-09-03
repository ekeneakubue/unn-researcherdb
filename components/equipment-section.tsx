"use client";

import { useState } from "react";
import { getHomeEquipmentDetailAction } from "@/app/actions/home";
import { HomeEquipmentDetailModal } from "@/components/home-equipment-detail-modal";
import { useServiceErrors } from "@/components/use-service-errors";
import type { HomeEquipmentDetail, HomeEquipmentItem } from "@/lib/home-shared";

const badgeStyles: Record<string, string> = {
  Available: "bg-emerald-100 text-emerald-800",
  "In use": "bg-amber-100 text-amber-800",
  Maintenance: "bg-rose-100 text-rose-800",
};

type EquipmentSectionProps = {
  items: HomeEquipmentItem[];
};

export function EquipmentSection({ items }: EquipmentSectionProps) {
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [detail, setDetail] = useState<HomeEquipmentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const { reportErrors, errorModal } = useServiceErrors();

  async function openDetails(equipmentId: string) {
    setViewingId(equipmentId);
    setDetail(null);
    setDetailLoading(true);

    const result = await getHomeEquipmentDetailAction(equipmentId);
    setDetailLoading(false);

    if (!result.ok) {
      reportErrors(result.errors);
      setViewingId(null);
      return;
    }

    if (!result.data) {
      reportErrors([
        {
          label: "Equipment details",
          title: "Not found",
          message: "This equipment could not be found.",
          retryable: false,
        },
      ]);
      setViewingId(null);
      return;
    }

    setDetail(result.data);
  }

  function closeDetails() {
    setViewingId(null);
    setDetail(null);
    setDetailLoading(false);
  }

  return (
    <section id="equipment" className="scroll-mt-32 bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-unn-gold">
            Research equipment
          </p>
          <h2 className="mt-2 font-serif text-3xl text-unn-green sm:text-4xl">
            Shared instruments, booked in one place
          </h2>
          <p className="mt-3 text-unn-muted">
            See what is free across UNN labs before you walk across campus.
            Supervisors approve access; technicians confirm induction.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="mt-10 text-center text-sm text-unn-muted">
            No equipment has been listed yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col rounded-3xl border border-unn-green/10 bg-unn-cream p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-xl text-unn-ink">{item.name}</h3>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[item.availability] ?? "bg-slate-100 text-slate-700"}`}
                  >
                    {item.availability}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-unn-green">{item.lab}</p>
                <p className="mt-1 text-sm text-unn-muted">{item.location}</p>
                <p className="mt-4 flex-1 text-sm text-unn-ink/80">{item.window}</p>
                <button
                  type="button"
                  onClick={() => openDetails(item.id)}
                  disabled={detailLoading && viewingId === item.id}
                  className="mt-4 self-start rounded-full border border-unn-green/20 px-3 py-1.5 text-xs font-semibold text-unn-green hover:bg-white disabled:opacity-60"
                >
                  View details
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      <HomeEquipmentDetailModal
        open={viewingId !== null}
        loading={detailLoading}
        detail={detail}
        onClose={closeDetails}
      />
      {errorModal}
    </section>
  );
}
