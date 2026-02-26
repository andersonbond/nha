"use client";

import { useState } from "react";
import {
  DocumentTextIcon,
  MapPinIcon,
  TrophyIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  FunnelIcon,
  ChartBarSquareIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

type ReportSection =
  | "applications"
  | "lots"
  | "awards"
  | "monthly-program-summary"
  | "beneficiary-demographics"
  | "landholding-assessment"
  | "quarterly-financial";

const SECTIONS: {
  id: ReportSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    id: "applications",
    label: "Applications",
    icon: DocumentTextIcon,
    description: "Export application records with status, dates, and linked beneficiaries.",
  },
  {
    id: "lots",
    label: "Lots",
    icon: MapPinIcon,
    description: "Export lot inventory with location, status, and project assignment.",
  },
  {
    id: "awards",
    label: "Awards",
    icon: TrophyIcon,
    description: "Export lot award records and beneficiary award status.",
  },
  {
    id: "monthly-program-summary",
    label: "Monthly Program Summary",
    icon: ChartBarSquareIcon,
    description: "Summary of program activity, applications processed, and key metrics by month.",
  },
  {
    id: "beneficiary-demographics",
    label: "Beneficiary Demographics",
    icon: UserGroupIcon,
    description: "Demographic breakdown of beneficiaries (age, location, household size, etc.).",
  },
  {
    id: "landholding-assessment",
    label: "Landholding Assessment",
    icon: BuildingOffice2Icon,
    description: "Assessment of landholding inventory, status, and utilization.",
  },
  {
    id: "quarterly-financial",
    label: "Quarterly Financial Report",
    icon: BanknotesIcon,
    description: "Financial summary, disbursements, and budget status by quarter.",
  },
];

export default function ReportsPage() {
  const [activeSection, setActiveSection] = useState<ReportSection>("applications");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadXlsx = () => {
    setIsDownloading(true);
    // Placeholder: actual xlsx generation will be implemented in MVP 3
    setTimeout(() => {
      setIsDownloading(false);
      // Could trigger a toast here when toast system exists
      console.log(`Download (xlsx) requested for: ${activeSection}`);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="shrink-0 md:w-56">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Reports
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground)]/70">
          Generate and download reports. Coming in MVP 3.
        </p>
        <nav className="mt-6 flex flex-col gap-0.5" aria-label="Report sections">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                activeSection === id
                  ? "bg-primary text-primary-foreground"
                  : "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="min-w-0 flex-1 space-y-6">
        {SECTIONS.map((section) => {
          if (activeSection !== section.id) return null;
          const Icon = section.icon;
          return (
            <section
              key={section.id}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-6 shadow-subtle dark:shadow-subtle-dark"
              aria-labelledby={`${section.id}-heading`}
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2
                    id={`${section.id}-heading`}
                    className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]"
                  >
                    <Icon className="h-6 w-6 shrink-0 text-primary" aria-hidden />
                    {section.label}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--foreground)]/70 max-w-xl">
                    {section.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadXlsx}
                  disabled={isDownloading}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" aria-hidden />
                  {isDownloading ? "Preparing…" : "Download (xlsx)"}
                </button>
              </div>

              {/* Filter placeholders */}
              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-md border border-dashed border-[var(--border-subtle)] bg-[var(--background-elevated)]/50 p-4">
                <span className="flex items-center gap-2 text-sm text-[var(--foreground)]/60">
                  <CalendarDaysIcon className="h-4 w-4" aria-hidden />
                  Date range
                </span>
                <span className="text-[var(--foreground)]/30">·</span>
                <span className="flex items-center gap-2 text-sm text-[var(--foreground)]/60">
                  <FunnelIcon className="h-4 w-4" aria-hidden />
                  Project / status filters
                </span>
                <p className="w-full text-xs text-[var(--foreground)]/50 mt-1">
                  Filters will be available when report generation is implemented.
                </p>
              </div>

              <div className="mt-4 flex min-h-[140px] items-center justify-center rounded-md border border-dashed border-[var(--border-subtle)] bg-[var(--background-elevated)]/30">
                <p className="text-sm text-[var(--foreground)]/50">
                  Report preview will appear here. Select filters and click Download (xlsx) to export.
                </p>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
