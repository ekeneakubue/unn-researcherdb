"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  equipmentAvailabilityOptions,
  equipmentConditionOptions,
  type EquipmentAvailabilityLabel,
  type EquipmentConditionLabel,
  type UpdateResearcherEquipmentInput,
} from "@/lib/equipment-shared";
import type { ResearcherEquipmentRow } from "@/lib/researcher-dashboard-shared";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 bg-white px-3 text-sm outline-none focus:border-unn-gold";

function toForm(item: ResearcherEquipmentRow): UpdateResearcherEquipmentInput {
  return {
    name: item.name,
    model: item.model,
    make: item.make,
    lab: item.lab === "Campus laboratory" ? "" : item.lab,
    location: item.location === "University of Nigeria, Nsukka" ? "" : item.location,
    availability: item.availability as EquipmentAvailabilityLabel,
    availabilityNote: item.availabilityNote,
    condition: item.condition as EquipmentConditionLabel,
  };
}

type EditEquipmentModalProps = {
  open: boolean;
  item: ResearcherEquipmentRow | null;
  onClose: () => void;
  onSave: (input: UpdateResearcherEquipmentInput) => void;
  saving?: boolean;
};

export function EditEquipmentModal({
  open,
  item,
  onClose,
  onSave,
  saving = false,
}: EditEquipmentModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [form, setForm] = useState<UpdateResearcherEquipmentInput | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && item) {
      setForm(toForm(item));
      if (!dialog.open) dialog.showModal();
    } else {
      setForm(null);
      if (dialog.open) dialog.close();
    }
  }, [open, item]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    onSave(form);
  }

  if (!form) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto max-h-[min(90vh,48rem)] w-[min(36rem,calc(100vw-2rem))] flex-col rounded-2xl border-0 bg-white p-0 text-unn-ink shadow-xl open:flex backdrop:bg-unn-ink/40"
    >
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-6 sm:px-8">
          <div>
            <h2 id={titleId} className="font-serif text-2xl text-unn-green">
              Edit equipment
            </h2>
            <p className="mt-1 text-sm text-unn-muted">
              Update instrument details for {item?.id}.
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              Equipment name
              <input
                required
                value={form.name}
                onChange={(event) => setForm((current) => current && { ...current, name: event.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              Model
              <input
                value={form.model}
                onChange={(event) => setForm((current) => current && { ...current, model: event.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              Make
              <input
                value={form.make}
                onChange={(event) => setForm((current) => current && { ...current, make: event.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-sm">
              Lab
              <input
                value={form.lab}
                onChange={(event) => setForm((current) => current && { ...current, lab: event.target.value })}
                className={inputClass}
                placeholder="Central Research Laboratory"
              />
            </label>
            <label className="block text-sm">
              Location
              <input
                value={form.location}
                onChange={(event) =>
                  setForm((current) => current && { ...current, location: event.target.value })
                }
                className={inputClass}
                placeholder="Faculty of Physical Sciences"
              />
            </label>
            <label className="block text-sm">
              Availability
              <select
                required
                value={form.availability}
                onChange={(event) =>
                  setForm(
                    (current) =>
                      current && {
                        ...current,
                        availability: event.target.value as EquipmentAvailabilityLabel,
                      },
                  )
                }
                className={inputClass}
              >
                {equipmentAvailabilityOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Condition
              <select
                required
                value={form.condition}
                onChange={(event) =>
                  setForm(
                    (current) =>
                      current && {
                        ...current,
                        condition: event.target.value as EquipmentConditionLabel,
                      },
                  )
                }
                className={inputClass}
              >
                {equipmentConditionOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              Availability note
              <input
                value={form.availabilityNote}
                onChange={(event) =>
                  setForm(
                    (current) => current && { ...current, availabilityNote: event.target.value },
                  )
                }
                className={inputClass}
                placeholder="Next slot: today, 14:00"
              />
            </label>
          </div>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-unn-green/10 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-11 rounded-full px-5 text-sm font-semibold text-unn-green hover:bg-unn-cream disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-11 rounded-full bg-unn-green px-5 text-sm font-semibold text-white hover:bg-unn-green-mid disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </dialog>
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
