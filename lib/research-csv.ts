import "server-only";

import {
  EQUIPMENT_CONDITION_OPTIONS,
  parseCsvDate,
  parsePeopleField,
  RESEARCH_CSV_COLUMNS,
  RESEARCH_CSV_DATE_HINT,
  RESEARCH_OUTPUT_OPTIONS,
  type ParsedResearchCsvRow,
  type ResearchCsvRowError,
} from "@/lib/research-csv-shared";
import type { NewResearch } from "@/lib/research-shared";

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }

    if (char === "\n" || char === "\r") {
      if (char === "\r" && text[index + 1] === "\n") {
        index += 1;
      }
      row.push(cell);
      if (row.some((value) => value.trim())) {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  if (row.some((value) => value.trim())) {
    rows.push(row);
  }

  return rows;
}

function rowToRecord(headers: string[], values: string[]): Record<string, string> {
  const record: Record<string, string> = {};
  headers.forEach((header, index) => {
    record[header] = values[index]?.trim() ?? "";
  });
  return record;
}

function parseResearchRow(
  rowNumber: number,
  record: Record<string, string>,
): { research?: NewResearch; error?: string } {
  const required: Array<[ResearchCsvColumnKey, string]> = [
    ["title", "title"],
    ["abstract", "abstract"],
    ["start_date", "start date"],
    ["end_date", "end date"],
    ["principal_researcher", "principal researcher"],
    ["principal_researcher_email", "principal researcher email"],
    ["research_area", "research area"],
    ["faculty", "faculty"],
    ["department", "department"],
    ["research_output", "research output"],
    ["funding", "funding"],
    ["equipment_name", "equipment name"],
  ];

  for (const [key, label] of required) {
    if (!record[key]?.trim()) {
      return { error: `Missing ${label}.` };
    }
  }

  const startDate = parseCsvDate(record.start_date);
  const endDate = parseCsvDate(record.end_date);

  if (!startDate) {
    return { error: `start_date must be a valid date (${RESEARCH_CSV_DATE_HINT}).` };
  }

  if (!endDate) {
    return { error: `end_date must be a valid date (${RESEARCH_CSV_DATE_HINT}).` };
  }

  if (startDate > endDate) {
    return { error: "start_date must be on or before end_date." };
  }

  const researchOutput = record.research_output.trim();
  if (!RESEARCH_OUTPUT_OPTIONS.includes(researchOutput as (typeof RESEARCH_OUTPUT_OPTIONS)[number])) {
    return {
      error: `research_output must be one of: ${RESEARCH_OUTPUT_OPTIONS.join(", ")}.`,
    };
  }

  const equipmentCondition = (record.equipment_condition.trim() || "Available") as
    (typeof EQUIPMENT_CONDITION_OPTIONS)[number];

  if (!EQUIPMENT_CONDITION_OPTIONS.includes(equipmentCondition)) {
    return {
      error: `equipment_condition must be one of: ${EQUIPMENT_CONDITION_OPTIONS.join(", ")}.`,
    };
  }

  return {
    research: {
      title: record.title.trim(),
      abstract: record.abstract.trim(),
      startDate,
      endDate,
      principalResearcher: record.principal_researcher.trim(),
      principalResearcherEmail: record.principal_researcher_email.trim(),
      coResearchers: parsePeopleField(record.co_researchers),
      collaborators: parsePeopleField(record.collaborators),
      researchArea: record.research_area.trim(),
      faculty: record.faculty.trim(),
      department: record.department.trim(),
      researchOutput: researchOutput as NewResearch["researchOutput"],
      funding: record.funding.trim(),
      equipment: {
        name: record.equipment_name.trim(),
        model: record.equipment_model.trim(),
        make: record.equipment_make.trim(),
        location: record.equipment_location.trim(),
        condition: equipmentCondition,
      },
    },
  };
}

type ResearchCsvColumnKey = (typeof RESEARCH_CSV_COLUMNS)[number];

export function parseResearchCsv(text: string): {
  rows: ParsedResearchCsvRow[];
  errors: ResearchCsvRowError[];
} {
  const cleaned = text.replace(/^\uFEFF/, "").trim();
  if (!cleaned) {
    return { rows: [], errors: [{ row: 0, message: "The CSV file is empty." }] };
  }

  const table = parseCsv(cleaned);
  if (table.length === 0) {
    return { rows: [], errors: [{ row: 0, message: "The CSV file is empty." }] };
  }

  const headers = table[0].map(normalizeHeader);
  const missingColumns = RESEARCH_CSV_COLUMNS.filter((column) => !headers.includes(column));

  if (missingColumns.length > 0) {
    return {
      rows: [],
      errors: [
        {
          row: 1,
          message: `Missing required columns: ${missingColumns.join(", ")}.`,
        },
      ],
    };
  }

  const rows: ParsedResearchCsvRow[] = [];
  const errors: ResearchCsvRowError[] = [];

  table.slice(1).forEach((values, index) => {
    const rowNumber = index + 2;
    const record = rowToRecord(headers, values);

    if (RESEARCH_CSV_COLUMNS.every((column) => !record[column]?.trim())) {
      return;
    }

    const parsed = parseResearchRow(rowNumber, record);
    if (parsed.error) {
      errors.push({ row: rowNumber, message: parsed.error });
      return;
    }

    if (parsed.research) {
      rows.push({ rowNumber, research: parsed.research });
    }
  });

  if (rows.length === 0 && errors.length === 0) {
    errors.push({ row: 0, message: "No data rows found in the CSV file." });
  }

  return { rows, errors };
}
