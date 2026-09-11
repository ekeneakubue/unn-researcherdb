"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { updateResearcherPhotoAction } from "@/app/actions/researcher/profile";
import { researcherStatusStyles, StatusBadge } from "@/components/admin/status-badge";
import { useServiceErrors } from "@/components/use-service-errors";
import type { ResearcherProfile } from "@/lib/researcher-dashboard-shared";

export function ResearcherProfilePanel({ profile }: { profile: ResearcherProfile }) {
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl);
  const { reportErrors, errorModal } = useServiceErrors();
  const [isPending, startTransition] = useTransition();

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    startTransition(async () => {
      const result = await updateResearcherPhotoAction(file);
      if (!result.ok) {
        reportErrors(result.errors);
        return;
      }
      setPhotoUrl(result.data.photoUrl);
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p className="text-sm text-unn-muted">
        Your UNN researcher portal identity. Contact ORID to update your faculty or
        correct catalogue name matching.
      </p>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-unn-green/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={profile.name}
                width={72}
                height={72}
                className="h-16 w-16 rounded-full object-cover ring-1 ring-unn-green/15"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-unn-cream text-lg font-semibold text-unn-green ring-1 ring-unn-green/15">
                {profile.name
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase() ?? "")
                  .join("")}
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-unn-gold">Researcher ID</p>
              <p className="mt-2 font-mono text-lg text-unn-green">{profile.id}</p>
            </div>
          </div>
          <StatusBadge label={profile.status} styles={researcherStatusStyles} />
        </div>

        <label className="mt-5 block text-sm">
          Profile photo
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={handlePhotoChange}
            disabled={isPending}
            className="mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-unn-cream file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-unn-green focus:border-unn-gold disabled:opacity-60"
          />
          <span className="mt-1 block text-xs text-unn-muted">
            JPG/PNG/WebP up to 5MB. Stored publicly in Cloudflare R2.
            {isPending ? " Uploading…" : ""}
          </span>
        </label>

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
            <dt className="text-xs uppercase tracking-wider text-unn-muted">Department</dt>
            <dd className="mt-1 text-sm text-unn-ink">{profile.department || "—"}</dd>
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
      {errorModal}
    </div>
  );
}
