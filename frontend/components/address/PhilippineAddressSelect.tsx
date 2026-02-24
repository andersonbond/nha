"use client";

import { useEffect, useState } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { apiFetch } from "@/app/lib/api";
import type { AddressOption, PhilippineAddressValue } from "./types";

type PhilippineAddressSelectProps = {
  value: PhilippineAddressValue;
  onChange: (value: PhilippineAddressValue) => void;
  showDistrictCode?: boolean;
  disabled?: boolean;
  error?: string;
};

const emptyValue: PhilippineAddressValue = {
  region_code: "",
  province_code: "",
  municipal_code: "",
  barangay_code: "",
  district_code: "",
};

export function PhilippineAddressSelect({
  value,
  onChange,
  showDistrictCode = false,
  disabled = false,
  error,
}: PhilippineAddressSelectProps) {
  const [regions, setRegions] = useState<AddressOption[]>([]);
  const [provinces, setProvinces] = useState<AddressOption[]>([]);
  const [municipalities, setMunicipalities] = useState<AddressOption[]>([]);
  const [barangays, setBarangays] = useState<AddressOption[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingRegions(true);
    apiFetch<AddressOption[]>("/address/regions")
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setRegions(data);
      })
      .catch(() => {
        if (!cancelled) setRegions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingRegions(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!value.region_code) {
      setProvinces([]);
      return;
    }
    let cancelled = false;
    setLoadingProvinces(true);
    apiFetch<AddressOption[]>(`/address/provinces?region_code=${encodeURIComponent(value.region_code)}`)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setProvinces(data);
      })
      .catch(() => {
        if (!cancelled) setProvinces([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingProvinces(false);
      });
    return () => {
      cancelled = true;
    };
  }, [value.region_code]);

  useEffect(() => {
    if (!value.province_code) {
      setMunicipalities([]);
      return;
    }
    let cancelled = false;
    setLoadingMunicipalities(true);
    apiFetch<AddressOption[]>(`/address/municipalities?province_code=${encodeURIComponent(value.province_code)}`)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setMunicipalities(data);
      })
      .catch(() => {
        if (!cancelled) setMunicipalities([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingMunicipalities(false);
      });
    return () => {
      cancelled = true;
    };
  }, [value.province_code]);

  useEffect(() => {
    if (!value.municipal_code) {
      setBarangays([]);
      return;
    }
    let cancelled = false;
    setLoadingBarangays(true);
    apiFetch<AddressOption[]>(`/address/barangays?municipal_code=${encodeURIComponent(value.municipal_code)}`)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setBarangays(data);
      })
      .catch(() => {
        if (!cancelled) setBarangays([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingBarangays(false);
      });
    return () => {
      cancelled = true;
    };
  }, [value.municipal_code]);

  function update(partial: Partial<PhilippineAddressValue>) {
    const next = { ...emptyValue, ...value, ...partial };
    if (partial.region_code !== undefined) {
      next.province_code = "";
      next.municipal_code = "";
      next.barangay_code = "";
    }
    if (partial.province_code !== undefined) {
      next.municipal_code = "";
      next.barangay_code = "";
    }
    if (partial.municipal_code !== undefined) {
      next.barangay_code = "";
    }
    onChange(next);
  }

  const selectClass =
    "mt-1 w-full rounded-md border bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] disabled:opacity-60 " +
    (error ? "border-red-500" : "border-[var(--border-subtle)]");

  return (
    <div className="space-y-3">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
          <MapPinIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
          Region
        </label>
        <select
          aria-label="Region"
          value={value.region_code}
          onChange={(e) => update({ region_code: e.target.value })}
          disabled={disabled || loadingRegions}
          className={selectClass}
        >
          <option value="">Select region</option>
          {regions.map((r) => (
            <option key={r.code} value={r.code}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]/80">Province</label>
        <select
          aria-label="Province"
          value={value.province_code}
          onChange={(e) => update({ province_code: e.target.value })}
          disabled={disabled || !value.region_code || loadingProvinces}
          className={selectClass}
        >
          <option value="">Select province</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]/80">Municipality</label>
        <select
          aria-label="Municipality"
          value={value.municipal_code}
          onChange={(e) => update({ municipal_code: e.target.value })}
          disabled={disabled || !value.province_code || loadingMunicipalities}
          className={selectClass}
        >
          <option value="">Select municipality</option>
          {municipalities.map((m) => (
            <option key={m.code} value={m.code}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)]/80">Barangay</label>
        <select
          aria-label="Barangay"
          value={value.barangay_code}
          onChange={(e) => update({ barangay_code: e.target.value })}
          disabled={disabled || !value.municipal_code || loadingBarangays}
          className={selectClass}
        >
          <option value="">Select barangay</option>
          {barangays.map((b) => (
            <option key={b.code} value={b.code}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      {showDistrictCode && (
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]/80">District code</label>
          <input
            type="text"
            aria-label="District code"
            value={value.district_code ?? ""}
            onChange={(e) => update({ district_code: e.target.value })}
            disabled={disabled}
            maxLength={2}
            className={selectClass}
          />
        </div>
      )}
      {error && <p className="text-xs text-red-600 dark:text-red-400" role="alert">{error}</p>}
    </div>
  );
}
