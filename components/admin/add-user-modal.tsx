"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  type AdminUser,
  type AdminUserStatus,
} from "@/lib/admin-data";

type UserRole = string;

const statuses: AdminUserStatus[] = ["Pending", "Active", "Suspended"];

const defaultRole = (roles: string[]) => roles[0] ?? "Officer";

const emptyForm = (roles: string[]) => ({
  name: "",
  email: "",
  password: "",
  role: defaultRole(roles),
  status: "Pending" as AdminUserStatus,
});

type AddUserModalProps = {
  open: boolean;
  onClose: () => void;
  assignableRoles: string[];
  onCreate: (
    user: Omit<AdminUser, "id" | "lastActive" | "unit"> & { password: string },
  ) => void;
};

export function AddUserModal({ open, onClose, assignableRoles, onCreate }: AddUserModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const passwordId = useId();
  const [form, setForm] = useState(emptyForm(assignableRoles));
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        setForm(emptyForm(assignableRoles));
        setShowPassword(false);
        dialog.showModal();
      }
    } else {
      setForm(emptyForm(assignableRoles));
      setShowPassword(false);
      if (dialog.open) dialog.close();
    }
  }, [open, assignableRoles]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assignableRoles.includes(form.role)) return;
    onCreate({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      status: form.status,
    });
    onClose();
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
              Add new user
            </h2>
            <p className="mt-1 text-sm text-unn-muted">
              Create a portal account for an ORID officer, lab staff member, or
              faculty coordinator.
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            Full name
            <input
              required
              autoFocus
              autoComplete="name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 px-3 text-sm outline-none focus:border-unn-gold"
              placeholder="Mrs. Adaeze Okonkwo"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            UNN email
            <input
              required
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 px-3 text-sm outline-none focus:border-unn-gold"
              placeholder="you@unn.edu.ng"
            />
          </label>
          <div className="sm:col-span-2">
            <label htmlFor={passwordId} className="block text-sm">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id={passwordId}
                required
                minLength={8}
                autoComplete="new-password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
                className="h-11 w-full rounded-xl border border-unn-green/15 px-3 pr-11 text-sm outline-none focus:border-unn-gold"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-unn-muted transition-colors hover:text-unn-ink"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <label className="block text-sm">
            Role
            <select
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value as UserRole,
                }))
              }
              className="mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 bg-white px-3 text-sm outline-none focus:border-unn-gold"
            >
              {assignableRoles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Status
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as AdminUserStatus,
                }))
              }
              className="mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 bg-white px-3 text-sm outline-none focus:border-unn-gold"
            >
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full px-5 text-sm font-semibold text-unn-green hover:bg-unn-cream"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-11 rounded-full bg-unn-green px-5 text-sm font-semibold text-white hover:bg-unn-green-mid"
          >
            Create user
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

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.5 10.6A2.6 2.6 0 0 0 12 14.6m4.1-1.3C17.6 12.5 18.8 11.4 19.5 10.8c.6-.5.6-1.1 0-1.6C17.6 7.6 15 5 12 5c-1.1 0-2.2.4-3.2 1M6.2 7.3C4.4 8.6 3.2 10.2 2.5 11.2c-.6.5-.6 1.1 0 1.6C4.4 14.4 7 17 12 17c1.5 0 2.8-.3 4-.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
