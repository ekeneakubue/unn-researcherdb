"use client";

import { useMemo, useState } from "react";
import type { HomeResearchProject } from "@/lib/home-shared";

type ResearchCardsProps = {
  projects: HomeResearchProject[];
};

export function ResearchCards({ projects }: ResearchCardsProps) {
  const faculties = useMemo(() => {
    const unique = [...new Set(projects.map((project) => project.faculty))].sort();
    return ["All", ...unique];
  }, [projects]);

  const [faculty, setFaculty] = useState("All");

  const visible = useMemo(
    () =>
      faculty === "All"
        ? projects
        : projects.filter((project) => project.faculty === faculty),
    [faculty, projects],
  );

  return (
    <section id="research" className="scroll-mt-32 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-unn-gold">
              Featured Research
            </p>
            <h2 className="mt-2 font-serif text-3xl text-unn-green sm:text-4xl">
              Work that starts on this campus
            </h2>
            <p className="mt-3 text-unn-muted">
              A catalogue of research projects, theses, and collaborations
              — Spanning across all Faculties, Departments, Institutes and Centres.
            </p>
          </div>
          {faculties.length > 1 ? (
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by faculty">
              {faculties.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={faculty === item}
                  onClick={() => setFaculty(item)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    faculty === item
                      ? "bg-unn-green text-white"
                      : "bg-white text-unn-ink ring-1 ring-unn-green/15 hover:bg-unn-green/8"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {projects.length === 0 ? (
          <p className="mt-10 text-center text-sm text-unn-muted">
            No research projects have been published yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-unn-green/10 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-unn-green/8 px-3 py-1 text-xs font-semibold text-unn-green">
                    {project.faculty}
                  </span>
                  <span className="rounded-full bg-unn-green/8 px-2 py-0.5 text-xs text-unn-green">
                    {project.status}
                  </span>
                </div>
                <p className="mt-4 text-xs text-unn-muted">{project.year}</p>
                <h3 className="mt-2 font-serif text-xl leading-snug text-unn-ink">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-unn-muted">
                  {project.summary}
                </p>
                <p className="mt-4 text-sm font-medium text-unn-green">
                  {project.lead}
                  <span className="block font-normal text-unn-muted">
                    {project.unit}
                  </span>
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
