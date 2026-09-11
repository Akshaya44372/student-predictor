import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, Github } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { PROJECT } from "@/lib/research";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/predict", label: "Single Prediction" },
  { to: "/bulk", label: "Bulk Prediction" },
  { to: "/dataset", label: "Dataset" },
  { to: "/results", label: "Results" },
  { to: "/weather", label: "Weather" },
] as const;

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary font-mono text-xs font-medium text-primary-foreground">
            Sx
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold">StudentX Predict</span>
            <span className="label-mono block">Research Prototype</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-accent data-[status=active]:font-medium data-[status=active]:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="grid size-9 place-items-center rounded-md border border-border bg-card/60 text-muted-foreground transition-colors hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <a
            href={PROJECT.githubUrl}
            className="hidden size-9 place-items-center rounded-md border border-border bg-card/60 text-muted-foreground transition-colors hover:text-foreground sm:grid"
            aria-label="Project repository"
          >
            <Github className="size-4" />
          </a>
          <Link
            to="/predict"
            className="hidden rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 sm:block"
          >
            Predict
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-md border border-border bg-card/60 text-muted-foreground xl:hidden"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/70 bg-card/95 transition-[max-height] duration-300 xl:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-0.5 px-4 py-3 sm:px-6">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-accent data-[status=active]:font-medium data-[status=active]:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
