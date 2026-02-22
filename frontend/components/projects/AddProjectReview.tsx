"use client";

import { CheckCircleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import type { Project } from "./types";

type ProgramOption = { project_prog_id: number; mc_ref: string | null };

type AddProjectReviewProps = {
  project: Project;
  programs: ProgramOption[];
  onConfirm: () => void;
  onBack: () => void;
};

function formatNum(n: number | null | undefined): string {
  if (n == null) return "—";
  return Number(n).toLocaleString("en-PH", { maximumFractionDigits: 2 });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] py-2 last:border-0 sm:flex-nowrap">
      <span className="text-sm font-medium text-[var(--foreground)]/70">{label}</span>
      <span className="text-right text-sm text-[var(--foreground)]">{value ?? "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)]/50 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
        {title}
      </h3>
      <div className="space-y-0">{children}</div>
    </div>
  );
}

export function AddProjectReview({ project, programs, onConfirm, onBack }: AddProjectReviewProps) {
  const programLabel =
    project.project_prog_id != null
      ? programs.find((p) => p.project_prog_id === project.project_prog_id)?.mc_ref ??
        `Program ${project.project_prog_id}`
      : "—";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden
        onClick={onBack}
      />
      <div className="relative w-full max-w-lg rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] shadow-2xl">
        <div className="border-b border-[var(--border-subtle)] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <CheckCircleIcon className="h-7 w-7 text-primary" aria-hidden />
            </div>
            <div>
              <h2 id="review-title" className="text-lg font-semibold text-[var(--foreground)]">
                Review project
              </h2>
              <p className="text-sm text-[var(--foreground)]/70">
                Confirm details before adding
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <Section title="Basic info">
              <Row label="Project code" value={project.project_code} />
              <Row label="Project name" value={project.project_name} />
              <Row label="Program" value={programLabel} />
              <Row label="Lot type" value={project.lot_type} />
            </Section>

            <Section title="Location">
              <Row label="Region code" value={project.region_code} />
              <Row label="Province code" value={project.province_code} />
            </Section>

            <Section title="Financial">
              <Row label="Total area" value={formatNum(project.total_area)} />
              <Row label="Project cost (₱)" value={project.project_cost != null ? `₱${formatNum(project.project_cost)}` : "—"} />
              <Row label="Downpayment (₱)" value={project.downpayment != null ? `₱${formatNum(project.downpayment)}` : "—"} />
              <Row label="Monthly amortization (₱)" value={project.monthly_amortization != null ? `₱${formatNum(project.monthly_amortization)}` : "—"} />
              <Row label="Interest rate" value={project.interest_rate != null ? `${Number(project.interest_rate) * 100}%` : "—"} />
              <Row label="Selling price (₱)" value={project.selling_price != null ? `₱${formatNum(project.selling_price)}` : "—"} />
              <Row label="Terms (years)" value={project.terms_yr} />
            </Section>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--border-subtle)] px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 sm:min-h-0"
          >
            <PencilSquareIcon className="h-5 w-5" aria-hidden />
            Back to edit
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[var(--background)] sm:min-h-0"
          >
            <CheckCircleIcon className="h-5 w-5" aria-hidden />
            Add project
          </button>
        </div>
      </div>
    </div>
  );
}
