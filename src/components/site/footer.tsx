import { PROJECT } from "@/lib/research";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-card/60 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <p className="text-sm font-medium">{PROJECT.title}</p>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
            A research prototype comparing six machine learning algorithms for student performance
            prediction, weighing predictive quality against computational cost.
          </p>
          <p className="label-mono mt-3">
            Machine Learning · Educational Data Mining · Research Project
          </p>
        </div>
        <div>
          <p className="label-mono">Project</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={PROJECT.githubUrl} className="transition-colors hover:text-foreground">
                GitHub repository
              </a>
            </li>
            <li>Research paper — link to be added</li>
            <li>Methodology &amp; dataset documentation</li>
          </ul>
        </div>
        <div>
          <p className="label-mono">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Team / author names — to be added</li>
            <li>Institution — to be added</li>
            <li>Email — to be added</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70">
        <p className="mx-auto max-w-7xl px-4 py-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:px-6">
          Research prototype · Predictions are produced by the project&apos;s Python ML backend
        </p>
      </div>
    </footer>
  );
}
