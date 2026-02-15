import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon,
  MapPinIcon,
  CheckBadgeIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const STATS = [
  { label: "Total Applications", value: "1,247", sub: "All time", icon: DocumentTextIcon },
  { label: "Pending Applications", value: "89", sub: "Awaiting review", icon: ClockIcon },
  { label: "Approved Applications", value: "1,042", sub: "Processed", icon: CheckCircleIcon },
  { label: "Total Beneficiaries", value: "342", sub: "Registered", icon: UserGroupIcon },
  { label: "Total Lots", value: "2,156", sub: "Across all projects", icon: MapPinIcon },
  { label: "Available Lots", value: "412", sub: "Ready for award", icon: MapPinIcon },
  { label: "Awarded Lots", value: "1,688", sub: "Documented", icon: CheckBadgeIcon },
  { label: "Active Projects", value: "24", sub: "In progress", icon: FolderIcon },
  { label: "Programs", value: "8", sub: "Active programs", icon: ClipboardDocumentListIcon },
];

export function DashboardStats() {
  return (
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        Summary statistics
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <p className="text-sm font-medium text-[var(--foreground)]/70">
                  {stat.label}
                </p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-primary">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs text-[var(--foreground)]/60">
                {stat.sub}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
