"use client";

import { useRef, useTransition } from "react";
import { importResearchCsvAction } from "@/app/actions/admin/research-csv";
import { useServiceErrors } from "@/components/use-service-errors";
import { downloadResearchCsvTemplate } from "@/lib/research-csv-shared";
import type { AdminResearchRow } from "@/lib/research-shared";

type ResearchCsvToolbarProps = {
  disabled?: boolean;
  onImported: (projects: AdminResearchRow[]) => void;
};

export function ResearchCsvToolbar({ disabled = false, onImported }: ResearchCsvToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { reportErrors, errorModal } = useServiceErrors();
  const [isPending, startTransition] = useTransition();

  function handleUploadClick() {
    inputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    startTransition(async () => {
      const csvText = await file.text();
      const result = await importResearchCsvAction(csvText);

      if (!result.ok) {
        reportErrors(result.errors);
        return;
      }

      const { created, rowErrors } = result.data;

      if (created.length > 0) {
        onImported(created);
      }

      if (rowErrors.length > 0) {
        reportErrors(
          rowErrors.map((issue) => ({
            label: issue.row > 0 ? `Row ${issue.row}` : "CSV import",
            title: created.length > 0 ? "Some rows were skipped" : "Import failed",
            message: issue.message,
            retryable: false,
          })),
        );
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={downloadResearchCsvTemplate}
        disabled={disabled || isPending}
        className="rounded-full border border-unn-green/20 px-4 py-2 text-sm font-semibold text-unn-green hover:bg-unn-cream disabled:opacity-60"
      >
        Download CSV template
      </button>
      <button
        type="button"
        onClick={handleUploadClick}
        disabled={disabled || isPending}
        className="rounded-full border border-unn-green/20 px-4 py-2 text-sm font-semibold text-unn-green hover:bg-unn-cream disabled:opacity-60"
      >
        {isPending ? "Uploading…" : "Upload research CSV"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileChange}
      />
      {errorModal}
    </>
  );
}
