"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PhilippineAddressSelect } from "@/components/address/PhilippineAddressSelect";
import type { Beneficiary } from "./types";

type BeneficiaryFormSlideOverProps = {
  open: boolean;
  beneficiary: Beneficiary;
  isEdit: boolean;
  onClose: () => void;
  onSave: (beneficiary: Beneficiary) => void;
  onChange: (beneficiary: Beneficiary) => void;
};

const MAX = {
  bin: 9,
  app_id: 10,
  last_name: 25,
  first_name: 25,
  middle_name: 25,
  sex: 32,
  civil_status: 64,
  membership_code: 1,
  old_common_code: 20,
  common_code: 20,
  act_tag: 1,
  indicator: 1,
  ssp: 1,
  category: 10,
} as const;

const SEX_OPTIONS = ["", "Male", "Female"];
const CIVIL_STATUS_OPTIONS = ["", "Single", "Married", "Widowed", "Separated", "Divorced", "Legally Separated", "Annulled", "Common Law"];

function normalizeSexForSelect(value: string | null | undefined): string {
  if (!value) return "";
  const v = value.trim();
  if (v === "M" || v === "Male") return "Male";
  if (v === "F" || v === "Female") return "Female";
  return v;
}

function validateBeneficiary(b: Beneficiary): Record<string, string> {
  const err: Record<string, string> = {};
  Object.entries(MAX).forEach(([key, max]) => {
    const val = (b as Record<string, unknown>)[key];
    if (typeof val === "string" && val.length > max) err[key] = `Max ${max} characters.`;
  });
  return err;
}

