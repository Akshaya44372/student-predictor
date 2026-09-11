import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DemoBanner } from "@/components/site/demo-banner";
import { PageHeader } from "@/components/site/page-header";
import { PredictionResult } from "@/components/site/prediction-result";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/client";
import {
  CATEGORICAL_FEATURES,
  SCORE_FEATURES,
  studentInputSchema,
  type PredictionResponse,
  type StudentInput,
} from "@/lib/api/types";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "Single Student Prediction — Student Performance ML" },
      {
        name: "description",
        content:
          "Enter one student's demographic, socioeconomic and exam score details and receive a performance class predicted by the trained machine learning model.",
      },
      { property: "og:title", content: "Single Student Prediction — Student Performance ML" },
      {
        property: "og:description",
        content: "Predict a single student's performance class using the trained ML model.",
      },
    ],
  }),
  component: Predict;
});

type FormState = {
  gender: string;
  race_ethnicity: string;
  parental_level_of_education: string;
  lunch: string;
  test_preparation_course: string;
  math_score: string;
  reading_score: string;
  writing_score: string;
};

const EMPTY: FormState = {
  gender: "",
  race_ethnicity: "",
  parental_level_of_education: "",
  lunch: "",
  test_preparation_course: "",
  math_score: "",
  reading_score: "",
  writing_score: "",
};

/** Sample rows drawn from the project dataset, used to fill the form for demonstration. */
const SAMPLES: { label: string; note: string; values: FormState }[] = [
  {
    label: "Try High Performance Sample",
    note: "High",
    values: {
      gender: "female",
      race_ethnicity: "group B",
      parental_level_of_education: "master's degree",
      lunch: "standard",
      test_preparation_course: "none",
      math_score: "90",
      reading_score: "95",
      writing_score: "93",
    },
  },
  {
    label: "Try Medium Performance Sample",
    note: "Medium",
    values: {
      gender: "female",
      race_ethnicity: "group B",
      parental_level_of_education: "associate's degree",
      lunch: "standard",
      test_preparation_course: "none",
      math_score: "71",
      reading_score: "83",
      writing_score: "78",
    },
  },
  {
    label: "Try Low Performance Sample",
    note: "Low",
    values: {
      gender: "male",
      race_ethnicity: "group B",
      parental_level_of_education: "some college",
      lunch: "free/reduced",
      test_preparation_course: "none",
      math_score: "40",
      reading_score: "43",
      writing_score: "39",
    },
  },
];

function Predict() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sampleLabel, setSampleLabel] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const scores = SCORE_FEATURES.map((f) => Number(form[f.key]));
  const allScoresValid = scores.every((s) => Number.isFinite(s) && s >= 0 && s <= 100);
  const average = useMemo(
    () => (allScoresValid ? scores.reduce((a, b) => a + b, 0) / scores.length : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.math_score, form.reading_score, form.writing_score],
  );

  const mutation = useMutation({
    mutationFn: (input: StudentInput) => api.predict(input),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Prediction complete");
    },
    onError: (error: Error) => {
      setResult(null);
      toast.error(error.message || "The prediction could not be completed. Please try again.");
    },
  });

  function update(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const candidate = {
      ...form,
      math_score: Number(form.math_score),
      reading_score: Number(form.reading_score),
      writing_score: Number(form.writing_score),
    };
    const parsed = studentInputSchema.safeParse(candidate);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please complete every field with a valid value.");
      return;
    }
    setErrors({});
    mutation.mutate(parsed.data);
  }

  function applySample(sample: (typeof SAMPLES)[number]) {
    setForm(sample.values);
    setErrors({});
    setResult(null);
    setSampleLabel(sample.note);
  }

  function clearForm() {
    setForm(EMPTY);
    setErrors({});
    setResult(null);
    setSampleLabel(null);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Inference"
        title="Single Student Prediction"
        description="Enter the details for one student. The values are sent to the project's machine learning service, which handles encoding, scaling and prediction — this page performs no modelling of its own."
      />

      <DemoBanner className="mt-6" />

      <div className="grid gap-6 py-8 lg:grid-cols-12">
        <form onSubmit={handleSubmit} className="panel p-5 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLES.map((sample) => (
              <button
                key={sample.note}
                type="button"
                onClick={() => applySample(sample)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
              >
                <Sparkles className="size-3" />
                {sample.label}
              </button>
            ))}
            <button
              type="button"
              onClick={clearForm}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="size-3" /> Clear Form
            </button>
          </div>

          {sampleLabel ? (
            <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              Sample data loaded ({sampleLabel} example from the dataset). You can edit any value
              before predicting.
            </p>
          ) : null}

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {CATEGORICAL_FEATURES.map((feature) => (
              <div key={feature.key}>
                <label htmlFor={feature.key} className="label-mono">
                  {feature.label}
                </label>
                <select
                  id={feature.key}
                  value={form[feature.key]}
                  onChange={(e) => update(feature.key, e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select…</option>
                  {feature.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                  {errors[feature.key] ? (
                    <span className="text-destructive">{errors[feature.key]}</span>
                  ) : (
                    feature.hint
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {SCORE_FEATURES.map((feature) => (
              <div key={feature.key}>
                <label htmlFor={feature.key} className="label-mono">
                  {feature.label}
                </label>
                <input
                  id={feature.key}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  value={form[feature.key]}
                  onChange={(e) => update(feature.key, e.target.value)}
                  placeholder="0–100"
                  className="mt-1.5 w-full rounded-lg border border-input bg-card px-3 py-2.5 font-mono text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {errors[feature.key] ? (
                    <span className="text-destructive">{errors[feature.key]}</span>
                  ) : (
                    feature.hint
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-muted px-4 py-3">
            <span className="label-mono">Average score</span>
            <span className="font-mono text-lg font-semibold">
              {average === null ? "—" : average.toFixed(2)}
            </span>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {mutation.isPending ? "Predicting…" : "Predict Performance"}
          </button>
        </form>

        <div className="space-y-6 lg:col-span-5">
          <div>
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight">Result</h2>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                From the ML service
              </span>
            </div>

            {mutation.isPending ? (
              <div className="panel space-y-3 p-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : result ? (
              <PredictionResult result={result} averageScore={average ?? 0} />
            ) : (
              <div className="panel p-6 text-sm leading-relaxed text-muted-foreground">
                Complete the form and select{" "}
                <span className="font-medium text-foreground">Predict Performance</span>. The
                predicted class, any probabilities returned by the model and a summary of your
                inputs will appear here.
              </div>
            )}
          </div>

          <div className="panel p-6">
            <h3 className="text-sm font-semibold tracking-tight">Input summary</h3>
            <dl className="mt-4 space-y-2 text-sm">
              {[...CATEGORICAL_FEATURES, ...SCORE_FEATURES].map((feature) => (
                <div key={feature.key} className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">{feature.label}</dt>
                  <dd className="text-right font-medium">{form[feature.key] || "—"}</dd>
                </div>
              ))}
              <div className="flex items-start justify-between gap-4 border-t border-border pt-2">
                <dt className="text-muted-foreground">Average score</dt>
                <dd className="text-right font-mono font-medium">
                  {average === null ? "—" : average.toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
