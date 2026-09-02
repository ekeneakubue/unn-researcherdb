import Link from "next/link";
import {
  availabilityStyles,
  researchStatusStyles,
  StatusBadge,
} from "@/components/admin/status-badge";
import type { ResearcherOverviewData } from "@/lib/researcher-dashboard-shared";
import { researcherPath } from "@/lib/researcher-portal-config";

export function ResearcherOverview({ data }: { data: ResearcherOverviewData }) {
  const { stats, recentProjects, custodianEquipment } = data;

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm text-unn-muted">
        Your Nsukka research workspace — projects linked to your profile, shared
        instruments, and lab custodianship in one place.
      </p>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-unn-green/10"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-unn-gold">{stat.label}</p>
            <p className="mt-2 font-serif text-3xl text-unn-green">{stat.value}</p>
            <p className="mt-1 text-xs text-unn-muted">{stat.hint}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-unn-green/10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl text-unn-green">My projects</h2>
            <Link
              href={researcherPath("research")}
              className="text-sm font-medium text-unn-green hover:underline"
            >
              View all
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="mt-4 text-sm text-unn-muted">
              No projects matched your registered name yet. ORID links records by
              investigator name — contact the research office if something is missing.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-unn-muted">
                  <tr>
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-unn-green/8">
                  {recentProjects.map((project) => (
                    <tr key={project.id}>
                      <td className="py-3 font-mono text-xs text-unn-muted">{project.id}</td>
                      <td className="py-3">
                        <p className="font-medium text-unn-ink">{project.title}</p>
                        <p className="text-xs text-unn-muted">{project.faculty}</p>
                      </td>
                      <td className="py-3 text-unn-muted">{project.role}</td>
                      <td className="py-3">
                        <StatusBadge label={project.status} styles={researchStatusStyles} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-unn-green/10">
          <h2 className="font-serif text-xl text-unn-green">Quick links</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link
                href={researcherPath("equipment")}
                className="block rounded-xl border border-unn-green/10 px-4 py-3 hover:bg-unn-cream/60"
              >
                <p className="font-medium text-unn-ink">Browse equipment</p>
                <p className="mt-1 text-xs text-unn-muted">
                  {data.availableEquipmentCount} instruments available now
                </p>
              </Link>
            </li>
            <li>
              <Link
                href={researcherPath("profile")}
                className="block rounded-xl border border-unn-green/10 px-4 py-3 hover:bg-unn-cream/60"
              >
                <p className="font-medium text-unn-ink">Profile & credentials</p>
                <p className="mt-1 text-xs text-unn-muted">View your ORID researcher ID</p>
              </Link>
            </li>
            <li>
              <Link
                href="/#join"
                className="block rounded-xl border border-unn-green/10 px-4 py-3 hover:bg-unn-cream/60"
              >
                <p className="font-medium text-unn-ink">Invite a collaborator</p>
                <p className="mt-1 text-xs text-unn-muted">Share the portal signup link</p>
              </Link>
            </li>
          </ul>
        </section>
      </div>

      {custodianEquipment.length > 0 ? (
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-unn-green/10">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-unn-green">Labs you custodian</h2>
            <Link
              href={researcherPath("equipment")}
              className="text-sm font-medium text-unn-green hover:underline"
            >
              Equipment
            </Link>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {custodianEquipment.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-unn-green/10 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-unn-ink">{item.name}</p>
                  <p className="text-xs text-unn-muted">{item.lab}</p>
                </div>
                <StatusBadge label={item.availability} styles={availabilityStyles} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
