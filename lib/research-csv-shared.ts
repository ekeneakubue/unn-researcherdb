import type { NewResearch } from "@/lib/research-shared";

export const RESEARCH_CSV_COLUMNS = [
  "title",
  "abstract",
  "start_date",
  "end_date",
  "principal_researcher",
  "principal_researcher_email",
  "co_researchers",
  "collaborators",
  "research_area",
  "faculty",
  "department",
  "research_output",
  "funding",
  "equipment_name",
  "equipment_model",
  "equipment_make",
  "equipment_location",
  "equipment_condition",
] as const;

export type ResearchCsvColumn = (typeof RESEARCH_CSV_COLUMNS)[number];

export const RESEARCH_OUTPUT_OPTIONS = [
  "Articles",
  "Papers",
  "Journal",
  "Patents/Innovation",
] as const;

export const EQUIPMENT_CONDITION_OPTIONS = [
  "Available",
  "In-use",
  "Under-repair",
  "Damaged",
] as const;

const MONTH_NAMES: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

export const RESEARCH_CSV_DATE_HINT =
  "YYYY-MM-DD, DD/MM/YYYY, or 15 Jan 2026";

function toIsoDateParts(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const iso = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const date = new Date(`${iso}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) return null;
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return iso;
}

/** Normalizes common CSV date formats to YYYY-MM-DD for storage. */
export function parseCsvDate(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return toIsoDateParts(
      Number(trimmed.slice(0, 4)),
      Number(trimmed.slice(5, 7)),
      Number(trimmed.slice(8, 10)),
    );
  }

  const dmy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) {
    return toIsoDateParts(Number(dmy[3]), Number(dmy[2]), Number(dmy[1]));
  }

  const longForm = trimmed.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (longForm) {
    const month = MONTH_NAMES[longForm[2].toLowerCase()];
    if (month) {
      return toIsoDateParts(Number(longForm[3]), month, Number(longForm[1]));
    }
  }

  return null;
}

/** Formats a YYYY-MM-DD value using the portal display style. */
export function formatCsvTemplateDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Semicolon-separated entries; each entry is `Name` or `Name|email@example.com`. */
export function parsePeopleField(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return [];

  return trimmed
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [name, email = ""] = entry.split("|").map((part) => part.trim());
      return { name, email };
    })
    .filter((person) => person.name);
}

export function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildResearchCsvTemplate(): string {
  const header = RESEARCH_CSV_COLUMNS.join(",");
  const example = [
    "Climate-smart cassava for the derived savanna",
    "Field trials and genomic selection for drought-tolerant cassava varieties.",
    formatCsvTemplateDate("2026-01-15"),
    formatCsvTemplateDate("2028-12-31"),
    "Prof. Ngozi Eze",
    "principal@unn.edu.ng",
    "Dr. Chinedu Okeke|co.researcher@unn.edu.ng",
    "External Partner|collaborator@example.com",
    "Crop genetics",
    "Faculty of Agriculture",
    "Dept. of Crop Science",
    "Journal",
    "TETFund NRF",
    "Scanning Electron Microscope",
    "JSM-IT500",
    "JEOL",
    "Central Research Laboratory",
    "Available",
  ].map(escapeCsvCell);

  return `${header}\n${example.join(",")}\n`;
}

export function downloadResearchCsvTemplate() {
  const blob = new Blob([buildResearchCsvTemplate()], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "unn-research-import-template.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export type ParsedResearchCsvRow = {
  rowNumber: number;
  research: NewResearch;
};

export type ResearchCsvRowError = {
  row: number;
  message: string;
};
