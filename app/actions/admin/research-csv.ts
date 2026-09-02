"use server";

import { requireStaffSession } from "@/lib/auth/require-staff";
import { parseResearchCsv } from "@/lib/research-csv";
import { createAdminResearch } from "@/lib/research";
import type { AdminResearchRow } from "@/lib/research-shared";
import { runSafeAction } from "@/lib/safe-action";
import { revalidateAdminSections } from "@/lib/revalidate-admin";

export type ImportResearchCsvResult = {
  created: AdminResearchRow[];
  rowErrors: Array<{ row: number; message: string }>;
};

export async function importResearchCsvAction(csvText: string) {
  return runSafeAction("Import research CSV", async () => {
    await requireStaffSession();

    const { rows, errors: parseErrors } = parseResearchCsv(csvText);
    if (rows.length === 0) {
      return {
        created: [],
        rowErrors: parseErrors,
      } satisfies ImportResearchCsvResult;
    }

    const created: AdminResearchRow[] = [];
    const rowErrors = [...parseErrors];

    for (const row of rows) {
      try {
        created.push(await createAdminResearch(row.research));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not create this research project.";
        rowErrors.push({ row: row.rowNumber, message });
      }
    }

    if (created.length > 0) {
      revalidateAdminSections("research");
    }

    return { created, rowErrors } satisfies ImportResearchCsvResult;
  });
}
