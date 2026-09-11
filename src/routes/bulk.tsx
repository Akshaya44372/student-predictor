import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileSpreadsheet, Search, Trash2, UploadCloud, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { DemoBanner } from "@/components/site/demo-banner";
import { PageHeader } from "@/components/site/page-header";
import { ClassBadge, classTone } from "@/components/site/prediction-result";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/client";
import { REQUIRED_COLUMNS, type BulkPredictionRow } from "@/lib/api/types";
import {
  downloadCsv,
  formatFileSize,
  isAcceptedFile,
  parseStudentFile,
  type ParsedFile,
} from "@/lib/file-parse";

export const Route = createFileRoute("/bulk")({
  head: () => ({
    meta: [
      { title: "Bulk Prediction — Student Performance ML" },
      {
        name: "description",
        content:
          "Upload a CSV or Excel file of student records and predict performance for every student with the trained machine learning model.",
      },
      { property: "og:title", content: "Bulk Prediction — Student Performance ML" },
      {
        property: "og:description",
        content:
          "Upload student records, preview them, run predictions for the whole cohort and download the results.",
      },
    ],
  }),
  component: Bulk,
});

type LoadedFile = {
  file: File;
  parsed: ParsedFile;
};

const CLASS_COLORS: Record<string, string> = {
  High: "var(--high)",
  Medium: "var(--med)",
  Low: "var(--low)",
};

