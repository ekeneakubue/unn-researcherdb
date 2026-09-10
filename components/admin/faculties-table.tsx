"use client";

import { useMemo, useState, useTransition } from "react";
import { createFacultyAction } from "@/app/actions/admin/faculties";
import { AddFacultyModal } from "@/components/admin/add-faculty-modal";
import { useServiceErrors } from "@/components/use-service-errors";
import type { AdminFaculty } from "@/lib/faculties";
import {
  FACULTY_UNIT_TYPE_LABELS,
  type FacultyUnitType,
} from "@/lib/faculties-shared";

type FacultiesTableProps = {
  initialFaculties: AdminFaculty[];
};

export function FacultiesTable({ initialFaculties }: FacultiesTableProps) {
  const [query, setQuery] = useState("");
  const [faculties, setFaculties] = useState(initialFaculties);
  const [adding, setAdding] = useState(false);
  const { reportError, errorModal } = useServiceErrors();
  const [isPending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return faculties.filter(
      (faculty) =>
        !needle ||
        faculty.name.toLowerCase().includes(needle) ||
        FACULTY_UNIT_TYPE_LABELS[faculty.type].toLowerCase().includes(needle),
    );
  }, [faculties, query]);

  function handleCreate(input: { name: string; type: FacultyUnitType }) {
    startTransition(async () => {
      const result = await createFacultyAction(input);
      if (!result.ok) {
        reportError(new Error(result.error), "Add faculty");
        return;
      }

      setFaculties((current) =>
        [...current, result.faculty].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setAdding(false);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-xl text-sm text-unn-muted">
          Faculties, centers, institutes, schools, colleges, and administration
          units available for researcher signup and profile selection.
        </p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          disabled={isPending}
          className="rounded-full bg-unn-green px-4 py-2 text-sm font-semibold text-white hover:bg-unn-green-mid disabled:opacity-60"
        >
          Add faculty
        </button>
      </div>

      <label className="block w-full max-w-xs text-sm">
        <span className="mb-1.5 block text-unn-muted">Search</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find a faculty"
          className="w-full rounded-xl border border-unn-green/15 bg-white px-3 py-2.5 outline-none focus:border-unn-green"
        />
      </label>

      <div className="overflow-x-auto rounded-2xl border border-unn-green/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-unn-green/10 bg-unn-cream/60 text-xs uppercase tracking-[0.12em] text-unn-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Faculty/Center/Institute</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Departments</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-unn-green/8 last:border-0">
                <td className="px-4 py-3 font-medium text-unn-ink">{row.name}</td>
                <td className="px-4 py-3 text-unn-muted">
                  {FACULTY_UNIT_TYPE_LABELS[row.type]}
                </td>
                <td className="px-4 py-3 text-unn-muted">{row.departmentCount}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-unn-muted">
                  No faculties match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <AddFacultyModal
        open={adding}
        onClose={() => setAdding(false)}
        onCreate={handleCreate}
        pending={isPending}
      />
      {errorModal}
    </div>
  );
}
