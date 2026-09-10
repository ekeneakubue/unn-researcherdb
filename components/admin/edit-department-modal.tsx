"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { AdminDepartment, AdminFaculty } from "@/lib/faculties";

type EditDepartmentModalProps = {
  open: boolean;
  department: AdminDepartment | null;
  faculties: AdminFaculty[];
  onClose: () => void;
  onSave: (input: { name: string; facultyId: string }) => void;
  pending?: boolean;
};

export function EditDepartmentModal({
  open,
  department,
  faculties,
  onClose,
  onSave,
  pending = false,
}: EditDepartmentModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [name, setName] = useState("");
  const [facultyId, setFacultyId] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && department) {
      setName(department.name);
      setFacultyId(department.facultyId);
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open, department]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !facultyId || pending) return;
    onSave({ name: trimmed, facultyId });
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl border-0 bg-white p-0 text-unn-ink shadow-xl backdrop:bg-unn-ink/40"
    >
      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="font-serif text-2xl text-unn-green">
              Edit department
            </h2>
            <p className="mt-1 text-sm text-unn-muted">
              Update the department name or move it to another faculty.
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

        <div className="mt-6 grid gap-4">
          <label className="block text-sm">
            Faculty/Center/Institute
            <select
              required
              value={facultyId}
              onChange={(event) => setFacultyId(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 bg-white px-3 text-sm outline-none focus:border-unn-gold"
            >
              {faculties.length === 0 ? (
                <option value="">No faculties available</option>
              ) : (
                faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))
              )}
            </select>
          </label>

          <label className="block text-sm">
            Department name
            <input
              required
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 px-3 text-sm outline-none focus:border-unn-gold"
              placeholder="Computer Science"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="h-11 rounded-full px-5 text-sm font-semibold text-unn-green hover:bg-unn-cream disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending || faculties.length === 0}
            className="h-11 rounded-full bg-unn-green px-5 text-sm font-semibold text-white hover:bg-unn-green-mid disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </dialog>
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
