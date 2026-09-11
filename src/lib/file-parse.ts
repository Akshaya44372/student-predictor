import { REQUIRED_COLUMNS } from "@/lib/api/types";

export type ParsedFile = {
  rows: Record<string, string | number>[];
  columns: string[];
  missingColumns: string[];
};

const NUMERIC_COLUMNS = ["math_score", "reading_score", "writing_score"];

/** Normalises header text: "Math Score" / "math-score" -> "math_score". */
function normaliseKey(key: string): string {
  const k = key.trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (k === "race/ethnicity" || k === "race_ethnicity" || k === "race") return "race_ethnicity";
  if (k === "parental_level_of_education" || k === "parental_education")
    return "parental_level_of_education";
  return k;
}

export const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls"];

export function isAcceptedFile(file: File): boolean {
  return ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
}

export async function parseStudentFile(file: File): Promise<ParsedFile> {
  if (!isAcceptedFile(file)) {
    throw new Error("Only CSV, XLSX and XLS files can be read. Please choose a different file.");
  }

  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();

  let raw: Record<string, unknown>[];
  try {
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error("empty");
    raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], {
      defval: "",
    });
  } catch {
    throw new Error("That file could not be read. Please check it opens correctly and try again.");
  }

  if (raw.length === 0) {
    throw new Error("That file has no student rows in it.");
  }

  const rows = raw.map((row) => {
    const out: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(row)) {
      const k = normaliseKey(key);
      if (NUMERIC_COLUMNS.includes(k)) {
        const n = Number(value);
        out[k] = Number.isFinite(n) ? n : NaN;
      } else {
        out[k] = String(value ?? "").trim();
      }
    }
    return out;
  });

  const columns = Object.keys(rows[0]);
  const missingColumns = REQUIRED_COLUMNS.filter((c) => !columns.includes(c));

  return { rows, columns, missingColumns };
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\n");
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
