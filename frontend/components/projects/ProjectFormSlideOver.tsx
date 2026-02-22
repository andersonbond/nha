"use client";

import { useState } from "react";
import {
  XMarkIcon,
  FolderIcon,
  MapPinIcon,
  BanknotesIcon,
  TagIcon,
  DocumentTextIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import type { Project } from "./types";

type ProgramOption = { project_prog_id: number; mc_ref: string | null };

type ProjectFormSlideOverProps = {
  open: boolean;
  project: Project;
  isEdit: boolean;
  programs: ProgramOption[];
  onClose: () => void;
  onSave: (project: Project) => void;
  onChange: (project: Project) => void;
};

const RATE_MAX = 999.9999;

function validateProject(project: Project, _isEdit: boolean): Record<string, string> {
  const err: Record<string, string> = {};
  const code = (project.project_code ?? "").trim();
  if (!code) err.project_code = "Project code is required.";
  else if (code.length > 20) err.project_code = "Max 20 characters.";
  if ((project.project_name ?? "").length > 60) err.project_name = "Max 60 characters.";
  if ((project.region_code ?? "").length > 4) err.region_code = "Max 4 characters.";
  if ((project.province_code ?? "").length > 4) err.province_code = "Max 4 characters.";
  if ((project.lot_type ?? "").length > 1) err.lot_type = "Max 1 character.";
  const totalArea = project.total_area != null ? Number(project.total_area) : null;
  if (totalArea != null && (totalArea < 0 || !Number.isFinite(totalArea))) err.total_area = "Must be ≥ 0.";
  const projectCost = project.project_cost != null ? Number(project.project_cost) : null;
  if (projectCost != null && (projectCost < 0 || !Number.isFinite(projectCost))) err.project_cost = "Must be ≥ 0.";
  const down = project.downpayment != null ? Number(project.downpayment) : null;
  if (down != null && (down < 0 || !Number.isFinite(down))) err.downpayment = "Must be ≥ 0.";
  const monthly = project.monthly_amortization != null ? Number(project.monthly_amortization) : null;
  if (monthly != null && (monthly < 0 || !Number.isFinite(monthly))) err.monthly_amortization = "Must be ≥ 0.";
  const rate = project.interest_rate != null ? Number(project.interest_rate) : null;
  if (rate != null && (!Number.isFinite(rate) || rate < 0 || rate > RATE_MAX)) err.interest_rate = `Must be 0–${RATE_MAX}.`;
  const selling = project.selling_price != null ? Number(project.selling_price) : null;
  if (selling != null && (selling < 0 || !Number.isFinite(selling))) err.selling_price = "Must be ≥ 0.";
  const terms = project.terms_yr != null ? Number(project.terms_yr) : null;
  if (terms != null && (!Number.isInteger(terms) || terms < 0 || terms > 99)) err.terms_yr = "Must be 0–99.";
  return err;
}

export function ProjectFormSlideOver({
  open,
  project,
  isEdit,
  programs,
  onClose,
  onSave,
  onChange,
}: ProjectFormSlideOverProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  function update(field: keyof Project, value: string | number | null) {
    onChange({ ...project, [field]: value });
    if (errors[field as string]) setErrors((e) => ({ ...e, [field as string]: "" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateProject(project, isEdit);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave(project);
  }

  const inputClass = (field: string) =>
    `mt-1 w-full rounded-md border bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] disabled:opacity-60 ${errors[field] ? "border-red-500" : "border-[var(--border-subtle)]"}`;

  return (
    <div
      className="fixed inset-0 z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="slide-over-title"
    >
      <div className="absolute inset-0 bg-black/30" aria-hidden onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex w-full flex-col bg-[var(--background)] shadow-xl sm:max-w-lg">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4">
          <h2 id="slide-over-title" className="text-lg font-semibold text-[var(--foreground)]">
            {isEdit ? "Edit project" : "New project"}
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
            {/* Basic info */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                <FolderIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                Basic info
              </h3>
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="project_code" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                    <TagIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    Project code
                  </label>
                  <input
                    id="project_code"
                    type="text"
                    value={project.project_code ?? ""}
                    onChange={(e) => update("project_code", e.target.value)}
                    disabled={isEdit}
                    maxLength={20}
                    className={inputClass("project_code")}
                  />
                  {errors.project_code && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.project_code}</p>}
                </div>
                <div>
                  <label htmlFor="project_name" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                    <DocumentTextIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    Project name
                  </label>
                  <input
                    id="project_name"
                    type="text"
                    value={project.project_name ?? ""}
                    onChange={(e) => update("project_name", e.target.value)}
                    maxLength={60}
                    className={inputClass("project_name")}
                  />
                  {errors.project_name && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.project_name}</p>}
                </div>
                <div>
                  <label htmlFor="project_prog_id" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                    <DocumentTextIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    Program
                  </label>
                  <select
                    id="project_prog_id"
                    value={project.project_prog_id ?? ""}
                    onChange={(e) =>
                      update("project_prog_id", e.target.value === "" ? null : Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  >
                    <option value="">None</option>
                    {programs.map((prog) => (
                      <option key={prog.project_prog_id} value={prog.project_prog_id}>
                        {prog.mc_ref || `Program ${prog.project_prog_id}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="lot_type" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                    <TagIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    Lot type
                  </label>
                  <input
                    id="lot_type"
                    type="text"
                    value={project.lot_type ?? ""}
                    onChange={(e) => update("lot_type", e.target.value)}
                    maxLength={1}
                    className={inputClass("lot_type")}
                  />
                  {errors.lot_type && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.lot_type}</p>}
                </div>
              </div>
            </section>

            {/* Location */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                <MapPinIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                Location
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="region_code" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                    <MapPinIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    Region code
                  </label>
                  <input
                    id="region_code"
                    type="text"
                    value={project.region_code ?? ""}
                    onChange={(e) => update("region_code", e.target.value)}
                    maxLength={4}
                    className={inputClass("region_code")}
                  />
                  {errors.region_code && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.region_code}</p>}
                </div>
                <div>
                  <label htmlFor="province_code" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                    <MapPinIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    Province code
                  </label>
                  <input
                    id="province_code"
                    type="text"
                    value={project.province_code ?? ""}
                    onChange={(e) => update("province_code", e.target.value)}
                    maxLength={4}
                    className={inputClass("province_code")}
                  />
                  {errors.province_code && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.province_code}</p>}
                </div>
              </div>
            </section>

            {/* Financial */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                <BanknotesIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                Financial
              </h3>
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="total_area" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                    <CubeIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    Total area
                  </label>
                  <input
                    id="total_area"
                    type="number"
                    step="0.01"
                    value={project.total_area ?? ""}
                    onChange={(e) =>
                      update("total_area", e.target.value === "" ? null : Number(e.target.value))
                    }
                    className={inputClass("total_area")}
                  />
                  {errors.total_area && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.total_area}</p>}
                </div>
                <div>
                  <label htmlFor="project_cost" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                    <CurrencyDollarIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    Project cost
                  </label>
                  <input
                    id="project_cost"
                    type="number"
                    step="0.01"
                    value={project.project_cost ?? ""}
                    onChange={(e) =>
                      update("project_cost", e.target.value === "" ? null : Number(e.target.value))
                    }
                    className={inputClass("project_cost")}
                  />
                  {errors.project_cost && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.project_cost}</p>}
                </div>
                <div>
                  <label htmlFor="downpayment" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                    <CurrencyDollarIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    Downpayment
                  </label>
                  <input
                    id="downpayment"
                    type="number"
                    step="0.01"
                    value={project.downpayment ?? ""}
                    onChange={(e) =>
                      update("downpayment", e.target.value === "" ? null : Number(e.target.value))
                    }
                    className={inputClass("downpayment")}
                  />
                  {errors.downpayment && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.downpayment}</p>}
                </div>
                <div>
                  <label htmlFor="monthly_amortization" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                    <CurrencyDollarIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    Monthly amortization
                  </label>
                  <input
                    id="monthly_amortization"
                    type="number"
                    step="0.01"
                    value={project.monthly_amortization ?? ""}
                    onChange={(e) =>
                      update(
                        "monthly_amortization",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    className={inputClass("monthly_amortization")}
                  />
                  {errors.monthly_amortization && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.monthly_amortization}</p>}
                </div>
                <div>
                  <label htmlFor="interest_rate" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                    <ChartBarIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    Interest rate
                  </label>
                  <input
                    id="interest_rate"
                    type="number"
                    step="0.0001"
                    value={project.interest_rate ?? ""}
                    onChange={(e) =>
                      update("interest_rate", e.target.value === "" ? null : Number(e.target.value))
                    }
                    className={inputClass("interest_rate")}
                  />
                  {errors.interest_rate && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.interest_rate}</p>}
                </div>
                <div>
                  <label htmlFor="selling_price" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                    <CurrencyDollarIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    Selling price
                  </label>
                  <input
                    id="selling_price"
                    type="number"
                    step="0.01"
                    value={project.selling_price ?? ""}
                    onChange={(e) =>
                      update("selling_price", e.target.value === "" ? null : Number(e.target.value))
                    }
                    className={inputClass("selling_price")}
                  />
                  {errors.selling_price && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.selling_price}</p>}
                </div>
                <div>
                  <label htmlFor="terms_yr" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                    <ClockIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                    Terms (years)
                  </label>
                  <input
                    id="terms_yr"
                    type="number"
                    min={0}
                    value={project.terms_yr ?? ""}
                    onChange={(e) =>
                      update("terms_yr", e.target.value === "" ? null : Number(e.target.value))
                    }
                    className={inputClass("terms_yr")}
                  />
                  {errors.terms_yr && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.terms_yr}</p>}
                </div>
              </div>
            </section>
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
