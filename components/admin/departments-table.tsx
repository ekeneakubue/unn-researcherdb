"use client";

import { useMemo, useState, useTransition } from "react";
import {
  createDepartmentAction,
  deleteDepartmentAction,
  updateDepartmentAction,
} from "@/app/actions/admin/faculties";
import { AddDepartmentModal } from "@/components/admin/add-department-modal";
import { EditDepartmentModal } from "@/components/admin/edit-department-modal";
import { useServiceErrors } from "@/components/use-service-errors";
import type { AdminDepartment, AdminFaculty } from "@/lib/faculties";

type DepartmentsTableProps = {
  initialDepartments: AdminDepartment[];
  faculties: AdminFaculty[];
};

function sortDepartments(rows: AdminDepartment[]) {
  return [...rows].sort((a, b) => {
    const byFaculty = a.facultyName.localeCompare(b.facultyName);
    return byFaculty !== 0 ? byFaculty : a.name.localeCompare(b.name);
  });
}

export function DepartmentsTable({
  initialDepartments,
  faculties,
}: DepartmentsTableProps) {
  const [query, setQuery] = useState("");
  const [facultyId, setFacultyId] = useState("All");
  const [departments, setDepartments] = useState(initialDepartments);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<AdminDepartment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { reportError, errorModal } = useServiceErrors();
  const [isPending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return departments.filter((row) => {
      const matchesFaculty = facultyId === "All" || row.facultyId === facultyId;
      const matchesQuery =
        !needle ||
        row.name.toLowerCase().includes(needle) ||
        row.facultyName.toLowerCase().includes(needle);
      return matchesFaculty && matchesQuery;
    });
  }, [departments, facultyId, query]);

  function handleCreate(input: { name: string; facultyId: string }) {
    startTransition(async () => {
      const result = await createDepartmentAction(input);
      if (!result.ok) {
        reportError(new Error(result.error), "Add department");
        return;
      }

      setDepartments((current) => sortDepartments([...current, result.department]));
      setAdding(false);
    });
  }

  function handleSave(input: { name: string; facultyId: string }) {
    if (!editing) return;

    startTransition(async () => {
      const result = await updateDepartmentAction(editing.id, input);
      if (!result.ok) {
        reportError(new Error(result.error), "Update department");
        return;
      }

      setDepartments((current) =>
        sortDepartments(
          current.map((row) => (row.id === result.department.id ? result.department : row)),
        ),
      );
      setEditing(null);
    });
  }

  function handleDelete(department: AdminDepartment) {
    const confirmed = window.confirm(
      `Delete "${department.name}"? This removes it from the catalog and cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(department.id);
    startTransition(async () => {
      const result = await deleteDepartmentAction(department.id);
      if (!result.ok) {
        reportError(new Error(result.error), "Delete department");
        setDeletingId(null);
        return;
      }

      setDepartments((current) => current.filter((row) => row.id !== department.id));
      if (editing?.id === department.id) setEditing(null);
      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-xl text-sm text-unn-muted">
          Departments grouped by faculty for researcher signup and profile selection.
        </p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          disabled={isPending}
          className="rounded-full bg-unn-green px-4 py-2 text-sm font-semibold text-white hover:bg-unn-green-mid disabled:opacity-60"
        >
          Add department
        </button>
      </div>

      <div className="flex w-full flex-col gap-3 sm:max-w-xl sm:flex-row">
        <label className="block flex-1 text-sm">
          <span className="mb-1.5 block text-unn-muted">Faculty</span>
          <select
            value={facultyId}
            onChange={(event) => setFacultyId(event.target.value)}
            className="w-full rounded-xl border border-unn-green/15 bg-white px-3 py-2.5 outline-none focus:border-unn-green"
          >
            <option value="All">All faculties</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block flex-1 text-sm">
          <span className="mb-1.5 block text-unn-muted">Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a department"
            className="w-full rounded-xl border border-unn-green/15 bg-white px-3 py-2.5 outline-none focus:border-unn-green"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-unn-green/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-unn-green/10 bg-unn-cream/60 text-xs uppercase tracking-[0.12em] text-unn-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Faculty</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-unn-green/8 last:border-0">
                <td className="px-4 py-3 font-medium text-unn-ink">{row.name}</td>
                <td className="px-4 py-3 text-unn-muted">{row.facultyName}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(row)}
                      disabled={isPending}
                      aria-label={`Edit ${row.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-unn-green hover:bg-unn-cream disabled:opacity-60"
                    >
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      disabled={isPending && deletingId === row.id}
                      aria-label={`Delete ${row.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-unn-muted">
                  No departments match your filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <AddDepartmentModal
        open={adding}
        faculties={faculties}
        onClose={() => setAdding(false)}
        onCreate={handleCreate}
        pending={isPending}
      />
      <EditDepartmentModal
        open={editing !== null}
        department={editing}
        faculties={faculties}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        pending={isPending}
      />
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
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M5 8h14M10 8V6h4v2M9 8v10a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
