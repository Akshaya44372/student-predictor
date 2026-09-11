import { Info } from "lucide-react";
import { IS_MOCK } from "@/lib/api/client";

/**
 * Shown whenever the app is running without a configured Python backend, so no
 * output on screen is ever mistaken for real model output.
 */
export function DemoBanner({ className = "" }: { className?: string }) {
  if (!IS_MOCK) return null;
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-med/30 bg-med/10 px-4 py-3 text-sm ${className}`}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-med" />
      <p className="text-muted-foreground">
        <span className="font-medium text-foreground">Demo mode.</span> No prediction service is
        connected yet, so results shown here are placeholders for interface testing — not machine
        learning output. Connect the project&apos;s Python service to see real predictions.
      </p>
    </div>
  );
}
