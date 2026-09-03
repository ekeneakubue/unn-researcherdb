"use client";

import { useMemo, useState, useTransition } from "react";
import {
  deleteResearcherAction,
  updateResearcherAction,
} from "@/app/actions/admin/researchers";
import { EditResearcherModal } from "@/components/admin/edit-researcher-modal";
import { useServiceErrors } from "@/components/use-service-errors";
import type { AdminResearcherRow, UpdateAdminResearcherInput } from "@/lib/researchers-shared";

type ResearchersTableProps = {
  initialResearchers: AdminResearcherRow[];
  showEdit?: boolean;
};

export function ResearchersTable({
  initialResearchers,
  showEdit = false,
}: ResearchersTableProps) {
  const [query, setQuery] = useState("");
  const [researchers, setResearchers] = useState(initialResearchers);
  const [editing, setEditing] = useState<AdminResearcherRow | null>(null);
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

  function handleSave(input: UpdateAdminResearcherInput) {
    if (!editing) return;

    startTransition(async () => {
      const result = await updateResearcherAction(editing.id, input);
      if (!result.ok) {
        reportError(new Error(result.error), "Update researcher");
        return;
      }

      setResearchers((current) =>
        current.map((person) =>
          person.id === result.researcher.id ? result.researcher : person,
        ),
      );
      setEditing(null);
    });
  }

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
                  <div className="flex items-center gap-2">
                    {showEdit ? (
                      <button
                        type="button"
                        onClick={() => setEditing(person)}
                        disabled={isPending}
                        aria-label={`Edit ${person.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-unn-green hover:bg-unn-cream disabled:opacity-60"
                      >
                        <EditIcon />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleDelete(person)}
                      disabled={isPending && deletingId === person.id}
                      className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      {isPending && deletingId === person.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
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

      {showEdit ? (
        <EditResearcherModal
          open={editing !== null}
          researcher={editing}
          saving={isPending}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      ) : null}

      {errorModal}
    </div>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3ZM13.5 7.5l3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
