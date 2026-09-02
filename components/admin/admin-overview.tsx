import Link from "next/link";
import {
  availabilityStyles,
  researchStatusStyles,
  StatusBadge,
  userStatusStyles,
} from "@/components/admin/status-badge";
import type { AdminOverviewData } from "@/lib/admin-overview";
import { adminPath } from "@/lib/admin-portal-config";

type AdminOverviewProps = {
  data: AdminOverviewData;
  basePath: string;
};

export function AdminOverview({ data, basePath }: AdminOverviewProps) {
  const {
    stats,
    recentResearch,
    recentActivity,
    flaggedEquipment,
    facultyCounts,
    maxFacultyCount,
    pendingUsers,
    recentResearchers,
  } = data;

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm text-unn-muted">
        Nsukka campus snapshot for ORID — research records, lab access, and
        investigator accounts in one place.
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
            <h2 className="font-serif text-xl text-unn-green">Recent catalogue</h2>
            <Link href={adminPath(basePath, "research")} className="text-sm font-medium text-unn-green hover:underline">
              View research
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-unn-muted">
                <tr>
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Project</th>
                  <th className="pb-3 font-medium">Faculty</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-unn-green/8">
                {recentResearch.map((project) => (
                  <tr key={project.id}>
                    <td className="py-3 font-mono text-xs text-unn-muted">{project.id}</td>
                    <td className="py-3">
                      <p className="font-medium text-unn-ink">{project.title}</p>
                      <p className="text-xs text-unn-muted">{project.lead}</p>
                    </td>
                    <td className="py-3 text-unn-muted">{project.faculty}</td>
                    <td className="py-3">
                      <StatusBadge label={project.status} styles={researchStatusStyles} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-unn-green/10">
          <h2 className="font-serif text-xl text-unn-green">Activity</h2>
          <ul className="mt-4 space-y-4">
            {recentActivity.length === 0 ? (
              <li className="text-sm text-unn-muted">No recent activity yet.</li>
            ) : (
              recentActivity.map((item) => (
                <li key={item.id} className="border-l-2 border-unn-gold pl-3">
                  <p className="text-xs text-unn-gold">{item.time}</p>
                  <p className="text-sm text-unn-ink">
                    <span className="font-medium">{item.actor}</span> {item.action}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-unn-green/10">
          <h2 className="font-serif text-xl text-unn-green">By faculty</h2>
          <ul className="mt-4 space-y-3">
            {facultyCounts.length === 0 ? (
              <li className="text-sm text-unn-muted">No research records yet.</li>
            ) : (
              facultyCounts.map((item) => (
                <li key={item.faculty}>
                  <div className="flex justify-between text-sm">
                    <span>{item.faculty}</span>
                    <span className="font-medium text-unn-green">{item.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-unn-green/10">
                    <div
                      className="h-full rounded-full bg-unn-green"
                      style={{ width: `${(item.count / maxFacultyCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-unn-green/10">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-unn-green">Pending staff</h2>
            <Link href={adminPath(basePath, "users")} className="text-sm font-medium text-unn-green hover:underline">
              Review
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {pendingUsers.length === 0 ? (
              <li className="text-sm text-unn-muted">No pending staff accounts.</li>
            ) : (
              pendingUsers.map((person) => (
                <li key={person.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{person.name}</p>
                    <p className="text-xs text-unn-muted">{person.unit}</p>
                  </div>
                  <StatusBadge label={person.status} styles={userStatusStyles} />
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-unn-green/10">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-unn-green">Lab alerts</h2>
            <Link href={adminPath(basePath, "equipments")} className="text-sm font-medium text-unn-green hover:underline">
              Equipment
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {flaggedEquipment.length === 0 ? (
              <li className="text-sm text-unn-muted">All instruments available.</li>
            ) : (
              flaggedEquipment.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-unn-muted">{item.window}</p>
                  </div>
                  <StatusBadge label={item.availability} styles={availabilityStyles} />
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      {recentResearchers.length > 0 ? (
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-unn-green/10">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-unn-green">Recent researchers</h2>
            <Link href={adminPath(basePath, "researchers")} className="text-sm font-medium text-unn-green hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentResearchers.map((person) => (
              <li
                key={person.id}
                className="rounded-xl border border-unn-green/10 px-4 py-3 text-sm"
              >
                <p className="font-medium text-unn-ink">{person.name}</p>
                <p className="text-xs text-unn-muted">{person.faculty}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
