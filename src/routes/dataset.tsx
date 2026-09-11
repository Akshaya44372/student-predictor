import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DemoBanner } from "@/components/site/demo-banner";
import { PageHeader } from "@/components/site/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/client";
import { CATEGORICAL_FEATURES, SCORE_FEATURES } from "@/lib/api/types";
import { PROJECT } from "@/lib/research";

export const Route = createFileRoute("/dataset")({
  head: () => ({
    meta: [
      { title: "Dataset — Student Performance ML" },
      {
        name: "description",
        content:
          "Overview of the student academic, demographic and socioeconomic dataset used for performance prediction: records, features, preprocessing and class definitions.",
      },
      { property: "og:title", content: "Dataset — Student Performance ML" },
      {
        property: "og:description",
        content:
          "Records, features, preprocessing steps and performance classes of the student performance dataset.",
      },
    ],
  }),
  component: DatasetPage,
});

const FEATURE_DESCRIPTIONS = [
  ...CATEGORICAL_FEATURES.map((f) => ({
    name: f.key,
    label: f.label,
    type: "Categorical",
    desc: f.hint,
  })),
  ...SCORE_FEATURES.map((f) => ({
    name: f.key,
    label: f.label,
    type: "Numerical",
    desc: f.hint,
  })),
  {
    name: "average_score",
    label: "Average Score",
    type: "Engineered",
    desc: "Mean of the math, reading and writing scores, derived during feature engineering.",
  },
];

function DatasetPage() {
  const dataset = useQuery({ queryKey: ["dataset"], queryFn: () => api.dataset() });

  const preview = dataset.data?.preview ?? [];
  const columns = Object.keys(preview[0] ?? {});

  const scoreChartData = preview.map((row, i) => ({
    label: `#${i + 1}`,
    math: Number(row["math_score"]),
    reading: Number(row["reading_score"]),
    writing: Number(row["writing_score"]),
  }));

  const classData = dataset.data?.class_distribution
    ? Object.entries(dataset.data.class_distribution).map(([name, value]) => ({ name, value }))
    : null;

  const CLASS_COLORS: Record<string, string> = {
    High: "var(--high)",
    Medium: "var(--med)",
    Low: "var(--low)",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Data"
        title="Dataset"
        description="The dataset contains student academic, demographic and socioeconomic information used for student performance prediction."
      />

      <DemoBanner className="mt-6" />

      <section className="grid gap-px overflow-hidden rounded-xl border border-border bg-border py-0 sm:grid-cols-3 lg:grid-cols-5 mt-8">
        {[
          { label: "Records", value: String(dataset.data?.records ?? PROJECT.records) },
          { label: "Features", value: String(dataset.data?.features ?? PROJECT.features) },
          {
            label: "Numerical features",
            value: String(dataset.data?.numerical_features.length ?? 4),
          },
          {
            label: "Categorical features",
            value: String(dataset.data?.categorical_features.length ?? 5),
          },
          { label: "Performance classes", value: "High · Med · Low", small: true },
        ].map((card) => (
          <div key={card.label} className="bg-card p-4">
            <p className="label-mono">{card.label}</p>
            <p className={["mt-1 font-semibold", card.small ? "text-sm leading-8" : "text-2xl"].join(" ")}>
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 py-8 lg:grid-cols-12">
        <section className="panel p-5 sm:p-6 lg:col-span-7">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-base font-semibold tracking-tight">Dataset preview</h2>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
              {preview.length} sample rows
            </span>
          </div>
          {dataset.isPending ? (
            <div className="mt-5 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : dataset.isError ? (
            <p className="mt-4 text-sm text-destructive">
              The dataset could not be loaded from the service right now.
            </p>
          ) : (
            <div className="mt-5 -mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {columns.map((col) => (
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
                  {preview.map((row, i) => (
                    <tr key={i} className="transition-colors hover:bg-accent/60">
                      {columns.map((col) => (
                        <td
                          key={col}
                          className={[
                            "whitespace-nowrap py-2.5 pr-4",
                            typeof row[col] === "number" ? "font-mono" : "",
                          ].join(" ")}
                        >
                          {String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel p-5 sm:p-6 lg:col-span-5">
          <h2 className="text-base font-semibold tracking-tight">Class distribution</h2>
          {classData ? (
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={classData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {classData.map((entry) => (
                      <Cell key={entry.name} fill={CLASS_COLORS[entry.name] ?? "var(--chart-5)"} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "var(--popover-foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Students are grouped into three performance classes:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-high" /> High
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-med" /> Medium
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-low" /> Low
                </li>
              </ul>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The actual counts per class will be charted here once the prediction service returns
                the class distribution from <span className="font-mono text-xs">/dataset</span>.
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="panel mb-8 p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold tracking-tight">Academic scores in the preview</h2>
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
            Sample rows only
          </span>
        </div>
        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreChartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                domain={[0, 100]}
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
              <Legend />
              <Bar dataKey="math" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reading" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="writing" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-6 pb-8 lg:grid-cols-12">
        <section className="panel p-5 sm:p-6 lg:col-span-7">
          <h2 className="text-base font-semibold tracking-tight">Feature description</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Feature
                  </th>
                  <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Type
                  </th>
                  <th className="pb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {FEATURE_DESCRIPTIONS.map((feature) => (
                  <tr key={feature.name}>
                    <td className="py-3 pr-4 font-mono text-xs">{feature.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{feature.type}</td>
                    <td className="py-3 text-muted-foreground">{feature.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6 lg:col-span-5">
          <section className="panel p-6">
            <h2 className="text-base font-semibold tracking-tight">Data preprocessing</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>Data loading and cleaning of missing or malformed records.</li>
              <li>Label encoding of categorical attributes.</li>
              <li>Standardisation of numerical attributes with StandardScaler.</li>
              <li>Train/test split before model training.</li>
            </ul>
          </section>
          <section className="panel p-6">
            <h2 className="text-base font-semibold tracking-tight">Feature engineering</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              An Average Score is created from the math, reading and writing scores and used
              alongside the original attributes. All of this happens inside the Python pipeline, so
              the same transformations apply to single and bulk predictions alike.
            </p>
          </section>
          <section className="panel p-6">
            <h2 className="text-base font-semibold tracking-tight">Research observation</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The three exam scores move together closely, and the study reports an association
              between parental level of education and student performance. Correlation figures are
              reported in the paper and are not restated here.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
