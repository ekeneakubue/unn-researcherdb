"use client";

import { useMemo, useState, useTransition } from "react";
import { createUserAction } from "@/app/actions/admin/users";
import { AddUserModal } from "@/components/admin/add-user-modal";
import { researcherStatusStyles, StatusBadge } from "@/components/admin/status-badge";
import type { AdminUser } from "@/lib/admin-data";

const statuses = ["All", "Active", "Pending", "Suspended"] as const;

type UsersTableProps = {
  initialUsers: AdminUser[];
  assignableRoles: string[];
};

export function UsersTable({ initialUsers, assignableRoles }: UsersTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [users, setUsers] = useState(initialUsers);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
          setError(null);
          startTransition(async () => {
            const result = await createUserAction(user);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            setUsers((current) => [result.user, ...current]);
            setAdding(false);
          });
        }}
      />
    </div>
  );
}
