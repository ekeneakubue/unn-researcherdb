"use client";

import { useMemo, useState, useTransition } from "react";
import { createResearchAction, deleteResearchAction, getResearchDetailAction, updateResearchStatusAction } from "@/app/actions/admin/research";
import { AddResearchModal } from "@/components/admin/add-research-modal";
import { ResearchCsvToolbar } from "@/components/admin/research-csv-toolbar";
import { ResearchDetailModal } from "@/components/admin/research-detail-modal";
import { researchStatusStyles, StatusBadge } from "@/components/admin/status-badge";
import { useServiceErrors } from "@/components/use-service-errors";
import type { AdminResearchDetail, AdminResearchRow, ResearchStatusLabel } from "@/lib/research-shared";

const statuses = ["All", "Active", "Recruiting", "Under review", "Completed"] as const;

type ResearchTableProps = {
  initialProjects: AdminResearchRow[];
  showCsvImport?: boolean;
  showDelete?: boolean;
};

export function ResearchTable({
  initialProjects,
  showCsvImport = false,
  showDelete = false,
}: ResearchTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [projects, setProjects] = useState(initialProjects);
  const [adding, setAdding] = useState(false);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminResearchDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { reportErrors, errorModal } = useServiceErrors();
  const [isPending, startTransition] = useTransition();

  async function openDetails(projectId: string) {
    setViewingId(projectId);
    setDetail(null);
    setDetailLoading(true);

    const result = await getResearchDetailAction(projectId);
    setDetailLoading(false);

    if (!result.ok) {
      reportErrors(result.errors);
      setViewingId(null);
      return;
    }

    if (!result.data) {
      reportErrors([
        {
          label: "Project details",
          title: "Not found",
          message: "This project could not be found.",
          retryable: false,
        },
      ]);
      setViewingId(null);
      return;
    }

    setDetail(result.data);
  }

  function closeDetails() {
    setViewingId(null);
    setDetail(null);
    setDetailLoading(false);
    setStatusSaving(false);
  }

  async function handleStatusChange(nextStatus: ResearchStatusLabel) {
    if (!detail) return;

    setStatusSaving(true);

    const result = await updateResearchStatusAction(detail.id, nextStatus);
    setStatusSaving(false);

    if (!result.ok) {
      reportErrors(result.errors);
      return;
    }

    if (!result.data) {
      reportErrors([
        {
          label: "Update status",
          title: "Not found",
          message: "This project could not be found.",
          retryable: false,
        },
      ]);
      return;
    }

    setDetail(result.data);
    setProjects((current) =>
      current.map((project) =>
        project.id === result.data!.id ? { ...project, status: result.data!.status } : project,
      ),
    );
  }

  function handleDelete(project: AdminResearchRow) {
    const confirmed = window.confirm(
      `Delete "${project.title}"? This removes the project record and cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(project.id);
    startTransition(async () => {
      const result = await deleteResearchAction(project.id);

      if (!result.ok) {
        reportErrors(result.errors);
        setDeletingId(null);
        return;
      }

      if (viewingId === project.id) {
        closeDetails();
      }

      setProjects((current) => current.filter((item) => item.id !== project.id));
      setDeletingId(null);
    });
  }

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesStatus = status === "All" || project.status === status;
      const matchesQuery =
        !needle ||
        project.title.toLowerCase().includes(needle) ||
        project.lead.toLowerCase().includes(needle) ||
        project.id.toLowerCase().includes(needle) ||
        project.faculty.toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [query, status, projects]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-xl text-sm text-unn-muted">
          Catalogue, funding source, and review status for campus projects.
        </p>
        <div className="flex flex-wrap gap-2">
          {showCsvImport ? (
            <ResearchCsvToolbar
              disabled={isPending}
              onImported={(imported) =>
                setProjects((current) => [...imported, ...current])
              }
            />
          ) : null}
          <button
            type="button"
            onClick={() => setAdding(true)}
            disabled={isPending}
            className="rounded-full bg-unn-green px-4 py-2 text-sm font-semibold text-white hover:bg-unn-green-mid disabled:opacity-60"
          >
            Add research
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search title, PI, or ID"
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
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-unn-green/10 bg-unn-cream/60 text-xs uppercase tracking-wider text-unn-muted">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Faculty</th>
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium">Funding</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-unn-green/8">
            {rows.map((project) => (
              <tr key={project.id} className="hover:bg-unn-cream/50">
                <td className="px-4 py-3 font-mono text-xs text-unn-muted">{project.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-unn-ink">{project.title}</p>
                  <p className="text-xs text-unn-muted">
                    {project.lead} · {project.unit}
                  </p>
                </td>
                <td className="px-4 py-3">{project.faculty}</td>
                <td className="px-4 py-3">{project.year}</td>
                <td className="px-4 py-3">{project.funding}</td>
                <td className="px-4 py-3">
                  <StatusBadge label={project.status} styles={researchStatusStyles} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openDetails(project.id)}
                      disabled={detailLoading && viewingId === project.id}
                      className="rounded-full border border-unn-green/20 px-3 py-1.5 text-xs font-semibold text-unn-green hover:bg-unn-cream disabled:opacity-60"
                    >
                      View details
                    </button>
                    {showDelete ? (
                      <button
                        type="button"
                        onClick={() => handleDelete(project)}
                        disabled={isPending && deletingId === project.id}
                        aria-label={`Delete ${project.title}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        <TrashIcon />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-unn-muted">No projects match this filter.</p>
        ) : null}
      </div>

      <ResearchDetailModal
        open={viewingId !== null}
        loading={detailLoading}
        detail={detail}
        statusSaving={statusSaving}
        onClose={closeDetails}
        onStatusChange={handleStatusChange}
      />

      <AddResearchModal
        open={adding}
        onClose={() => setAdding(false)}
        onCreate={(research) => {
          startTransition(async () => {
            const result = await createResearchAction(research);
            if (!result.ok) {
              reportErrors(result.errors);
              return;
            }
            setProjects((current) => [result.data, ...current]);
            setAdding(false);
          });
        }}
      />
      {errorModal}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
