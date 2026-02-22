"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Application } from "./types";

type ApplicationFormSlideOverProps = {
  open: boolean;
  application: Application;
  isEdit: boolean;
  onClose: () => void;
  onSave: (application: Application) => void;
  onChange: (application: Application) => void;
};

const MAX = {
  prequalification_no: 255,
  origin: 255,
  indicator: 255,
  tenurial_code: 64,
  application_type: 64,
  last_name: 255,
  first_name: 255,
  middle_name: 255,
  sex: 32,
  civil_status: 64,
  valid_id_type: 64,
} as const;

function validateApplication(application: Application): Record<string, string> {
  const err: Record<string, string> = {};
  Object.entries(MAX).forEach(([key, max]) => {
    const val = (application as Record<string, unknown>)[key];
    if (typeof val === "string" && val.length > max) (err as Record<string, string>)[key] = `Max ${max} characters.`;
  });
  return err;
}

export function ApplicationFormSlideOver({
  open,
  application,
  isEdit,
  onClose,
  onSave,
  onChange,
}: ApplicationFormSlideOverProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  function update(field: keyof Application, value: string | null) {
    onChange({ ...application, [field]: value });
    if (errors[field as string]) setErrors((e) => ({ ...e, [field as string]: "" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateApplication(application);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave(application);
  }

  const inputClass = (field: string) =>
    `mt-1 w-full rounded-md border bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] ${errors[field] ? "border-red-500" : "border-[var(--border-subtle)]"}`;

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog" aria-labelledby="application-slide-over-title">
      <div className="absolute inset-0 bg-black/30" aria-hidden onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex w-full flex-col bg-[var(--background)] shadow-xl sm:max-w-lg">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4">
          <h2 id="application-slide-over-title" className="text-lg font-semibold text-[var(--foreground)]">
            {isEdit ? "Edit application" : "New application"}
          </h2>
          <button type="button" onClick={onClose} className="min-h-[44px] min-w-[44px] rounded p-2 text-[var(--foreground)]/70 hover:bg-black/5 dark:hover:bg-white/10 sm:min-h-0 sm:min-w-0" aria-label="Close">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="space-y-6 px-6 py-4">
            <section>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Basic info</h3>
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="app_prequalification_no" className="block text-sm font-medium text-[var(--foreground)]/80">Prequalification No</label>
                  <input id="app_prequalification_no" type="text" value={application.prequalification_no ?? ""} onChange={(e) => update("prequalification_no", e.target.value)} maxLength={MAX.prequalification_no} className={inputClass("prequalification_no")} />
                  {errors.prequalification_no && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.prequalification_no}</p>}
                </div>
                <div>
                  <label htmlFor="app_origin" className="block text-sm font-medium text-[var(--foreground)]/80">Origin</label>
                  <input id="app_origin" type="text" value={application.origin ?? ""} onChange={(e) => update("origin", e.target.value)} maxLength={MAX.origin} className={inputClass("origin")} />
                  {errors.origin && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.origin}</p>}
                </div>
                <div>
                  <label htmlFor="app_indicator" className="block text-sm font-medium text-[var(--foreground)]/80">Indicator</label>
                  <input id="app_indicator" type="text" value={application.indicator ?? ""} onChange={(e) => update("indicator", e.target.value)} maxLength={MAX.indicator} className={inputClass("indicator")} />
                  {errors.indicator && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.indicator}</p>}
                </div>
                <div>
                  <label htmlFor="app_tenurial_code" className="block text-sm font-medium text-[var(--foreground)]/80">Tenurial code</label>
                  <input id="app_tenurial_code" type="text" value={application.tenurial_code ?? ""} onChange={(e) => update("tenurial_code", e.target.value)} maxLength={MAX.tenurial_code} className={inputClass("tenurial_code")} />
                  {errors.tenurial_code && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.tenurial_code}</p>}
                </div>
                <div>
                  <label htmlFor="app_application_type" className="block text-sm font-medium text-[var(--foreground)]/80">Application type</label>
                  <input id="app_application_type" type="text" value={application.application_type ?? ""} onChange={(e) => update("application_type", e.target.value)} maxLength={MAX.application_type} className={inputClass("application_type")} />
                  {errors.application_type && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.application_type}</p>}
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Personal</h3>
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="app_last_name" className="block text-sm font-medium text-[var(--foreground)]/80">Last name</label>
                    <input id="app_last_name" type="text" value={application.last_name ?? ""} onChange={(e) => update("last_name", e.target.value)} maxLength={MAX.last_name} className={inputClass("last_name")} />
                    {errors.last_name && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.last_name}</p>}
                  </div>
                  <div>
                    <label htmlFor="app_first_name" className="block text-sm font-medium text-[var(--foreground)]/80">First name</label>
                    <input id="app_first_name" type="text" value={application.first_name ?? ""} onChange={(e) => update("first_name", e.target.value)} maxLength={MAX.first_name} className={inputClass("first_name")} />
                    {errors.first_name && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.first_name}</p>}
                  </div>
                  <div>
                    <label htmlFor="app_middle_name" className="block text-sm font-medium text-[var(--foreground)]/80">Middle name</label>
                    <input id="app_middle_name" type="text" value={application.middle_name ?? ""} onChange={(e) => update("middle_name", e.target.value)} maxLength={MAX.middle_name} className={inputClass("middle_name")} />
                    {errors.middle_name && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.middle_name}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="app_birth_date" className="block text-sm font-medium text-[var(--foreground)]/80">Birth date</label>
                  <input id="app_birth_date" type="date" value={application.birth_date ?? ""} onChange={(e) => update("birth_date", e.target.value || null)} className={inputClass("birth_date")} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="app_sex" className="block text-sm font-medium text-[var(--foreground)]/80">Sex</label>
                    <input id="app_sex" type="text" value={application.sex ?? ""} onChange={(e) => update("sex", e.target.value)} maxLength={MAX.sex} className={inputClass("sex")} />
                    {errors.sex && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.sex}</p>}
                  </div>
                  <div>
                    <label htmlFor="app_civil_status" className="block text-sm font-medium text-[var(--foreground)]/80">Civil status</label>
                    <input id="app_civil_status" type="text" value={application.civil_status ?? ""} onChange={(e) => update("civil_status", e.target.value)} maxLength={MAX.civil_status} className={inputClass("civil_status")} />
                    {errors.civil_status && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.civil_status}</p>}
                  </div>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Address</h3>
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="app_current_addr" className="block text-sm font-medium text-[var(--foreground)]/80">Current address</label>
                  <textarea id="app_current_addr" rows={2} value={application.current_addr ?? ""} onChange={(e) => update("current_addr", e.target.value)} className={inputClass("current_addr")} />
                </div>
                <div>
                  <label htmlFor="app_address" className="block text-sm font-medium text-[var(--foreground)]/80">Address</label>
                  <textarea id="app_address" rows={2} value={application.address ?? ""} onChange={(e) => update("address", e.target.value)} className={inputClass("address")} />
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Valid ID</h3>
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="app_valid_id_type" className="block text-sm font-medium text-[var(--foreground)]/80">Valid ID type</label>
                  <input id="app_valid_id_type" type="text" value={application.valid_id_type ?? ""} onChange={(e) => update("valid_id_type", e.target.value)} maxLength={MAX.valid_id_type} className={inputClass("valid_id_type")} />
                  {errors.valid_id_type && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.valid_id_type}</p>}
                </div>
                <div>
                  <label htmlFor="app_valid_id_image" className="block text-sm font-medium text-[var(--foreground)]/80">Valid ID image (URL or data)</label>
                  <textarea id="app_valid_id_image" rows={2} value={application.valid_id_image ?? ""} onChange={(e) => update("valid_id_image", e.target.value)} className={inputClass("valid_id_image")} />
                </div>
              </div>
            </section>
          </div>
          <div className="mt-auto flex justify-end gap-3 border-t border-[var(--border-subtle)] px-6 py-4">
            <button type="button" onClick={onClose} className="min-h-[44px] rounded-md border border-[var(--border-subtle)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 sm:min-h-0">
              Cancel
            </button>
            <button type="submit" className="min-h-[44px] rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[var(--background)] sm:min-h-0">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
