"use client";

import { useMemo, useState, useTransition } from "react";
import { createResearcherResearchAction } from "@/app/actions/researcher/research";
import { AddResearchModal } from "@/components/admin/add-research-modal";
import { researchStatusStyles, StatusBadge } from "@/components/admin/status-badge";
import type { ResearcherProjectRow } from "@/lib/researcher-dashboard-shared";

const statuses = ["All", "Active", "Recruiting", "Under review", "Completed"] as const;

type ResearcherResearchPanelProps = {
  projects: ResearcherProjectRow[];
  researcherName: string;
  researcherEmail: string;
  researcherFaculty: string;
};

export function ResearcherResearchPanel({
  projects: initialProjects,
  researcherName,
  researcherEmail,
  researcherFaculty,
}: ResearcherResearchPanelProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [projects, setProjects] = useState(initialProjects);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const modalDefaults = useMemo(
    () => ({
      principalResearcher: researcherName,
      principalResearcherEmail: researcherEmail,
      faculty: researcherFaculty,
    }),
    [researcherName, researcherEmail, researcherFaculty],
  );

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesStatus = status === "All" || project.status === status;
      const matchesQuery =
        !needle ||
        project.title.toLowerCase().includes(needle) ||
        project.faculty.toLowerCase().includes(needle) ||
        project.id.toLowerCase().includes(needle) ||
        project.role.toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [query, status, projects]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-2xl text-sm text-unn-muted">
          Projects where your registered name appears as principal investigator or
          co-researcher in the UNN catalogue.
        </p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          disabled={isPending}
          className="rounded-full bg-unn-green px-4 py-2 text-sm font-semibold text-white hover:bg-unn-green-mid disabled:opacity-60"
        >
          Add research
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
          placeholder="Search project, faculty, or ID"
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
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Faculty</th>
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium">Funding</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-unn-green/8">
            {rows.map((project) => (
              <tr key={project.id} className="hover:bg-unn-cream/50">
                <td className="px-4 py-3 font-mono text-xs text-unn-muted">{project.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-unn-ink">{project.title}</p>
                  <p className="text-xs text-unn-muted">{project.department}</p>
                </td>
                <td className="px-4 py-3">{project.role}</td>
                <td className="px-4 py-3 text-unn-muted">{project.faculty}</td>
                <td className="px-4 py-3 text-unn-muted">{project.year}</td>
                <td className="px-4 py-3 text-unn-muted">{project.funding}</td>
                <td className="px-4 py-3">
                  <StatusBadge label={project.status} styles={researchStatusStyles} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-unn-muted">
            No projects match this filter.
          </p>
        ) : null}
      </div>

      <AddResearchModal
        open={adding}
        onClose={() => setAdding(false)}
        defaults={modalDefaults}
        lockPrincipalResearcher
        onCreate={(research) => {
          setError(null);
          startTransition(async () => {
            try {
              const created = await createResearcherResearchAction(research);
              setProjects((current) => [
                {
                  id: created.id,
                  title: created.title,
                  faculty: created.faculty,
                  department: created.unit,
                  role: "Principal",
                  status: created.status,
                  year: created.year,
                  funding: created.funding,
                },
                ...current,
              ]);
              setAdding(false);
            } catch {
              setError("Could not create research. Please try again.");
            }
          });
        }}
      />
    </div>
  );
}
