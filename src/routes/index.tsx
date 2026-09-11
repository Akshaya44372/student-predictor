import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DemoBanner } from "@/components/site/demo-banner";
import { MODEL_RESULTS, PIPELINE_STEPS, PROJECT } from "@/lib/research";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Student Performance Prediction Using Machine Learning" },
      {
        name: "description",
        content:
          "A resource-efficient machine learning framework that predicts student performance while balancing accuracy and computational cost across six algorithms.",
      },
      { property: "og:title", content: "Student Performance Prediction Using Machine Learning" },
      {
        property: "og:description",
        content:
          "Research prototype comparing Logistic Regression, Decision Tree, Random Forest, SVM, KNN and ANN for student performance prediction.",
      },
    ],
  }),
  component: Home,
});

const STATS = [
  { label: "Records", value: "490" },
  { label: "Features", value: "17" },
  { label: "Models", value: "6" },
  { label: "CV Fold", value: "5" },
  { label: "Best Accuracy", value: "89.3%", accent: true },
  { label: "Classes", value: "High · Med · Low", small: true },
];

const WHY = [
  {
    title: "Student performance prediction",
    body: "Estimate a student's likely performance band from academic, demographic and socioeconomic attributes.",
  },
  {
    title: "Educational data mining",
    body: "Apply established data mining practice to institutional student records.",
  },
  {
    title: "Early identification of support needs",
    body: "Surface students who may benefit from additional academic support sooner.",
  },
  {
    title: "Comparison of multiple algorithms",
    body: "Six classifiers evaluated under the same preprocessing and validation protocol.",
  },
  {
    title: "Accuracy against computational cost",
    body: "Predictive quality is reported alongside the resources each model requires.",
  },
];

function Home() {
  const maxAccuracy = Math.max(...MODEL_RESULTS.map((m) => m.accuracy));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <section className="grid gap-8 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-7">
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.2em] text-brand">
            Educational Data Mining
          </p>
          <h1 className="animate-rise mt-4 max-w-[18ch] text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            {PROJECT.shortTitle}
          </h1>
          <p className="animate-rise mt-5 max-w-[46ch] text-pretty leading-relaxed text-muted-foreground">
            {PROJECT.subtitle}
          </p>
          <div className="animate-rise mt-7 flex flex-wrap gap-3">
            <Link
              to="/predict"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Predict Student Performance
            </Link>
            <Link
              to="/about"
              className="rounded-lg border border-border bg-card/70 px-5 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              Explore the Project
            </Link>
          </div>

          <dl className="animate-rise mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-card/70 p-4 backdrop-blur">
                <dt className="label-mono">{stat.label}</dt>
                <dd
                  className={[
                    "mt-1 font-semibold",
                    stat.small ? "text-sm leading-8" : "text-2xl",
                    stat.accent ? "text-brand" : "",
                  ].join(" ")}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5">
          <div className="panel animate-rise h-full p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <p className="label-mono">ML Pipeline</p>
              <span className="rounded-full bg-high/10 px-2 py-0.5 font-mono text-[10px] font-medium text-high">
                RF reported best
              </span>
            </div>
            <ol className="mt-4 space-y-1.5">
              {PIPELINE_STEPS.map((step, i) => {
                const isLast = i === PIPELINE_STEPS.length - 1;
                return (
                  <li
                    key={step}
                    className={[
                      "flex items-center gap-3 rounded-lg px-2 py-1.5",
                      isLast ? "border border-brand/30 bg-brand/5" : "",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "grid size-6 shrink-0 place-items-center rounded-md font-mono text-[10px]",
                        isLast ? "bg-brand/15 text-brand" : "bg-foreground/5 text-muted-foreground",
                      ].join(" ")}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={["text-sm", isLast ? "font-medium" : ""].join(" ")}>
                      {step}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <DemoBanner className="mb-10" />

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight">Model Comparison</h2>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
              Cross-validation accuracy
            </span>
          </div>
          <div className="panel p-5">
            <div className="space-y-4">
              {MODEL_RESULTS.map((model, i) => (
                <div
                  key={model.name}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 sm:flex"
                >
                  <span
                    className={[
                      "truncate text-sm sm:w-44 sm:shrink-0",
                      model.best ? "font-medium" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {model.name}
                  </span>
                  <span
                    className={[
                      "order-2 w-12 shrink-0 text-right font-mono text-xs sm:order-3",
                      model.best ? "font-medium text-brand" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {model.accuracy.toFixed(1)}
                  </span>
                  <div className="order-3 col-span-2 h-2.5 flex-1 overflow-hidden rounded-full bg-foreground/5 sm:order-2">
                    <div
                      className={[
                        "animate-grow h-full rounded-full",
                        model.best ? "bg-brand" : "bg-foreground/30",
                      ].join(" ")}
                      style={{
                        width: `${(model.accuracy / maxAccuracy) * 100}%`,
                        animationDelay: `${i * 60}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight">Why This Project?</h2>
          </div>
          <div className="panel p-5">
            <ul className="space-y-4">
              {WHY.map((item) => (
                <li key={item.title} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">Algorithms Compared</h2>
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
            Identical preprocessing &amp; validation
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODEL_RESULTS.map((model) => (
            <article
              key={model.name}
              className={[
                "panel p-5 transition-transform duration-200 hover:-translate-y-0.5",
                model.best ? "border-brand/40" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="label-mono">{model.short}</span>
                {model.best ? (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-medium text-brand">
                    Best reported
                  </span>
                ) : null}
              </div>
              <h3 className="mt-2 text-base font-semibold tracking-tight">{model.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{model.note}</p>
              <p className="mt-4 font-mono text-2xl font-semibold">
                {model.accuracy.toFixed(1)}
                <span className="text-sm text-muted-foreground">%</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel mt-14 flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Try a Prediction</h2>
          <p className="mt-1 max-w-[52ch] text-sm text-muted-foreground">
            Enter one student&apos;s details, or upload a spreadsheet to score an entire cohort at
            once.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            Single prediction <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/bulk"
            className="rounded-lg border border-border bg-card/70 px-5 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            Bulk prediction
          </Link>
        </div>
      </section>
    </div>
  );
}
