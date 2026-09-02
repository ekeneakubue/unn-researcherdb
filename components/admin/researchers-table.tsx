"use client";

import { useMemo, useState, useTransition } from "react";
import { deleteResearcherAction } from "@/app/actions/admin/researchers";
import { useServiceErrors } from "@/components/use-service-errors";
import type { AdminResearcherRow } from "@/lib/researchers-shared";

type ResearchersTableProps = {
  initialResearchers: AdminResearcherRow[];
};

export function ResearchersTable({ initialResearchers }: ResearchersTableProps) {
  const [query, setQuery] = useState("");
  const [researchers, setResearchers] = useState(initialResearchers);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { reportError, errorModal } = useServiceErrors();
  const [isPending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return researchers;

    return researchers.filter(
      (person) =>
        person.name.toLowerCase().includes(needle) ||
        person.email.toLowerCase().includes(needle) ||
        person.faculty.toLowerCase().includes(needle) ||
        person.id.toLowerCase().includes(needle),
    );
  }, [query, researchers]);

  function handleDelete(person: AdminResearcherRow) {
    const confirmed = window.confirm(
      `Delete ${person.name}? This removes their portal account and cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(person.id);

    startTransition(async () => {
      const result = await deleteResearcherAction(person.id);

      if (!result.ok) {
        reportError(new Error(result.error), "Delete researcher");
        setDeletingId(null);
        return;
      }

      setResearchers((current) => current.filter((item) => item.id !== person.id));
      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-xl text-sm text-unn-muted">
          Faculty, fellows, and postgraduate investigators with access to the
          research portal.
        </p>
        <button
          type="button"
          className="rounded-full bg-unn-green px-4 py-2 text-sm font-semibold text-white hover:bg-unn-green-mid"
        >
          Invite researcher
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, or faculty"
          className="h-11 flex-1 rounded-xl border border-unn-green/15 bg-white px-3 text-sm outline-none focus:border-unn-gold"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-unn-green/10">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-unn-green/10 bg-unn-cream/60 text-xs uppercase tracking-wider text-unn-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Staff ID</th>
              <th className="px-4 py-3 font-medium">Researcher</th>
              <th className="px-4 py-3 font-medium">Faculty</th>
              <th className="px-4 py-3 font-medium">Projects</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-unn-green/8">
            {rows.map((person) => (
              <tr key={person.id} className="hover:bg-unn-cream/50">
                <td className="px-4 py-3 font-mono text-xs text-unn-muted">{person.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-unn-ink">{person.name}</p>
                  <p className="text-xs text-unn-muted">{person.email}</p>
                </td>
                <td className="px-4 py-3">{person.faculty}</td>
                <td className="px-4 py-3">{person.projects}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleDelete(person)}
                    disabled={isPending && deletingId === person.id}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    {isPending && deletingId === person.id ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-unn-muted">
            No researchers match this filter.
          </p>
        ) : null}
      </div>
      {errorModal}
    </div>
  );
}
