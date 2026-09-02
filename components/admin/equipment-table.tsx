"use client";

import { useMemo, useState } from "react";
import { availabilityStyles, StatusBadge } from "@/components/admin/status-badge";
import type { AdminEquipmentRow } from "@/lib/equipment-shared";

const availabilities = ["All", "Available", "In use", "Maintenance"] as const;

type EquipmentTableProps = {
  initialItems: AdminEquipmentRow[];
};

export function EquipmentTable({ initialItems }: EquipmentTableProps) {
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<(typeof availabilities)[number]>("All");
  const [items] = useState(initialItems);

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
        item.location.toLowerCase().includes(needle) ||
        item.custodian.toLowerCase().includes(needle);
      return matchesAvailability && matchesQuery;
    });
  }, [query, availability, items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-xl text-sm text-unn-muted">
          Shared instruments, custodians, and live availability across Nsukka labs.
        </p>
        <button
          type="button"
          className="rounded-full bg-unn-green px-4 py-2 text-sm font-semibold text-white hover:bg-unn-green-mid"
        >
          Register equipment
        </button>
      </div>

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
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-unn-green/10 bg-unn-cream/60 text-xs uppercase tracking-wider text-unn-muted">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Instrument</th>
              <th className="px-4 py-3 font-medium">Lab</th>
              <th className="px-4 py-3 font-medium">Custodian</th>
              <th className="px-4 py-3 font-medium">Window</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-unn-green/8">
            {rows.map((item) => (
              <tr key={item.id} className="hover:bg-unn-cream/50">
                <td className="px-4 py-3 font-mono text-xs text-unn-muted">{item.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-unn-ink">{item.name}</p>
                  <p className="text-xs text-unn-muted">{item.location}</p>
                </td>
                <td className="px-4 py-3">{item.lab}</td>
                <td className="px-4 py-3">{item.custodian}</td>
                <td className="px-4 py-3 text-unn-muted">{item.window}</td>
                <td className="px-4 py-3">
                  <StatusBadge label={item.availability} styles={availabilityStyles} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-unn-muted">
            No instruments match this filter.
          </p>
        ) : null}
      </div>
    </div>
  );
}
