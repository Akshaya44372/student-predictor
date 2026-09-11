import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CloudSun, Droplets, RefreshCw, Thermometer, Wind } from "lucide-react";
import { useState } from "react";
import { DemoBanner } from "@/components/site/demo-banner";
import { PageHeader } from "@/components/site/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api/client";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Weather — Student Performance ML" },
      {
        name: "description",
        content:
          "Live weather conditions served by the project's backend weather endpoint, shown alongside the student performance prediction tools.",
      },
      { property: "og:title", content: "Weather — Student Performance ML" },
      {
        property: "og:description",
        content: "Current weather conditions from the project's backend weather endpoint.",
      },
    ],
  }),
  component: Weather,
});

function Weather() {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");

  const weather = useQuery({
    queryKey: ["weather", query],
    queryFn: () => api.weather(query || undefined),
  });

  const data = weather.data;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Utility"
        title="Weather"
        description="Current conditions retrieved from the project's weather endpoint. This page is independent of the prediction models and does not influence any result."
      />

      <DemoBanner className="mt-6" />

      <div className="grid gap-6 py-8 lg:grid-cols-12">
        <section className="panel p-5 sm:p-6 lg:col-span-5">
          <h2 className="text-base font-semibold tracking-tight">Look up a location</h2>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setQuery(location.trim().slice(0, 80));
            }}
          >
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={80}
              placeholder="City name"
              aria-label="City name"
              className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
            >
              Search
            </button>
          </form>
          <button
            type="button"
            onClick={() => weather.refetch()}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RefreshCw className="size-3" /> Refresh
          </button>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Leave the field empty to use the default location configured on the backend.
          </p>
        </section>

        <section className="panel p-5 sm:p-6 lg:col-span-7">
          {weather.isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : weather.isError ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
              <p className="font-medium">Weather information is unavailable</p>
              <p className="mt-1 text-muted-foreground">
                The weather service could not be reached. Please try again in a moment.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="label-mono">Location</p>
                  <p className="mt-1 truncate text-2xl font-semibold tracking-tight">
                    {data?.location}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{data?.condition}</p>
                </div>
                <CloudSun className="size-10 shrink-0 text-brand" />
              </div>

              <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
                <div className="bg-card p-4">
                  <dt className="label-mono flex items-center gap-1.5">
                    <Thermometer className="size-3" /> Temperature
                  </dt>
                  <dd className="mt-1 font-mono text-2xl font-semibold">
                    {data?.temperature_c}°C
                  </dd>
                </div>
                <div className="bg-card p-4">
                  <dt className="label-mono flex items-center gap-1.5">
                    <Droplets className="size-3" /> Humidity
                  </dt>
                  <dd className="mt-1 font-mono text-2xl font-semibold">{data?.humidity}%</dd>
                </div>
                <div className="bg-card p-4">
                  <dt className="label-mono flex items-center gap-1.5">
                    <Wind className="size-3" /> Wind
                  </dt>
                  <dd className="mt-1 font-mono text-2xl font-semibold">{data?.wind_kph} kph</dd>
                </div>
              </dl>

              {data?.updated_at ? (
                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Updated {new Date(data.updated_at).toLocaleString()}
                </p>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
