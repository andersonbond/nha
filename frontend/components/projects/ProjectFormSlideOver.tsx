"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Project } from "./types";

type ProjectFormSlideOverProps = {
  open: boolean;
  project: Project;
  isEdit: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  onChange: (project: Project) => void;
};

export function ProjectFormSlideOver({
  open,
  project,
  isEdit,
  onClose,
  onSave,
  onChange,
}: ProjectFormSlideOverProps) {
  if (!open) return null;

  function update(field: keyof Project, value: string | number | null) {
    onChange({ ...project, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(project);
  }

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
            className="rounded p-2 text-[var(--foreground)]/70 hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="space-y-6 px-6 py-4">
            {/* Basic info */}
            <section>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Basic info
              </h3>
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="project_code" className="block text-sm font-medium text-[var(--foreground)]/80">
                    Project code
                  </label>
                  <input
                    id="project_code"
                    type="text"
                    value={project.project_code}
                    onChange={(e) => update("project_code", e.target.value)}
                    disabled={isEdit}
                    maxLength={20}
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] disabled:opacity-60"
                  />
                </div>
                <div>
                  <label htmlFor="project_name" className="block text-sm font-medium text-[var(--foreground)]/80">
                    Project name
                  </label>
                  <input
                    id="project_name"
                    type="text"
                    value={project.project_name}
                    onChange={(e) => update("project_name", e.target.value)}
                    maxLength={60}
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label htmlFor="lot_type" className="block text-sm font-medium text-[var(--foreground)]/80">
                    Lot type
                  </label>
                  <input
                    id="lot_type"
                    type="text"
                    value={project.lot_type}
                    onChange={(e) => update("lot_type", e.target.value)}
                    maxLength={1}
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label htmlFor="inp_date" className="block text-sm font-medium text-[var(--foreground)]/80">
                    Input date
                  </label>
                  <input
                    id="inp_date"
                    type="date"
                    value={project.inp_date}
                    onChange={(e) => update("inp_date", e.target.value)}
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  />
                </div>
              </div>
            </section>

            {/* Location */}
            <section>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Location
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="region_code" className="block text-sm font-medium text-[var(--foreground)]/80">
                    Region code
                  </label>
                  <input
                    id="region_code"
                    type="text"
                    value={project.region_code}
                    onChange={(e) => update("region_code", e.target.value)}
                    maxLength={4}
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label htmlFor="province_code" className="block text-sm font-medium text-[var(--foreground)]/80">
                    Province code
                  </label>
                  <input
                    id="province_code"
                    type="text"
                    value={project.province_code}
                    onChange={(e) => update("province_code", e.target.value)}
                    maxLength={4}
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  />
                </div>
              </div>
            </section>

            {/* Financial */}
            <section>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Financial
              </h3>
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="total_area" className="block text-sm font-medium text-[var(--foreground)]/80">
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
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label htmlFor="project_cost" className="block text-sm font-medium text-[var(--foreground)]/80">
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
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label htmlFor="downpayment" className="block text-sm font-medium text-[var(--foreground)]/80">
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
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label htmlFor="monthly_amortization" className="block text-sm font-medium text-[var(--foreground)]/80">
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
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label htmlFor="interest_rate" className="block text-sm font-medium text-[var(--foreground)]/80">
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
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label htmlFor="selling_price" className="block text-sm font-medium text-[var(--foreground)]/80">
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
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label htmlFor="terms_yr" className="block text-sm font-medium text-[var(--foreground)]/80">
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
                    className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  />
                </div>
              </div>
            </section>
          </div>
          <div className="mt-auto flex justify-end gap-3 border-t border-[var(--border-subtle)] px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[var(--border-subtle)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[var(--background)]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
