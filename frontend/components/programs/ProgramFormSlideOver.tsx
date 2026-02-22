"use client";

import { useState } from "react";
import {
  XMarkIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import type { Program } from "./types";

type ProgramFormSlideOverProps = {
  open: boolean;
  program: Program;
  isEdit: boolean;
  onClose: () => void;
  onSave: (program: Program) => void;
  onChange: (program: Program) => void;
};

const RATE_MAX = 999.9999;

function validateProgram(program: Program): Record<string, string> {
  const err: Record<string, string> = {};
  if ((program.mc_ref ?? "").length > 50) err.mc_ref = "Max 50 characters.";
  const rate = program.interest_rate != null ? Number(program.interest_rate) : 0;
  if (!Number.isFinite(rate) || rate < 0 || rate > RATE_MAX) err.interest_rate = `Must be 0–${RATE_MAX}.`;
  const delRate = program.delinquency_rate != null ? Number(program.delinquency_rate) : 0;
  if (!Number.isFinite(delRate) || delRate < 0 || delRate > RATE_MAX) err.delinquency_rate = `Must be 0–${RATE_MAX}.`;
  const term = program.max_term_yrs;
  if (term != null && (!Number.isInteger(Number(term)) || Number(term) < 0 || Number(term) > 99)) err.max_term_yrs = "Must be 0–99.";
  return err;
}

export function ProgramFormSlideOver({
  open,
  program,
  isEdit,
  onClose,
  onSave,
  onChange,
}: ProgramFormSlideOverProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  function update(field: keyof Program, value: string | number | null) {
    onChange({ ...program, [field]: value });
    if (errors[field as string]) setErrors((e) => ({ ...e, [field as string]: "" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateProgram(program);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave(program);
  }

  const inputClass = (field: string) =>
    `mt-1 w-full rounded-md border bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] ${errors[field] ? "border-red-500" : "border-[var(--border-subtle)]"}`;

  return (
    <div
      className="fixed inset-0 z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="program-slide-over-title"
    >
      <div className="absolute inset-0 bg-black/30" aria-hidden onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex w-full flex-col bg-[var(--background)] shadow-xl sm:max-w-lg">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4">
          <h2
            id="program-slide-over-title"
            className="text-lg font-semibold text-[var(--foreground)]"
          >
            {isEdit ? "Edit program" : "New program"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded p-2 text-[var(--foreground)]/70 hover:bg-black/5 dark:hover:bg-white/10 sm:min-h-0 sm:min-w-0"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="space-y-6 px-6 py-4">
            <div>
              <label
                htmlFor="mc_ref"
                className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80"
              >
                <DocumentTextIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                Memorandum Circular Reference
              </label>
              <input
                id="mc_ref"
                type="text"
                value={program.mc_ref ?? ""}
                onChange={(e) => update("mc_ref", e.target.value)}
                maxLength={50}
                className={inputClass("mc_ref")}
              />
              {errors.mc_ref && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.mc_ref}</p>}
            </div>
            <div>
              <label
                htmlFor="interest_rate"
                className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80"
              >
                <BanknotesIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                Interest rate
              </label>
              <input
                id="interest_rate"
                type="number"
                step="0.0001"
                value={program.interest_rate ?? ""}
                onChange={(e) =>
                  update(
                    "interest_rate",
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
                className={inputClass("interest_rate")}
              />
              {errors.interest_rate && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.interest_rate}</p>}
            </div>
            <div>
              <label
                htmlFor="delinquency_rate"
                className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80"
              >
                <ChartBarIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                Delinquency rate
              </label>
              <input
                id="delinquency_rate"
                type="number"
                step="0.0001"
                value={program.delinquency_rate ?? ""}
                onChange={(e) =>
                  update(
                    "delinquency_rate",
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
                className={inputClass("delinquency_rate")}
              />
              {errors.delinquency_rate && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.delinquency_rate}</p>}
            </div>
            <div>
              <label
                htmlFor="max_term_yrs"
                className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80"
              >
                <ClockIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                Max term (years)
              </label>
              <input
                id="max_term_yrs"
                type="number"
                min={0}
                value={program.max_term_yrs ?? ""}
                onChange={(e) =>
                  update(
                    "max_term_yrs",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                className={inputClass("max_term_yrs")}
              />
              {errors.max_term_yrs && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.max_term_yrs}</p>}
            </div>
          </div>
          <div className="mt-auto flex justify-end gap-3 border-t border-[var(--border-subtle)] px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-md border border-[var(--border-subtle)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 sm:min-h-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[var(--background)] sm:min-h-0"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
