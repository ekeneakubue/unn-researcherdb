"use client";

import { useMemo, useState, useTransition } from "react";
import { createUserAction, updateUserAction } from "@/app/actions/admin/users";
import { AddUserModal } from "@/components/admin/add-user-modal";
import { EditUserModal } from "@/components/admin/edit-user-modal";
import { researcherStatusStyles, StatusBadge } from "@/components/admin/status-badge";
import { useServiceErrors } from "@/components/use-service-errors";
import type { AdminUser } from "@/lib/admin-data";
import type { UpdateAdminUserInput } from "@/lib/users-shared";

const statuses = ["All", "Active", "Pending", "Suspended"] as const;

type UsersTableProps = {
  initialUsers: AdminUser[];
  assignableRoles: string[];
  showEdit?: boolean;
};

export function UsersTable({
  initialUsers,
  assignableRoles,
  showEdit = false,
}: UsersTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [users, setUsers] = useState(initialUsers);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const { reportError, errorModal } = useServiceErrors();
  const [isPending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesStatus = status === "All" || user.status === status;
      const matchesQuery =
        !needle ||
        user.name.toLowerCase().includes(needle) ||
        user.email.toLowerCase().includes(needle) ||
        user.unit.toLowerCase().includes(needle) ||
        user.role.toLowerCase().includes(needle) ||
        user.id.toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [query, status, users]);

  function handleSave(input: UpdateAdminUserInput) {
    if (!editing) return;

    startTransition(async () => {
      const result = await updateUserAction(editing.id, input);
      if (!result.ok) {
        reportError(new Error(result.error), "Update user");
        return;
      }

      setUsers((current) =>
        current.map((user) => (user.id === result.user.id ? result.user : user)),
      );
      setEditing(null);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-xl text-sm text-unn-muted">
          Portal accounts for ORID officers, lab staff, and faculty coordinators.
        </p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          disabled={isPending}
          className="rounded-full bg-unn-green px-4 py-2 text-sm font-semibold text-white hover:bg-unn-green-mid disabled:opacity-60"
        >
          Add user
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, unit, or role"
          className="h-11 flex-1 rounded-xl border border-unn-green/15 bg-white px-3 text-sm outline-none focus:border-unn-gold"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as (typeof statuses)[number])}
          className="h-11 rounded-xl border border-unn-green/15 bg-white px-3 text-sm outline-none focus:border-unn-gold"
        >
          {statuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-unn-green/10">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-unn-green/10 bg-unn-cream/60 text-xs uppercase tracking-wider text-unn-muted">
            <tr>
              <th className="px-4 py-3 font-medium">User ID</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Unit</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Last active</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {showEdit ? <th className="px-4 py-3 font-medium">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-unn-green/8">
            {rows.map((user) => (
              <tr key={user.id} className="hover:bg-unn-cream/50">
                <td className="px-4 py-3 font-mono text-xs text-unn-muted">{user.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-unn-ink">{user.name}</p>
                  <p className="text-xs text-unn-muted">{user.email}</p>
                </td>
                <td className="px-4 py-3">{user.unit || "—"}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3 text-unn-muted">{user.lastActive}</td>
                <td className="px-4 py-3">
                  <StatusBadge label={user.status} styles={researcherStatusStyles} />
                </td>
                {showEdit ? (
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setEditing(user)}
                      disabled={isPending}
                      aria-label={`Edit ${user.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-unn-green hover:bg-unn-cream disabled:opacity-60"
                    >
                      <EditIcon />
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-unn-muted">No users match this filter.</p>
        ) : null}
      </div>

      <AddUserModal
        open={adding}
        onClose={() => setAdding(false)}
        assignableRoles={assignableRoles}
        onCreate={(user) => {
          startTransition(async () => {
            const result = await createUserAction(user);
            if (!result.ok) {
              reportError(new Error(result.error), "Create user");
              return;
            }
            setUsers((current) => [result.user, ...current]);
            setAdding(false);
          });
        }}
      />

      {showEdit ? (
        <EditUserModal
          open={editing !== null}
          user={editing}
          assignableRoles={assignableRoles}
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
