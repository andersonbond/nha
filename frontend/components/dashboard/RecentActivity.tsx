import { BoltIcon } from "@heroicons/react/24/outline";

const ACTIVITY = [
  { id: "1", action: "Lot awarded", entity: "Lot #2847 – Brgy. San Isidro", time: "2 hours ago" },
  { id: "2", action: "Application approved", entity: "APP-2026-0892", time: "5 hours ago" },
  { id: "3", action: "Project updated", entity: "NHA Resettlement Phase 2", time: "1 day ago" },
  { id: "4", action: "New application", entity: "APP-2026-0893", time: "1 day ago" },
  { id: "5", action: "Lot reserved", entity: "Lot #2848 – Brgy. San Isidro", time: "2 days ago" },
];

export function RecentActivity() {
  return (
    <section
      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark"
      aria-labelledby="activity-heading"
    >
      <h2 id="activity-heading" className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
        <BoltIcon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
        Recent activity
      </h2>
      <ul className="mt-3 divide-y divide-[var(--border-subtle)]" role="list">
        {ACTIVITY.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
          >
            <span className="text-sm text-[var(--foreground)]">
              <span className="font-medium text-primary">{item.action}</span>
              {" – "}
              <span className="text-[var(--foreground)]/90">{item.entity}</span>
            </span>
            <span className="text-xs text-[var(--foreground)]/60">{item.time}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
