"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  PlusIcon,
  BuildingOffice2Icon,
  FunnelIcon,
  XMarkIcon,
  SparklesIcon,
  MapPinIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { MOCK_LANDHOLDINGS } from "@/app/lib/mockData";
import type { Landholding } from "@/app/lib/mockData";

type LandholdingFilters = {
  parcel_no: string;
  owner_name: string;
  classification: string;
  region_code: string;
  province_code: string;
};

function formatDate(s: string | null | undefined): string {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return s;
  }
}

function formatArea(ha: number | null | undefined): string {
  if (ha == null) return "—";
  return `${Number(ha).toLocaleString()} ha`;
}

function filterLandholdings(list: Landholding[], f: LandholdingFilters): Landholding[] {
  let out = list;
  const parcel = f.parcel_no.trim().toLowerCase();
  if (parcel) out = out.filter((l) => (l.parcel_no ?? "").toLowerCase().includes(parcel));
  const owner = f.owner_name.trim().toLowerCase();
  if (owner) out = out.filter((l) => (l.owner_name ?? "").toLowerCase().includes(owner));
  if (f.classification.trim()) out = out.filter((l) => (l.classification ?? "").toLowerCase() === f.classification.trim().toLowerCase());
  if (f.region_code.trim()) out = out.filter((l) => (l.region_code ?? "").trim() === f.region_code.trim());
  if (f.province_code.trim()) out = out.filter((l) => (l.province_code ?? "").trim() === f.province_code.trim());
  return out;
}

const CLASSIFICATIONS = [
  { value: "", label: "All" },
  { value: "residential", label: "Residential" },
  { value: "agricultural", label: "Agricultural" },
  { value: "commercial", label: "Commercial" },
  { value: "institutional", label: "Institutional" },
  { value: "mixed", label: "Mixed" },
];

const emptyFilters: LandholdingFilters = {
  parcel_no: "",
  owner_name: "",
  classification: "",
  region_code: "",
  province_code: "",
};

