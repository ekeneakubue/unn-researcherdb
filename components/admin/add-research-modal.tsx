"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { NewResearch } from "@/lib/research-shared";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 bg-white px-3 text-sm outline-none focus:border-unn-gold";

const researchOutputs = ["Articles", "Papers", "Journal", "Patents/Innovation"] as const;

const equipmentConditions = ["Available", "In-use", "Under-repair", "Damaged"] as const;

type PersonEntry = { id: string; name: string; email: string };

function newPersonEntry(): PersonEntry {
  return { id: crypto.randomUUID(), name: "", email: "" };
}

function emptyForm(defaults?: {
  principalResearcher?: string;
  principalResearcherEmail?: string;
  faculty?: string;
}) {
  return {
    title: "",
    abstract: "",
    startDate: "",
    endDate: "",
    principalResearcher: defaults?.principalResearcher ?? "",
    principalResearcherEmail: defaults?.principalResearcherEmail ?? "",
    coResearchers: [{ id: "co-researcher-0", name: "", email: "" }],
    collaborators: [{ id: "collaborator-0", name: "", email: "" }],
    researchArea: "",
    faculty: defaults?.faculty ?? "",
    department: "",
    researchOutput: "Articles" as (typeof researchOutputs)[number],
    funding: "",
    equipmentName: "",
    model: "",
    make: "",
    location: "",
    condition: "Available" as (typeof equipmentConditions)[number],
  };
}

type AddResearchModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (research: NewResearch) => void;
  defaults?: {
    principalResearcher?: string;
    principalResearcherEmail?: string;
    faculty?: string;
  };
  lockPrincipalResearcher?: boolean;
};

