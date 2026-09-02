"use client";

import { useMemo, useState, useTransition } from "react";
import { updateResearcherEquipmentAction } from "@/app/actions/researcher/equipment";
import { availabilityStyles, StatusBadge } from "@/components/admin/status-badge";
import { EditEquipmentModal } from "@/components/researcher/edit-equipment-modal";
import type { UpdateResearcherEquipmentInput } from "@/lib/equipment-shared";
import type { ResearcherEquipmentRow } from "@/lib/researcher-dashboard-shared";

const availabilities = ["All", "Available", "In use", "Maintenance"] as const;

export function ResearcherEquipmentPanel({ items: initialItems }: { items: ResearcherEquipmentRow[] }) {
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<(typeof availabilities)[number]>("All");
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<ResearcherEquipmentRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesAvailability =
        availability === "All" || item.availability === availability;
      const matchesQuery =
        !needle ||
        item.name.toLowerCase().includes(needle) ||
        item.lab.toLowerCase().includes(needle) ||
        item.id.toLowerCase().includes(needle) ||
        item.location.toLowerCase().includes(needle);
      return matchesAvailability && matchesQuery;
    });
  }, [query, availability, items]);

  function handleSave(input: UpdateResearcherEquipmentInput) {
    if (!editing) return;

    setError(null);
    startTransition(async () => {
      const result = await updateResearcherEquipmentAction(editing.id, input);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setItems((current) =>
        current.map((item) => (item.id === result.item.id ? result.item : item)),
      );
      setEditing(null);
    });
  }

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-unn-muted">
        Instruments you custodian or equipment registered on your research projects.
      </p>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search instrument, lab, or ID"
          className="h-11 flex-1 rounded-xl border border-unn-green/15 bg-white px-3 text-sm outline-none focus:border-unn-gold"
        />
        <select
          value={availability}
          onChange={(event) =>
            setAvailability(event.target.value as (typeof availabilities)[number])
          }
          className="h-11 rounded-xl border border-unn-green/15 bg-white px-3 text-sm outline-none focus:border-unn-gold"
        >
          {availabilities.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-unn-green/10">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-unn-green/10 bg-unn-cream/60 text-xs uppercase tracking-wider text-unn-muted">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Instrument</th>
              <th className="px-4 py-3 font-medium">Lab</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Custodian</th>
              <th className="px-4 py-3 font-medium">Availability</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-unn-green/8">
            {rows.map((item) => (
              <tr key={item.id} className="hover:bg-unn-cream/50">
                <td className="px-4 py-3 font-mono text-xs text-unn-muted">{item.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-unn-ink">{item.name}</p>
                  <p className="text-xs text-unn-muted">{item.window}</p>
                </td>
                <td className="px-4 py-3">{item.lab}</td>
                <td className="px-4 py-3 text-unn-muted">{item.location}</td>
                <td className="px-4 py-3">
                  {item.custodian}
                  {item.isCustodian ? (
                    <span className="ml-2 rounded-full bg-unn-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-unn-green">
                      You
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge label={item.availability} styles={availabilityStyles} />
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setEditing(item)}
                    disabled={isPending}
                    className="rounded-full border border-unn-green/20 px-3 py-1.5 text-xs font-semibold text-unn-green hover:bg-unn-cream disabled:opacity-60"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-unn-muted">
            No equipment linked to your profile yet. Add a project with equipment or ask ORID to
            assign you as custodian.
          </p>
        ) : null}
      </div>

      <EditEquipmentModal
        open={editing !== null}
        item={editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        saving={isPending}
      />
    </div>
  );
}