export default function LandholdingsPage() {
  const [filterValues, setFilterValues] = useState<LandholdingFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<LandholdingFilters>(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterPopoverRef = useRef<HTMLDivElement>(null);

  const filteredLandholdings = useMemo(
    () => filterLandholdings(MOCK_LANDHOLDINGS, appliedFilters),
    [appliedFilters]
  );
  const totalAreaHa = useMemo(
    () => filteredLandholdings.reduce((s, l) => s + (l.area_ha != null ? Number(l.area_ha) : 0), 0),
    [filteredLandholdings]
  );
  const byClassification = useMemo(() => {
    const map: Record<string, number> = {};
    filteredLandholdings.forEach((l) => {
      const c = (l.classification ?? "other").toLowerCase();
      map[c] = (map[c] || 0) + 1;
    });
    return map;
  }, [filteredLandholdings]);
  const uniqueRegions = useMemo(
    () => new Set(filteredLandholdings.map((l) => l.region_code).filter(Boolean)).size,
    [filteredLandholdings]
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

  const hasActiveFilters = (Object.keys(emptyFilters) as (keyof LandholdingFilters)[]).some(
    (k) => appliedFilters[k]?.trim()
  );
  const activeFilterCount = (Object.keys(emptyFilters) as (keyof LandholdingFilters)[]).filter(
    (k) => appliedFilters[k]?.trim()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-[var(--foreground)]">
            <BuildingOffice2Icon className="h-7 w-7 shrink-0 text-primary" aria-hidden />
            Landholdings Inventory
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/70">
            Inventory of landholdings by owner, location, and classification. Coming in MVP 2.
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
            Add landholding
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
            aria-labelledby="landholdings-filter-popover-title"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="landholdings-filter-popover-title" className="text-base font-semibold text-[var(--foreground)]">
                Filter landholdings
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
                <label htmlFor="lh-filter-parcel_no" className="block text-xs font-medium text-[var(--foreground)]/80">
                  Parcel no.
                </label>
                <input
                  id="lh-filter-parcel_no"
                  type="text"
                  value={filterValues.parcel_no}
                  onChange={(e) => setFilterValues((f) => ({ ...f, parcel_no: e.target.value }))}
                  placeholder="Filter..."
                  className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]"
                />
              </div>
              <div>
                <label htmlFor="lh-filter-owner_name" className="block text-xs font-medium text-[var(--foreground)]/80">
                  Owner
                </label>
                <input
                  id="lh-filter-owner_name"
                  type="text"
                  value={filterValues.owner_name}
                  onChange={(e) => setFilterValues((f) => ({ ...f, owner_name: e.target.value }))}
                  placeholder="Filter..."
                  className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="lh-filter-classification" className="block text-xs font-medium text-[var(--foreground)]/80">
                  Classification
                </label>
                <select
                  id="lh-filter-classification"
                  value={filterValues.classification}
                  onChange={(e) => setFilterValues((f) => ({ ...f, classification: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]"
                >
                  {CLASSIFICATIONS.map((opt) => (
                    <option key={opt.value || "all"} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="lh-filter-region_code" className="block text-xs font-medium text-[var(--foreground)]/80">
                  Region
                </label>
                <input
                  id="lh-filter-region_code"
                  type="text"
                  value={filterValues.region_code}
                  onChange={(e) => setFilterValues((f) => ({ ...f, region_code: e.target.value }))}
                  placeholder="e.g. 04"
                  maxLength={4}
                  className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]"
                />
              </div>
              <div>
                <label htmlFor="lh-filter-province_code" className="block text-xs font-medium text-[var(--foreground)]/80">
                  Province
                </label>
                <input
                  id="lh-filter-province_code"
                  type="text"
                  value={filterValues.province_code}
                  onChange={(e) => setFilterValues((f) => ({ ...f, province_code: e.target.value }))}
                  placeholder="e.g. 0401"
                  maxLength={4}
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

      {/* Quick insights */}
      <section
        className="rounded-xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--background)] to-[var(--background)]/95 p-4 shadow-subtle dark:shadow-subtle-dark"
        aria-label="Quick insights"
      >
        <div className="mb-3 flex items-center gap-2">
          <SparklesIcon className="h-4 w-4 text-primary" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/70">
            Quick insights
          </span>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/80 px-3 py-2">
            <BuildingOffice2Icon className="h-4 w-4 text-primary/80" aria-hidden />
            <span className="text-xs text-[var(--foreground)]/70">Landholdings</span>
            <span className="text-sm font-semibold text-[var(--foreground)]">{filteredLandholdings.length.toLocaleString()}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/80 px-3 py-2">
            <MapPinIcon className="h-4 w-4 text-primary/80" aria-hidden />
            <span className="text-xs text-[var(--foreground)]/70">Total area</span>
            <span className="text-sm font-semibold text-[var(--foreground)]">{totalAreaHa ? `${totalAreaHa.toLocaleString(undefined, { maximumFractionDigits: 1 })} ha` : "—"}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/80 px-3 py-2">
            <ChartBarIcon className="h-4 w-4 text-primary/80" aria-hidden />
            <span className="text-xs text-[var(--foreground)]/70">By classification</span>
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {Object.keys(byClassification).length ? Object.entries(byClassification).map(([k, v]) => `${k}: ${v}`).join(", ") : "—"}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/80 px-3 py-2">
            <DocumentTextIcon className="h-4 w-4 text-primary/80" aria-hidden />
            <span className="text-xs text-[var(--foreground)]/70">Regions</span>
            <span className="text-sm font-semibold text-[var(--foreground)]">{uniqueRegions}</span>
          </div>
        </div>
      </section>

      {/* Table or empty state */}
      {filteredLandholdings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] py-16 text-center shadow-subtle dark:shadow-subtle-dark">
          <div className="rounded-full border border-[var(--border-subtle)] p-4">
            <BuildingOffice2Icon className="h-10 w-10 text-[var(--foreground)]/40" aria-hidden />
          </div>
          <p className="mt-4 text-sm font-medium text-[var(--foreground)]">
            No landholdings yet
          </p>
          <p className="mt-1 text-sm text-[var(--foreground)]/60">
            {MOCK_LANDHOLDINGS.length === 0 ? "Coming in MVP 2. Add your first landholding to get started." : "No landholdings match the current filters. Try clearing filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] shadow-subtle dark:shadow-subtle-dark">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border-subtle)]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50">
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Parcel No.</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Owner</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Region</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Province</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Classification</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Area (ha)</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Created</th>
                  <th scope="col" className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredLandholdings.map((lh) => (
                  <tr key={lh.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-primary">{lh.parcel_no}</td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground)]">{lh.owner_name ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-[var(--foreground)]/80">{lh.region_code ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-[var(--foreground)]/80">{lh.province_code ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--foreground)]/80 capitalize">{(lh.classification ?? "—").charAt(0).toUpperCase() + (lh.classification ?? "").slice(1)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-[var(--foreground)]/80">{formatArea(lh.area_ha)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--foreground)]/80">{(lh.status ?? "—").charAt(0).toUpperCase() + (lh.status ?? "").slice(1)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--foreground)]/80">{formatDate(lh.created_at)}</td>
                    <td className="relative whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button type="button" className="rounded p-1.5 text-[var(--foreground)]/50 cursor-not-allowed" aria-label={`Edit ${lh.parcel_no}`} disabled title="Coming in MVP 2">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button type="button" className="rounded p-1.5 text-[var(--foreground)]/50 cursor-not-allowed" aria-label={`Delete ${lh.parcel_no}`} disabled title="Coming in MVP 2">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
