"use client";

import { CheckCircleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import type { Program } from "./types";

type AddProgramReviewProps = {
  program: Program;
  onConfirm: () => void;
  onBack: () => void;
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] py-2 last:border-0 sm:flex-nowrap">
      <span className="text-sm font-medium text-[var(--foreground)]/70">{label}</span>
      <span className="text-right text-sm text-[var(--foreground)]">{value ?? "—"}</span>
    </div>
  );
}

export function AddProgramReview({ program, onConfirm, onBack }: AddProgramReviewProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="program-review-title"
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
              <h2 id="program-review-title" className="text-lg font-semibold text-[var(--foreground)]">
                Review program
              </h2>
              <p className="text-sm text-[var(--foreground)]/70">
                Confirm details before adding
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)]/50 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
              Program details
            </h3>
            <div className="space-y-0">
              <Row label="MC Ref" value={program.mc_ref} />
              <Row label="Interest rate" value={program.interest_rate != null ? `${Number(program.interest_rate)}%` : "—"} />
              <Row label="Delinquency rate" value={program.delinquency_rate != null ? `${Number(program.delinquency_rate)}%` : "—"} />
              <Row label="Max term (years)" value={program.max_term_yrs} />
            </div>
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
            Add program
          </button>
        </div>
      </div>
    </div>
  );
}
