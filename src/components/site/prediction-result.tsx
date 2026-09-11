import type { PredictionResponse } from "@/lib/api/types";

export function classTone(label: string): "high" | "med" | "low" | "neutral" {
  const l = label.toLowerCase();
  if (l.startsWith("high")) return "high";
  if (l.startsWith("med")) return "med";
  if (l.startsWith("low")) return "low";
  return "neutral";
}

type Tone = "high" | "med" | "low" | "neutral";

const TONE_CLASSES: Record<Tone, { wrap: string; text: string; bar: string }> = {
  high: { wrap: "border-high/30 bg-high/5", text: "text-high", bar: "bg-high" },
  med: { wrap: "border-med/30 bg-med/5", text: "text-med", bar: "bg-med" },
  low: { wrap: "border-low/30 bg-low/5", text: "text-low", bar: "bg-low" },
  neutral: { wrap: "border-border bg-muted/40", text: "text-foreground", bar: "bg-foreground/40" },
};

export function ClassBadge({ label }: { label: string }) {
  const tone = TONE_CLASSES[classTone(label)];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${tone.wrap} ${tone.text}`}
    >
      {label}
    </span>
  );
}

export function PredictionResult({
  result,
  averageScore,
}: {
  result: PredictionResponse;
  averageScore: number;
}) {
  const tone = TONE_CLASSES[classTone(result.prediction)];
  const probabilities = result.probabilities
    ? Object.entries(result.probabilities).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className={`animate-rise rounded-2xl border p-6 ${tone.wrap}`}>
      <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${tone.text}`}>
        Predicted performance
      </p>
      <p className="mt-2 text-4xl font-semibold tracking-tight">{result.prediction}</p>

      {probabilities.length > 0 ? (
        <div className="mt-5 space-y-2">
          {probabilities.map(([label, value]) => {
            const pct = value <= 1 ? value * 100 : value;
            const barTone = TONE_CLASSES[classTone(label)];
            return (
              <div key={label} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-xs text-muted-foreground">{label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/5">
                  <div
                    className={`animate-grow h-full rounded-full ${barTone.bar}`}
                    style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right font-mono text-[11px] text-muted-foreground">
                  {pct.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          The prediction service did not return class probabilities for this record.
        </p>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
        <div className="bg-card p-3">
          <dt className="label-mono">Average score</dt>
          <dd className="mt-1 font-mono text-lg font-semibold">
            {(result.average_score ?? averageScore).toFixed(2)}
          </dd>
        </div>
        <div className="bg-card p-3">
          <dt className="label-mono">Model</dt>
          <dd className="mt-1 text-sm font-medium">{result.model ?? "Reported by backend"}</dd>
        </div>
      </dl>

      {result.explanation ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{result.explanation}</p>
      ) : null}
    </div>
  );
}
