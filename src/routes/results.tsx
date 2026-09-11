import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DemoBanner } from "@/components/site/demo-banner";
import { PageHeader } from "@/components/site/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/client";
import { MODEL_RESULTS, PROJECT } from "@/lib/research";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Model Results & Analytics — Student Performance ML" },
      {
        name: "description",
        content:
          "Cross-validation accuracy comparison across Logistic Regression, Decision Tree, Random Forest, SVM, KNN and ANN, with computational cost considerations.",
      },
      { property: "og:title", content: "Model Results & Analytics — Student Performance ML" },
      {
        property: "og:description",
        content:
          "Random Forest achieved the best reported cross-validation accuracy of 89.3% in this study.",
      },
    ],
  }),
  component: Results,
});

function Results() {
  const modelInfo = useQuery({ queryKey: ["model-info"], queryFn: () => api.modelInfo() });

  const chartData = MODEL_RESULTS.map((m) => ({
    name: m.short,
    fullName: m.name,
    accuracy: m.accuracy,
    best: m.best ?? false,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Analytics"
        title="Model Results"
        description={`Random Forest achieved the best reported cross-validation accuracy of ${PROJECT.bestAccuracy}. High predictive performance should be considered together with computational cost.`}
      />

      <DemoBanner className="mt-6" />

      <div className="grid gap-6 py-8 lg:grid-cols-12">
        <section className="panel p-5 sm:p-6 lg:col-span-7">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-base font-semibold tracking-tight">Accuracy comparison</h2>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
              {PROJECT.cvFolds}-fold cross-validation
            </span>
          </div>
          <div className="mt-6 h-72 w-full">
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
                  domain={[80, 92]}
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
                  formatter={(value: number) => [`${value}%`, "Accuracy"]}
                  labelFormatter={(label: string) =>
                    chartData.find((d) => d.name === label)?.fullName ?? label
                  }
                />
                <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.best ? "var(--brand)" : "var(--chart-5)"}
                      fillOpacity={entry.best ? 1 : 0.45}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel p-5 sm:p-6 lg:col-span-5">
          <h2 className="text-base font-semibold tracking-tight">Reported results</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Model
                  </th>
                  <th className="pb-2 text-right font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Accuracy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MODEL_RESULTS.map((m) => (
                  <tr key={m.name} className={m.best ? "bg-brand/5" : ""}>
                    <td className="py-3 pr-3">{m.name}</td>
                    <td
                      className={[
                        "py-3 text-right font-mono",
                        m.best ? "font-medium text-brand" : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {m.accuracy.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 rounded-xl border border-brand/30 bg-brand/5 p-4 text-sm leading-relaxed">
            <span className="font-medium">Random Forest</span> achieved the best reported
            cross-validation accuracy of {PROJECT.bestAccuracy}.
          </p>
        </section>
      </div>

      <section className="grid gap-6 pb-8 lg:grid-cols-3">
        <article className="panel p-6">
          <h3 className="text-sm font-semibold tracking-tight">F1, ROC-AUC and Cohen&apos;s Kappa</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            These metrics are produced by the evaluation stage of the Python pipeline. They are not
            shown yet because no values have been supplied to this interface — once the service
            returns them from <span className="font-mono text-xs">/model-info</span>, they will
            appear here alongside accuracy.
          </p>
        </article>
        <article className="panel p-6">
          <h3 className="text-sm font-semibold tracking-tight">Confusion matrix</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The per-class confusion matrix will render here as soon as the evaluation output is
            exposed by the backend. No placeholder values are shown, so nothing on this page can be
            mistaken for a measured result.
          </p>
        </article>
        <article className="panel p-6">
          <h3 className="text-sm font-semibold tracking-tight">Computational cost</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Accuracy differences between the leading models are under half a percentage point, so
            training and inference cost carry real weight when choosing a model to deploy.
          </p>
        </article>
      </section>

      <section className="panel mb-8 p-6">
        <h2 className="text-base font-semibold tracking-tight">Service status</h2>
        {modelInfo.isPending ? (
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        ) : modelInfo.isError ? (
          <p className="mt-3 text-sm text-destructive">
            The prediction service could not be reached, so live model details are unavailable.
          </p>
        ) : (
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="label-mono">Active model</dt>
              <dd className="mt-1 text-sm font-medium">{modelInfo.data?.active_model}</dd>
            </div>
            <div>
              <dt className="label-mono">Classes</dt>
              <dd className="mt-1 text-sm font-medium">{modelInfo.data?.classes.join(" · ")}</dd>
            </div>
            <div>
              <dt className="label-mono">Input features</dt>
              <dd className="mt-1 text-sm font-medium">{modelInfo.data?.features.length}</dd>
            </div>
          </dl>
        )}
      </section>
    </div>
  );
}