export function AddResearchModal({
  open,
  onClose,
  onCreate,
  defaults,
  lockPrincipalResearcher = false,
}: AddResearchModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [form, setForm] = useState(() => emptyForm(defaults));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        setForm(emptyForm(defaults));
        dialog.showModal();
      }
    } else {
      setForm(emptyForm(defaults));
      if (dialog.open) dialog.close();
    }
  }, [open, defaults]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCreate({
      title: form.title.trim(),
      abstract: form.abstract.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      principalResearcher: form.principalResearcher.trim(),
      principalResearcherEmail: form.principalResearcherEmail.trim(),
      coResearchers: form.coResearchers
        .map((entry) => ({
          name: entry.name.trim(),
          email: entry.email.trim(),
        }))
        .filter((entry) => entry.name),
      collaborators: form.collaborators
        .map((entry) => ({
          name: entry.name.trim(),
          email: entry.email.trim(),
        }))
        .filter((entry) => entry.name),
      researchArea: form.researchArea.trim(),
      faculty: form.faculty.trim(),
      department: form.department.trim(),
      researchOutput: form.researchOutput,
      funding: form.funding.trim(),
      equipment: {
        name: form.equipmentName.trim(),
        model: form.model.trim(),
        make: form.make.trim(),
        location: form.location.trim(),
        condition: form.condition,
      },
    });
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto max-h-[min(90vh,56rem)] w-[min(44rem,calc(100vw-2rem))] flex-col rounded-2xl border-0 bg-white p-0 text-unn-ink shadow-xl open:flex backdrop:bg-unn-ink/40"
    >
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 sm:px-8">
          <div>
            <h2 id={titleId} className="font-serif text-2xl text-unn-green">
              Add new research
            </h2>
            <p className="mt-1 text-sm text-unn-muted">
              Record a campus project, its investigators, and the equipment it uses.
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

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <section className="space-y-4">
            <h3 className="font-serif text-xl text-unn-green">Research Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                Research Title
                <input
                  required
                  autoFocus
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  className={inputClass}
                  placeholder="Climate-smart cassava for the derived savanna"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                Abstract
                <textarea
                  required
                  rows={4}
                  value={form.abstract}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, abstract: event.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-unn-green/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-unn-gold"
                  placeholder="Summarise aims, methods, and expected outcomes"
                />
              </label>
              <label className="block text-sm">
                Start date
                <input
                  required
                  type="date"
                  value={form.startDate}
                  max={form.endDate || undefined}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, startDate: event.target.value }))
                  }
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                End date
                <input
                  required
                  type="date"
                  value={form.endDate}
                  min={form.startDate || undefined}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, endDate: event.target.value }))
                  }
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                Principal Researcher
                <input
                  required
                  readOnly={lockPrincipalResearcher}
                  value={form.principalResearcher}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, principalResearcher: event.target.value }))
                  }
                  className={`${inputClass}${lockPrincipalResearcher ? " bg-unn-cream/80" : ""}`}
                  placeholder="Prof. Ngozi Eze"
                />
              </label>
              <label className="block text-sm">
                Principal researcher email
                <input
                  required
                  type="email"
                  readOnly={lockPrincipalResearcher}
                  value={form.principalResearcherEmail}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      principalResearcherEmail: event.target.value,
                    }))
                  }
                  className={`${inputClass}${lockPrincipalResearcher ? " bg-unn-cream/80" : ""}`}
                  placeholder="principal@unn.edu.ng"
                />
              </label>
              <RepeatablePeople
                label="Co-researcher"
                namePlaceholder="Dr. Chinedu Okeke"
                emailPlaceholder="co.researcher@unn.edu.ng"
                entries={form.coResearchers}
                onChange={(coResearchers) => setForm((current) => ({ ...current, coResearchers }))}
              />
              <RepeatablePeople
                label="Collaborators"
                namePlaceholder="External or faculty collaborator"
                emailPlaceholder="collaborator@example.com"
                entries={form.collaborators}
                onChange={(collaborators) => setForm((current) => ({ ...current, collaborators }))}
              />
              <label className="block text-sm">
                Research Area
                <input
                  required
                  value={form.researchArea}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, researchArea: event.target.value }))
                  }
                  className={inputClass}
                  placeholder="Crop genetics"
                />
              </label>
              <label className="block text-sm">
                Faculty/Center/Institute
                <input
                  required
                  value={form.faculty}
                  onChange={(event) => setForm((current) => ({ ...current, faculty: event.target.value }))}
                  className={inputClass}
                  placeholder="Faculty of Agriculture"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                Department
                <input
                  required
                  value={form.department}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, department: event.target.value }))
                  }
                  className={inputClass}
                  placeholder="Dept. of Crop Science"
                />
              </label>
              <label className="block text-sm">
                Research Output
                <select
                  required
                  value={form.researchOutput}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      researchOutput: event.target.value as (typeof researchOutputs)[number],
                    }))
                  }
                  className={inputClass}
                >
                  {researchOutputs.map((output) => (
                    <option key={output}>{output}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                Research Funding
                <input
                  required
                  value={form.funding}
                  onChange={(event) => setForm((current) => ({ ...current, funding: event.target.value }))}
                  className={inputClass}
                  placeholder="TETFund NRF"
                />
              </label>
            </div>
          </section>

          <section className="mt-8 space-y-4 border-t border-unn-green/10 pt-6">
            <h3 className="font-serif text-xl text-unn-green">Research Equipment</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                Equipment Name
                <input
                  required
                  value={form.equipmentName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, equipmentName: event.target.value }))
                  }
                  className={inputClass}
                  placeholder="Scanning Electron Microscope"
                />
              </label>
              <label className="block text-sm">
                Model
                <input
                  value={form.model}
                  onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
                  className={inputClass}
                  placeholder="JSM-IT500"
                />
              </label>
              <label className="block text-sm">
                Make
                <input
                  value={form.make}
                  onChange={(event) => setForm((current) => ({ ...current, make: event.target.value }))}
                  className={inputClass}
                  placeholder="JEOL"
                />
              </label>
              <label className="block text-sm">
                Location/Ownership
                <input
                  value={form.location}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, location: event.target.value }))
                  }
                  className={inputClass}
                  placeholder="Central Research Laboratory"
                />
              </label>
              <label className="block text-sm">
                Condition
                <select
                  value={form.condition}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      condition: event.target.value as (typeof equipmentConditions)[number],
                    }))
                  }
                  className={inputClass}
                >
                  {equipmentConditions.map((condition) => (
                    <option key={condition}>{condition}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-unn-green/10 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
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
            Create research
          </button>
        </div>
      </form>
    </dialog>
  );
}

function RepeatablePeople({
  label,
  namePlaceholder,
  emailPlaceholder,
  entries,
  onChange,
}: {
  label: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  entries: PersonEntry[];
  onChange: (entries: PersonEntry[]) => void;
}) {
  return (
    <div className="sm:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm">{label}</p>
        <button
          type="button"
          onClick={() => onChange([...entries, newPersonEntry()])}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-unn-green text-white hover:bg-unn-green-mid"
          aria-label={`Add ${label.toLowerCase()}`}
        >
          <PlusIcon />
        </button>
      </div>
      <div className="mt-1.5 space-y-2">
        {entries.map((entry, index) => (
          <div key={entry.id} className="flex flex-col gap-2 sm:flex-row">
            <input
              value={entry.name}
              onChange={(event) =>
                onChange(
                  entries.map((item) =>
                    item.id === entry.id ? { ...item, name: event.target.value } : item,
                  ),
                )
              }
              className="h-11 min-w-0 flex-1 rounded-xl border border-unn-green/15 bg-white px-3 text-sm outline-none focus:border-unn-gold"
              placeholder={namePlaceholder}
              aria-label={`${label} name ${index + 1}`}
            />
            <div className="flex min-w-0 flex-1 gap-2">
              <input
                type="email"
                value={entry.email}
                onChange={(event) =>
                  onChange(
                    entries.map((item) =>
                      item.id === entry.id ? { ...item, email: event.target.value } : item,
                    ),
                  )
                }
                className="h-11 min-w-0 flex-1 rounded-xl border border-unn-green/15 bg-white px-3 text-sm outline-none focus:border-unn-gold"
                placeholder={emailPlaceholder}
                aria-label={`${label} email ${index + 1}`}
              />
              {entries.length > 1 ? (
                <button
                  type="button"
                  onClick={() => onChange(entries.filter((item) => item.id !== entry.id))}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-unn-muted hover:bg-unn-cream hover:text-unn-ink"
                  aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
                >
                  <CloseIcon />
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
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

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
