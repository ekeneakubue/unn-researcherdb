import { researcherStatusStyles, StatusBadge } from "@/components/admin/status-badge";
import type { ResearcherProfile } from "@/lib/researcher-dashboard-shared";

export function ResearcherProfilePanel({ profile }: { profile: ResearcherProfile }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p className="text-sm text-unn-muted">
        Your UNN researcher portal identity. Contact ORID to update your faculty or
        correct catalogue name matching.
      </p>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-unn-green/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-unn-gold">Researcher ID</p>
            <p className="mt-2 font-mono text-lg text-unn-green">{profile.id}</p>
          </div>
          <StatusBadge label={profile.status} styles={researcherStatusStyles} />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-unn-muted">Full name</dt>
            <dd className="mt-1 text-sm font-medium text-unn-ink">{profile.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-unn-muted">UNN email</dt>
            <dd className="mt-1 text-sm text-unn-ink">{profile.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-unn-muted">Faculty</dt>
            <dd className="mt-1 text-sm text-unn-ink">{profile.faculty}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-unn-muted">Member since</dt>
            <dd className="mt-1 text-sm text-unn-ink">{profile.memberSince}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-unn-green/10 bg-unn-cream/40 p-5 text-sm text-unn-muted">
        <p className="font-medium text-unn-ink">How projects are linked</p>
        <p className="mt-2">
          The dashboard matches research records to your registered name. If a project
          is missing, ask ORID to add you as principal investigator or co-researcher on
          the official record.
        </p>
      </section>
    </div>
  );
}