export function BeneficiaryFormSlideOver({
  open,
  beneficiary,
  isEdit,
  onClose,
  onSave,
  onChange,
}: BeneficiaryFormSlideOverProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  function update(field: keyof Beneficiary, value: string | null) {
    onChange({ ...beneficiary, [field]: value });
    if (errors[field as string]) setErrors((e) => ({ ...e, [field as string]: "" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateBeneficiary(beneficiary);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave(beneficiary);
  }

  const inputClass = (field: string) =>
    `mt-1 w-full rounded-md border bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] ${errors[field] ? "border-red-500" : "border-[var(--border-subtle)]"}`;

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog" aria-labelledby="beneficiary-slide-over-title">
      <div className="absolute inset-0 bg-black/30" aria-hidden onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex w-full flex-col bg-[var(--background)] shadow-xl sm:max-w-lg">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4">
          <h2 id="beneficiary-slide-over-title" className="text-lg font-semibold text-[var(--foreground)]">
            {isEdit ? "Edit beneficiary" : "New beneficiary"}
          </h2>
          <button type="button" onClick={onClose} className="min-h-[44px] min-w-[44px] rounded p-2 text-[var(--foreground)]/70 hover:bg-black/5 dark:hover:bg-white/10 sm:min-h-0 sm:min-w-0" aria-label="Close">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="space-y-6 px-6 py-4">
            <section>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Identification</h3>
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="ben_bin" className="block text-sm font-medium text-[var(--foreground)]/80">BIN</label>
                  <input id="ben_bin" type="text" value={beneficiary.bin ?? ""} onChange={(e) => update("bin", e.target.value)} maxLength={MAX.bin} className={inputClass("bin")} />
                  {errors.bin && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.bin}</p>}
                </div>
                <div>
                  <label htmlFor="ben_app_id" className="block text-sm font-medium text-[var(--foreground)]/80">App ID</label>
                  <input id="ben_app_id" type="text" value={beneficiary.app_id ?? ""} onChange={(e) => update("app_id", e.target.value)} maxLength={MAX.app_id} className={inputClass("app_id")} />
                  {errors.app_id && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.app_id}</p>}
                </div>
                <div>
                  <label htmlFor="ben_common_code" className="block text-sm font-medium text-[var(--foreground)]/80">Common code</label>
                  <input id="ben_common_code" type="text" value={beneficiary.common_code ?? ""} onChange={(e) => update("common_code", e.target.value)} maxLength={MAX.common_code} className={inputClass("common_code")} />
                  {errors.common_code && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.common_code}</p>}
                </div>
                <div>
                  <label htmlFor="ben_old_common_code" className="block text-sm font-medium text-[var(--foreground)]/80">Old common code</label>
                  <input id="ben_old_common_code" type="text" value={beneficiary.old_common_code ?? ""} onChange={(e) => update("old_common_code", e.target.value)} maxLength={MAX.old_common_code} className={inputClass("old_common_code")} />
                </div>
                <div>
                  <label htmlFor="ben_category" className="block text-sm font-medium text-[var(--foreground)]/80">Category</label>
                  <input id="ben_category" type="text" value={beneficiary.category ?? ""} onChange={(e) => update("category", e.target.value)} maxLength={MAX.category} className={inputClass("category")} />
                  {errors.category && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.category}</p>}
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Personal</h3>
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="ben_last_name" className="block text-sm font-medium text-[var(--foreground)]/80">Last name</label>
                    <input id="ben_last_name" type="text" value={beneficiary.last_name ?? ""} onChange={(e) => update("last_name", e.target.value)} maxLength={MAX.last_name} className={inputClass("last_name")} />
                    {errors.last_name && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.last_name}</p>}
                  </div>
                  <div>
                    <label htmlFor="ben_first_name" className="block text-sm font-medium text-[var(--foreground)]/80">First name</label>
                    <input id="ben_first_name" type="text" value={beneficiary.first_name ?? ""} onChange={(e) => update("first_name", e.target.value)} maxLength={MAX.first_name} className={inputClass("first_name")} />
                    {errors.first_name && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.first_name}</p>}
                  </div>
                  <div>
                    <label htmlFor="ben_middle_name" className="block text-sm font-medium text-[var(--foreground)]/80">Middle name</label>
                    <input id="ben_middle_name" type="text" value={beneficiary.middle_name ?? ""} onChange={(e) => update("middle_name", e.target.value)} maxLength={MAX.middle_name} className={inputClass("middle_name")} />
                    {errors.middle_name && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.middle_name}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="ben_birth_date" className="block text-sm font-medium text-[var(--foreground)]/80">Birth date</label>
                  <input id="ben_birth_date" type="date" value={beneficiary.birth_date ?? ""} onChange={(e) => update("birth_date", e.target.value || null)} className={inputClass("birth_date")} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="ben_sex" className="block text-sm font-medium text-[var(--foreground)]/80">Sex</label>
                    <select id="ben_sex" value={normalizeSexForSelect(beneficiary.sex)} onChange={(e) => update("sex", e.target.value || null)} className={inputClass("sex")}>
                      {SEX_OPTIONS.map((opt) => (
                        <option key={opt || "_blank"} value={opt}>{opt || "— Select —"}</option>
                      ))}
                    </select>
                    {errors.sex && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.sex}</p>}
                  </div>
                  <div>
                    <label htmlFor="ben_civil_status" className="block text-sm font-medium text-[var(--foreground)]/80">Civil status</label>
                    <select id="ben_civil_status" value={beneficiary.civil_status ?? ""} onChange={(e) => update("civil_status", e.target.value || null)} className={inputClass("civil_status")}>
                      {CIVIL_STATUS_OPTIONS.map((opt) => (
                        <option key={opt || "_blank"} value={opt}>{opt || "— Select —"}</option>
                      ))}
                    </select>
                    {errors.civil_status && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{errors.civil_status}</p>}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-[var(--foreground)]/80">Address</h4>
                  <PhilippineAddressSelect
                    value={{
                      region_code: beneficiary.region_code ?? "",
                      province_code: beneficiary.province_code ?? "",
                      municipal_code: beneficiary.municipal_code ?? "",
                      barangay_code: beneficiary.barangay_code ?? "",
                      district_code: beneficiary.district_code ?? "",
                    }}
                    onChange={(addr) => {
                      onChange({
                        ...beneficiary,
                        region_code: addr.region_code || null,
                        province_code: addr.province_code || null,
                        municipal_code: addr.municipal_code || null,
                        barangay_code: addr.barangay_code || null,
                        district_code: addr.district_code || null,
                      });
                    }}
                  />
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Other</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ben_membership_code" className="block text-sm font-medium text-[var(--foreground)]/80">Membership code</label>
                  <input id="ben_membership_code" type="text" value={beneficiary.membership_code ?? ""} onChange={(e) => update("membership_code", e.target.value)} maxLength={MAX.membership_code} className={inputClass("membership_code")} />
                </div>
                <div>
                  <label htmlFor="ben_inp_date" className="block text-sm font-medium text-[var(--foreground)]/80">Input date</label>
                  <input id="ben_inp_date" type="date" value={beneficiary.inp_date ?? ""} onChange={(e) => update("inp_date", e.target.value || null)} className={inputClass("inp_date")} />
                </div>
                <div>
                  <label htmlFor="ben_act_tag" className="block text-sm font-medium text-[var(--foreground)]/80">Act tag</label>
                  <input id="ben_act_tag" type="text" value={beneficiary.act_tag ?? ""} onChange={(e) => update("act_tag", e.target.value)} maxLength={MAX.act_tag} className={inputClass("act_tag")} />
                </div>
                <div>
                  <label htmlFor="ben_indicator" className="block text-sm font-medium text-[var(--foreground)]/80">Indicator</label>
                  <input id="ben_indicator" type="text" value={beneficiary.indicator ?? ""} onChange={(e) => update("indicator", e.target.value)} maxLength={MAX.indicator} className={inputClass("indicator")} />
                </div>
                <div>
                  <label htmlFor="ben_ssp" className="block text-sm font-medium text-[var(--foreground)]/80">SSP</label>
                  <input id="ben_ssp" type="text" value={beneficiary.ssp ?? ""} onChange={(e) => update("ssp", e.target.value)} maxLength={MAX.ssp} className={inputClass("ssp")} />
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
