import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="animate-rise border-b border-border/70 pb-8 pt-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
      <h1 className="mt-3 max-w-[24ch] text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-[62ch] text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
    </section>
  );
}