function Bulk() {
  const [loaded, setLoaded] = useState<LoadedFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const [results, setResults] = useState<BulkPredictionRow[] | null>(null);
  const [filter, setFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const predictAll = useMutation({
    mutationFn: (rows: Record<string, string | number>[]) => api.predictBulk(rows),
    onSuccess: (data) => {
      setResults(data.results);
      toast.success(`Predictions ready for ${data.results.length} students.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "The predictions could not be completed. Please try again.");
    },
  });

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (!isAcceptedFile(file)) {
      toast.error("Please choose a CSV, XLSX or XLS file.");
      return;
    }
    try {
      const parsed = await parseStudentFile(file);
      setLoaded({ file, parsed });
      setResults(null);
      if (parsed.missingColumns.length > 0) {
        toast.error(`Missing columns: ${parsed.missingColumns.join(", ")}`);
      } else {
        toast.success(`${parsed.rows.length} records read from ${file.name}.`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "That file could not be read. Please try another.",
      );
    }
  }

  function clearAll() {
    setLoaded(null);
    setResults(null);
    setFilter("All");
    setSearch("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const valid = loaded !== null && loaded.parsed.missingColumns.length === 0;

  const summary = useMemo(() => {
    if (!results) return null;
    const counts = { High: 0, Medium: 0, Low: 0 } as Record<string, number>;
    for (const r of results) counts[r.prediction] = (counts[r.prediction] ?? 0) + 1;
    return counts;
  }, [results]);

  const filtered = useMemo(() => {
    if (!results) return [];
    const q = search.trim().toLowerCase();
    return results.filter((r) => {
      if (filter !== "All" && r.prediction !== filter) return false;
      if (!q) return true;
      return (
        String(r.id).toLowerCase().includes(q) ||
        Object.values(r.input).some((v) => String(v).toLowerCase().includes(q))
      );
    });
  }, [results, filter, search]);

  const chartData = summary
    ? Object.entries(summary).map(([name, value]) => ({ name, value }))
    : [];

  const previewRows = loaded?.parsed.rows.slice(0, 8) ?? [];
  const previewColumns = loaded?.parsed.columns ?? [];

  function handleDownload() {
    if (!results) return;
    downloadCsv(
      "prediction-results.csv",
      results.map((r) => ({
        student_id: r.id,
        ...r.input,
        average_score: r.average_score ?? "",
        predicted_performance: r.prediction,
        confidence:
          r.probabilities?.[r.prediction] !== undefined
            ? (r.probabilities[r.prediction]! * 100).toFixed(1) + "%"
            : "",
        model: r.model ?? "",
      })),
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Batch"
        title="Bulk Prediction"
        description="Upload a cohort of student records and run every one of them through the same trained model and preprocessing pipeline used for single predictions."
      />

      <DemoBanner className="mt-6" />

      <div className="grid gap-6 py-8 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              void handleFiles(e.dataTransfer.files);
            }}
            className={[
              "panel flex flex-col items-center justify-center px-6 py-12 text-center transition-colors",
              dragging ? "border-brand bg-brand/5" : "",
            ].join(" ")}
          >
            <UploadCloud className="size-9 text-brand" />
            <h2 className="mt-4 text-base font-semibold tracking-tight">Upload student dataset</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Drag and drop a CSV or Excel file here, or choose one from your device.
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="sr-only"
              onChange={(e) => void handleFiles(e.target.files)}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-5 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
            >
              Choose file
            </button>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              CSV · XLSX · XLS
            </p>
          </div>

          {loaded ? (
            <div className="panel mt-4 p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <FileSpreadsheet className="size-8 shrink-0 text-brand" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{loaded.file.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {formatFileSize(loaded.file.size)} · {loaded.parsed.rows.length} records
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearAll}
                  aria-label="Remove file"
                  className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
              <p
                className={[
                  "mt-3 rounded-lg border p-3 text-sm",
                  valid
                    ? "border-high/30 bg-high/5"
                    : "border-destructive/30 bg-destructive/5 text-destructive",
                ].join(" ")}
              >
                {valid
                  ? "All required columns were found. This file is ready for prediction."
                  : `These required columns are missing: ${loaded.parsed.missingColumns.join(", ")}.`}
              </p>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!valid || predictAll.isPending}
              onClick={() => loaded && predictAll.mutate(loaded.parsed.rows)}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {predictAll.isPending ? "Predicting…" : "Predict all students"}
            </button>
            <button
              type="button"
              disabled={!results}
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg border border-input px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-40"
            >
              <Download className="size-4" /> Download results
            </button>
            <button
              type="button"
              disabled={!loaded}
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-input px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-40"
            >
              <Trash2 className="size-4" /> Clear
            </button>
          </div>
        </section>

        <section className="panel p-5 sm:p-6 lg:col-span-5">
          <h2 className="text-base font-semibold tracking-tight">Required columns</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Each row must contain the same fields collected on the single prediction page. Headings
            are matched case-insensitively, and spaces or hyphens are treated as underscores.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {REQUIRED_COLUMNS.map((col) => (
              <li
                key={col}
                className="rounded-lg border border-border bg-muted/40 px-3 py-2 font-mono text-xs"
              >
                {col}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {loaded && previewRows.length > 0 ? (
        <section className="panel mb-8 p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-base font-semibold tracking-tight">Uploaded data preview</h2>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
              First {previewRows.length} of {loaded.parsed.rows.length}
            </span>
          </div>
          <div className="mt-5 -mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {previewColumns.map((col) => (
                    <th
                      key={col}
                      className="whitespace-nowrap pb-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      {col.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {previewRows.map((row, i) => (
                  <tr key={i} className="transition-colors hover:bg-accent/60">
                    {previewColumns.map((col) => (
                      <td key={col} className="whitespace-nowrap py-2.5 pr-4">
                        {String(row[col] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {predictAll.isPending ? (
        <section className="panel mb-8 space-y-3 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </section>
      ) : null}

      {results && summary ? (
        <>
          <section className="mb-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            <div className="bg-card p-4">
              <p className="label-mono">Total students</p>
              <p className="mt-1 font-mono text-2xl font-semibold">{results.length}</p>
            </div>
            {(["High", "Medium", "Low"] as const).map((cls) => (
              <div key={cls} className="bg-card p-4">
                <p className="label-mono">{cls}</p>
                <p
                  className={[
                    "mt-1 font-mono text-2xl font-semibold",
                    classTone(cls) === "high"
                      ? "text-high"
                      : classTone(cls) === "med"
                        ? "text-med"
                        : "text-low",
                  ].join(" ")}
                >
                  {summary[cls] ?? 0}
                </p>
              </div>
            ))}
          </section>

          <section className="panel mb-6 p-5 sm:p-6">
            <h2 className="text-base font-semibold tracking-tight">Performance distribution</h2>
            <div className="mt-6 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "var(--popover-foreground)",
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={CLASS_COLORS[entry.name] ?? "var(--chart-5)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="panel mb-10 p-5 sm:p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
              <h2 className="truncate text-base font-semibold tracking-tight">
                Prediction results
              </h2>
              <div className="relative shrink-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  aria-label="Search results"
                  className="w-40 rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(["All", "High", "Medium", "Low"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={[
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    filter === f
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-input hover:bg-accent",
                  ].join(" ")}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="mt-5 -mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Student", "Gender", "Parental education", "Scores", "Average", "Predicted", "Confidence"].map(
                      (h) => (
                        <th
                          key={h}
                          className="whitespace-nowrap pb-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((r) => {
                    const confidence =
                      r.probabilities?.[r.prediction] !== undefined
                        ? `${(r.probabilities[r.prediction]! * 100).toFixed(1)}%`
                        : "—";
                    return (
                      <tr key={String(r.id)} className="transition-colors hover:bg-accent/60">
                        <td className="whitespace-nowrap py-2.5 pr-4 font-mono text-xs">{r.id}</td>
                        <td className="whitespace-nowrap py-2.5 pr-4">
                          {String(r.input["gender"] ?? "—")}
                        </td>
                        <td className="py-2.5 pr-4 text-muted-foreground">
                          {String(r.input["parental_level_of_education"] ?? "—")}
                        </td>
                        <td className="whitespace-nowrap py-2.5 pr-4 font-mono text-xs">
                          {r.input["math_score"]} / {r.input["reading_score"]} /{" "}
                          {r.input["writing_score"]}
                        </td>

                        <td className="whitespace-nowrap py-2.5 pr-4 font-mono">
                          {r.average_score !== undefined ? r.average_score.toFixed(1) : "—"}
                        </td>
                        <td className="whitespace-nowrap py-2.5 pr-4">
                          <ClassBadge label={r.prediction} />
                        </td>
                        <td className="whitespace-nowrap py-2.5 font-mono text-xs text-muted-foreground">
                          {confidence}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No students match this filter.
                </p>
              ) : null}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
