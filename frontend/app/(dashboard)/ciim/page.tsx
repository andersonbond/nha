"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  PlusIcon,
  BuildingStorefrontIcon,
  FunnelIcon,
  XMarkIcon,
  SparklesIcon,
  BanknotesIcon,
  ChartBarIcon,
  MapPinIcon,
  MapIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { MOCK_CIIM_UNITS } from "@/app/lib/mockData";
import type { CIIMUnit, CIIMUnitType } from "@/app/lib/mockData";

const SatelliteMap = dynamic(
  () => import("@/components/lot-management/SatelliteMap").then((m) => m.SatelliteMap),
  { ssr: false }
);

type CIIMFilters = {
  unit_code: string;
  unit_name: string;
  unit_type: string;
  region_code: string;
  project_code: string;
};

function formatMoney(n: number): string {
  if (n >= 1e9) return `₱${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `₱${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `₱${(n / 1e3).toFixed(0)}k`;
  return `₱${n.toLocaleString()}`;
}

function formatUnitType(t: CIIMUnitType): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function filterUnits(units: CIIMUnit[], f: CIIMFilters): CIIMUnit[] {
  let out = units;
  const code = f.unit_code.trim().toLowerCase();
  if (code) out = out.filter((u) => (u.unit_code ?? "").toLowerCase().includes(code));
  const name = f.unit_name.trim().toLowerCase();
  if (name) out = out.filter((u) => (u.unit_name ?? "").toLowerCase().includes(name));
  if (f.unit_type.trim()) out = out.filter((u) => u.unit_type === f.unit_type.trim());
  if (f.region_code.trim()) out = out.filter((u) => (u.region_code ?? "").trim() === f.region_code.trim());
  const proj = f.project_code.trim().toLowerCase();
  if (proj) {
    out = out.filter(
      (u) =>
        (u.project_code ?? "").toLowerCase().includes(proj) ||
        (u.project_name ?? "").toLowerCase().includes(proj)
    );
  }
  return out;
}

const UNIT_TYPES = [
  { value: "", label: "All" },
  { value: "commercial", label: "Commercial" },
  { value: "institutional", label: "Institutional" },
  { value: "industrial", label: "Industrial" },
  { value: "mixed-use", label: "Mixed-use" },
];

const emptyFilters: CIIMFilters = {
  unit_code: "",
  unit_name: "",
  unit_type: "",
  region_code: "",
  project_code: "",
};

export default function CIIMPage() {
  const [filterValues, setFilterValues] = useState<CIIMFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<CIIMFilters>(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterPopoverRef = useRef<HTMLDivElement>(null);

  const filteredUnits = useMemo(
    () => filterUnits(MOCK_CIIM_UNITS, appliedFilters),
    [appliedFilters]
  );
  const totalValue = useMemo(
    () => filteredUnits.reduce((s, u) => s + (u.total_value != null ? Number(u.total_value) : 0), 0),
    [filteredUnits]
  );
  const byTypeCount = useMemo(() => {
    const map: Record<string, number> = {};
    filteredUnits.forEach((u) => {
      const t = u.unit_type || "other";
      map[t] = (map[t] || 0) + 1;
    });
    return map;
  }, [filteredUnits]);
  const uniqueProjects = useMemo(
    () => new Set(filteredUnits.map((u) => u.project_code).filter(Boolean)).size,
    [filteredUnits]
  );

  function clearFilters() {
    setFilterValues(emptyFilters);
    setAppliedFilters(emptyFilters);
  }

  function applyAndClose() {
    setAppliedFilters({ ...filterValues });
    setFilterOpen(false);
  }

  useEffect(() => {
    if (!filterOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        filterPopoverRef.current &&
        !filterPopoverRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("[data-filter-trigger]")
      ) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  const hasActiveFilters = (
    Object.keys(emptyFilters) as (keyof CIIMFilters)[]
  ).some((k) => appliedFilters[k]?.trim());
  const activeFilterCount = (
    Object.keys(emptyFilters) as (keyof CIIMFilters)[]
  ).filter((k) => appliedFilters[k]?.trim()).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-[var(--foreground)]">
            <BuildingStorefrontIcon className="h-7 w-7 shrink-0 text-primary" aria-hidden />
            CIIM
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/70">
            Commercial, Institutional, Industrial, and Mixed-use units. Coming in MVP 3.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-filter-trigger
            onClick={() => setFilterOpen((o) => !o)}
            className="relative inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-sm hover:border-[var(--foreground)]/20 hover:bg-black/5 dark:hover:bg-white/10 sm:min-h-0"
            aria-label={filterOpen ? "Close filter" : "Open filter"}
            aria-expanded={filterOpen}
          >
            <FunnelIcon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[var(--background)] sm:min-h-0 sm:min-w-0 sm:w-auto"
          >
            <PlusIcon className="h-5 w-5 shrink-0" aria-hidden />
            Add unit
          </button>
        </div>
      </div>

      {/* Filter popover */}
      {filterOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" aria-hidden />
          <div
            ref={filterPopoverRef}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] p-5 shadow-xl"
            role="dialog"
            aria-labelledby="ciim-filter-popover-title"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="ciim-filter-popover-title" className="text-base font-semibold text-[var(--foreground)]">
                Filter CIIM units
              </h2>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="rounded p-1.5 text-[var(--foreground)]/70 hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="ciim-filter-unit_code" className="block text-xs font-medium text-[var(--foreground)]/80">
                  Unit code
                </label>
                <input
                  id="ciim-filter-unit_code"
                  type="text"
                  value={filterValues.unit_code}
                  onChange={(e) => setFilterValues((f) => ({ ...f, unit_code: e.target.value }))}
                  placeholder="Filter..."
                  className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]"
                />
              </div>
              <div>
                <label htmlFor="ciim-filter-unit_name" className="block text-xs font-medium text-[var(--foreground)]/80">
                  Unit name
                </label>
                <input
                  id="ciim-filter-unit_name"
                  type="text"
                  value={filterValues.unit_name}
                  onChange={(e) => setFilterValues((f) => ({ ...f, unit_name: e.target.value }))}
                  placeholder="Filter..."
                  className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="ciim-filter-unit_type" className="block text-xs font-medium text-[var(--foreground)]/80">
                  Unit type
                </label>
                <select
                  id="ciim-filter-unit_type"
                  value={filterValues.unit_type}
                  onChange={(e) => setFilterValues((f) => ({ ...f, unit_type: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]"
                >
                  {UNIT_TYPES.map((opt) => (
                    <option key={opt.value || "all"} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ciim-filter-region_code" className="block text-xs font-medium text-[var(--foreground)]/80">
                  Region
                </label>
                <input
                  id="ciim-filter-region_code"
                  type="text"
                  value={filterValues.region_code}
                  onChange={(e) => setFilterValues((f) => ({ ...f, region_code: e.target.value }))}
                  placeholder="e.g. 04"
                  maxLength={4}
                  className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]"
                />
              </div>
              <div>
                <label htmlFor="ciim-filter-project_code" className="block text-xs font-medium text-[var(--foreground)]/80">
                  Project
                </label>
                <input
                  id="ciim-filter-project_code"
                  type="text"
                  value={filterValues.project_code}
                  onChange={(e) => setFilterValues((f) => ({ ...f, project_code: e.target.value }))}
                  placeholder="Filter..."
                  className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={applyAndClose}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}

      {/* Map + content two-column layout — map emphasized (wider + taller) */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)]">
        {/* Map card — primary focus */}
        <div className="flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] overflow-hidden shadow-subtle dark:shadow-subtle-dark">
          <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-4 py-2.5">
            <MapIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span className="text-sm font-semibold text-[var(--foreground)]">Satellite map</span>
          </div>
          <div className="relative min-h-[320px] sm:min-h-[420px] [&_.leaflet-container]:z-0">
            <SatelliteMap height={420} className="w-full" />
          </div>
          <p className="px-4 py-1.5 text-xs text-[var(--foreground)]/50">
            ESRI World Imagery · Mapbox in MVP 2
          </p>
        </div>

        {/* Right panel: Quick insights + Unit list */}
        <div className="flex flex-col gap-5 min-h-0">
          {/* Quick insights — compact */}
          <section
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark shrink-0"
            aria-label="Quick insights"
          >
            <div className="mb-3 flex items-center gap-2">
              <SparklesIcon className="h-4 w-4 text-primary" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/70">
                Quick insights
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/80 px-3 py-2">
                <BuildingStorefrontIcon className="h-4 w-4 text-primary/80" aria-hidden />
                <span className="text-xs text-[var(--foreground)]/70">Units</span>
                <span className="text-sm font-semibold text-[var(--foreground)]">{filteredUnits.length.toLocaleString()}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/80 px-3 py-2">
                <BanknotesIcon className="h-4 w-4 text-primary/80" aria-hidden />
                <span className="text-xs text-[var(--foreground)]/70">Total value</span>
                <span className="text-sm font-semibold text-[var(--foreground)]">{totalValue ? formatMoney(totalValue) : "—"}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/80 px-3 py-2">
                <ChartBarIcon className="h-4 w-4 text-primary/80" aria-hidden />
                <span className="text-xs text-[var(--foreground)]/70">By type</span>
                <span className="text-sm font-semibold text-[var(--foreground)]">
                  {Object.keys(byTypeCount).length ? Object.entries(byTypeCount).map(([k, v]) => `${k}: ${v}`).join(", ") : "—"}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/80 px-3 py-2">
                <MapPinIcon className="h-4 w-4 text-primary/80" aria-hidden />
                <span className="text-xs text-[var(--foreground)]/70">Projects</span>
                <span className="text-sm font-semibold text-[var(--foreground)]">{uniqueProjects}</span>
              </div>
            </div>
          </section>

          {/* CIIM units table or empty state */}
          <div className="flex flex-1 flex-col min-h-[280px] sm:min-h-[320px] rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] overflow-hidden shadow-subtle dark:shadow-subtle-dark">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-2.5 shrink-0">
              <span className="text-sm font-semibold text-[var(--foreground)]">CIIM units</span>
              <span className="text-xs text-[var(--foreground)]/60">
                {filteredUnits.length} result{filteredUnits.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="flex-1 overflow-auto min-h-0">
      {filteredUnits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full border border-[var(--border-subtle)] p-3">
            <BuildingStorefrontIcon className="h-8 w-8 text-[var(--foreground)]/40" aria-hidden />
          </div>
          <p className="mt-3 text-sm font-medium text-[var(--foreground)]">
            No CIIM units yet
          </p>
          <p className="mt-1 text-xs text-[var(--foreground)]/60">
            {MOCK_CIIM_UNITS.length === 0 ? "Coming in MVP 3. Add your first unit to get started." : "No units match the current filters. Try clearing filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-subtle)]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Unit Code</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Unit Name</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Region</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Project</th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Value</th>
                <th scope="col" className="relative px-3 py-2"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredUnits.map((unit) => (
                <tr key={unit.unit_code} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                  <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-primary">{unit.unit_code}</td>
                  <td className="px-3 py-2 text-sm text-[var(--foreground)] truncate max-w-[120px]">{unit.unit_name ?? "—"}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-xs text-[var(--foreground)]/80">{formatUnitType(unit.unit_type)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right text-xs text-[var(--foreground)]/80">{unit.region_code ?? "—"}</td>
                  <td className="px-3 py-2 text-xs text-[var(--foreground)]/80 truncate max-w-[100px]">{unit.project_name ?? unit.project_code ?? "—"}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right text-xs text-[var(--foreground)]/80">{unit.total_value != null ? formatMoney(Number(unit.total_value)) : "—"}</td>
                  <td className="relative whitespace-nowrap px-3 py-2 text-right">
                    <div className="flex justify-end gap-0.5">
                      <button type="button" className="rounded p-1 text-[var(--foreground)]/50 cursor-not-allowed" aria-label={`Edit ${unit.unit_name}`} disabled title="Coming in MVP 3">
                        <PencilIcon className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" className="rounded p-1 text-[var(--foreground)]/50 cursor-not-allowed" aria-label={`Delete ${unit.unit_name}`} disabled title="Coming in MVP 3">
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
