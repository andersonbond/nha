import { DocumentChartBarIcon, MapIcon } from "@heroicons/react/24/outline";

const APPLICATIONS_BY_STATUS = [
  { status: "Pending", count: 89, pct: 7 },
  { status: "Approved", count: 1042, pct: 84 },
  { status: "Rejected", count: 116, pct: 9 },
];

const LOTS_BY_STATUS = [
  { status: "Available", count: 412, pct: 19 },
  { status: "Awarded", count: 1688, pct: 78 },
  { status: "Reserved", count: 56, pct: 3 },
];

function Bar({ label, count, pct }: { label: string; count: number; pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-sm text-[var(--foreground)]">{label}</span>
      <div className="min-w-0 flex-1">
        <div className="h-6 overflow-hidden rounded bg-[var(--border-subtle)]">
          <div
            className="h-full rounded bg-primary"
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
      </div>
      <span className="w-12 shrink-0 text-right text-sm font-medium text-[var(--foreground)]">
        {count.toLocaleString()}
      </span>
    </div>
  );
}

export function DashboardBreakdown() {
  return (
    <section className="grid gap-6 md:grid-cols-2" aria-labelledby="breakdown-heading">
      <h2 id="breakdown-heading" className="sr-only">
        Breakdown by status
      </h2>

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <DocumentChartBarIcon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          Applications by status
        </h3>
        <div className="mt-3 space-y-3">
          {APPLICATIONS_BY_STATUS.map((row) => (
            <Bar
              key={row.status}
              label={row.status}
              count={row.count}
              pct={row.pct}
            />
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <MapIcon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          Lots by status
        </h3>
        <div className="mt-3 space-y-3">
          {LOTS_BY_STATUS.map((row) => (
            <Bar
              key={row.status}
              label={row.status}
              count={row.count}
              pct={row.pct}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
