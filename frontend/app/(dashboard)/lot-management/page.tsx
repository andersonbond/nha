"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  MapPinIcon,
  DocumentCheckIcon,
  TagIcon,
  UserIcon,
  CalendarIcon,
  FunnelIcon,
  XMarkIcon,
  MapIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { apiFetch } from "@/app/lib/api";
import type { Lot } from "@/app/lib/mockData";
import { LotTable } from "@/components/lot-management/LotTable";

const SatelliteMap = dynamic(
  () => import("@/components/lot-management/SatelliteMap").then((m) => m.SatelliteMap),
  { ssr: false }
);

type LotManagementSection = "lots" | "lot-award";

const SECTIONS: {
  id: LotManagementSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    id: "lots",
    label: "Lots",
    icon: MapPinIcon,
    description: "Coming in MVP 2. Manage lots with list and map view (Mapbox).",
  },
  {
    id: "lot-award",
    label: "Lot Award",
    icon: DocumentCheckIcon,
    description: "Coming in MVP 2. Award lots to beneficiaries and track award status.",
  },
];

const LOT_STATUS_OPTIONS = [
  { value: "", label: "Select status" },
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "awarded", label: "Awarded" },
];

const AWARD_STATUS_OPTIONS = [
  { value: "", label: "Select status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "released", label: "Released" },
];

const inputClass =
  "w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40";

function hasActiveFilters(
  lotNumber: string,
  lotStatus: string,
  lotProject: string,
  lotBlock: string
) {
  return (
    lotNumber.trim() !== "" ||
    lotStatus !== "" ||
    lotProject.trim() !== "" ||
    lotBlock.trim() !== ""
  );
}

export default function LotManagementPage() {
  const [activeSection, setActiveSection] = useState<LotManagementSection>("lots");
  // Lots form (placeholder state)
  const [lotNumber, setLotNumber] = useState("");
  const [lotStatus, setLotStatus] = useState("");
  const [lotProject, setLotProject] = useState("");
  const [lotBlock, setLotBlock] = useState("");
  // Lot Award form (placeholder state)
  const [awardBeneficiary, setAwardBeneficiary] = useState("");
  const [awardLot, setAwardLot] = useState("");
  const [awardDate, setAwardDate] = useState("");
  const [awardStatus, setAwardStatus] = useState("");
  const [awardRemarks, setAwardRemarks] = useState("");

  const [lots, setLots] = useState<Lot[]>([]);
  const [lotsLoading, setLotsLoading] = useState(false);
  const lotsQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (lotNumber.trim()) params.set("lot_number", lotNumber.trim());
    if (lotStatus) params.set("status", lotStatus);
    if (lotProject.trim()) params.set("project_code", lotProject.trim());
    if (lotBlock.trim()) params.set("block", lotBlock.trim());
    const q = params.toString();
    return q ? `?${q}` : "";
  }, [lotNumber, lotStatus, lotProject, lotBlock]);

  useEffect(() => {
    if (activeSection !== "lots") return;
    let cancelled = false;
    setLotsLoading(true);
    apiFetch<Lot[]>(`/lots${lotsQuery}`)
      .then((data) => {
        if (!cancelled) setLots(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setLots([]);
      })
      .finally(() => {
        if (!cancelled) setLotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeSection, lotsQuery]);

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="shrink-0 md:w-56">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Lot Management
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground)]/70">
          Manage lots and lot awards
        </p>
        <nav className="mt-6 flex flex-col gap-0.5" aria-label="Lot Management sections">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                activeSection === id
                  ? "bg-primary text-primary-foreground"
                  : "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="min-w-0 flex-1 space-y-6">
        {activeSection === "lots" && (
          <section
            className="space-y-5"
            aria-labelledby="lots-heading"
          >
            {/* Page header */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  id="lots-heading"
                  className="flex items-center gap-2 text-xl font-semibold text-[var(--foreground)]"
                >
                  <MapPinIcon className="h-6 w-6 shrink-0 text-primary" aria-hidden />
                  Lots
                </h2>
                <p className="mt-0.5 text-sm text-[var(--foreground)]/70">
                  View and filter lots by project, block, and status. Satellite map preview below.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                  aria-live="polite"
                >
                  {lotsLoading ? "…" : `${lots.length} lot${lots.length === 1 ? "" : "s"}`}
                </span>
              </div>
            </div>

            {/* Compact filter bar */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium text-[var(--foreground)]/80 sm:min-w-0">
                  <FunnelIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                  <span className="hidden sm:inline">Filters</span>
                </div>
                <div className="grid w-full grid-cols-1 gap-3 sm:flex sm:w-auto sm:flex-wrap sm:gap-3">
                  <div className="min-w-[140px] sm:min-w-[120px]">
                    <label htmlFor="lot-number" className="sr-only">Lot number</label>
                    <input
                      id="lot-number"
                      type="text"
                      value={lotNumber}
                      onChange={(e) => setLotNumber(e.target.value)}
                      placeholder="Lot number"
                      className={inputClass}
                    />
                  </div>
                  <div className="min-w-[140px] sm:min-w-[120px]">
                    <label htmlFor="lot-status" className="sr-only">Status</label>
                    <select
                      id="lot-status"
                      value={lotStatus}
                      onChange={(e) => setLotStatus(e.target.value)}
                      className={inputClass}
                    >
                      {LOT_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value || "empty"} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-[140px] sm:min-w-[160px]">
                    <label htmlFor="lot-project" className="sr-only">Project</label>
                    <input
                      id="lot-project"
                      type="text"
                      value={lotProject}
                      onChange={(e) => setLotProject(e.target.value)}
                      placeholder="Project"
                      className={inputClass}
                    />
                  </div>
                  <div className="min-w-[140px] sm:min-w-[100px]">
                    <label htmlFor="lot-block" className="sr-only">Block</label>
                    <input
                      id="lot-block"
                      type="text"
                      value={lotBlock}
                      onChange={(e) => setLotBlock(e.target.value)}
                      placeholder="Block"
                      className={inputClass}
                    />
                  </div>
                </div>
                {hasActiveFilters(lotNumber, lotStatus, lotProject, lotBlock) && (
                  <button
                    type="button"
                    onClick={() => {
                      setLotNumber("");
                      setLotStatus("");
                      setLotProject("");
                      setLotBlock("");
                    }}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-[var(--foreground)]/70 hover:bg-black/5 hover:text-[var(--foreground)] dark:hover:bg-white/10"
                  >
                    <XMarkIcon className="h-4 w-4" aria-hidden />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Map + List two-column layout — map emphasized (wider + taller) */}
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

              {/* Listings card — compact sidebar panel */}
              <div className="flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] overflow-hidden shadow-subtle dark:shadow-subtle-dark">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <ListBulletIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span className="text-sm font-semibold text-[var(--foreground)]">Lot listings</span>
                  </div>
                  {!lotsLoading && lots.length > 0 && (
                    <span className="text-xs text-[var(--foreground)]/60">
                      {lots.length} result{lots.length === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
                <div className="min-h-[320px] sm:min-h-[420px] flex-1 overflow-auto">
                  {lotsLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
                      <p className="mt-3 text-sm text-[var(--foreground)]/60">Loading lots…</p>
                    </div>
                  ) : (
                    <LotTable lots={lots} />
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === "lot-award" && (
          <section
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-6 shadow-subtle dark:shadow-subtle-dark"
            aria-labelledby="lot-award-heading"
          >
            <h2
              id="lot-award-heading"
              className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]"
            >
              <DocumentCheckIcon className="h-6 w-6 shrink-0 text-primary" aria-hidden />
              Lot Award
            </h2>
            <p className="mt-2 text-sm text-[var(--foreground)]/70">
              {SECTIONS.find((s) => s.id === "lot-award")!.description}
            </p>

            <div className="mt-6 max-w-xl space-y-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Award details</h3>
              <div>
                <label htmlFor="award-beneficiary" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                  <UserIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                  Beneficiary
                </label>
                <input
                  id="award-beneficiary"
                  type="text"
                  value={awardBeneficiary}
                  onChange={(e) => setAwardBeneficiary(e.target.value)}
                  placeholder="Beneficiary name or ID"
                  className={`mt-1 ${inputClass}`}
                />
              </div>
              <div>
                <label htmlFor="award-lot" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                  <TagIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                  Lot
                </label>
                <input
                  id="award-lot"
                  type="text"
                  value={awardLot}
                  onChange={(e) => setAwardLot(e.target.value)}
                  placeholder="Lot number"
                  className={`mt-1 ${inputClass}`}
                />
              </div>
              <div>
                <label htmlFor="award-date" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                  <CalendarIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                  Award date
                </label>
                <input
                  id="award-date"
                  type="date"
                  value={awardDate}
                  onChange={(e) => setAwardDate(e.target.value)}
                  className={`mt-1 ${inputClass}`}
                />
              </div>
              <div>
                <label htmlFor="award-status" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                  <DocumentCheckIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                  Status
                </label>
                <select
                  id="award-status"
                  value={awardStatus}
                  onChange={(e) => setAwardStatus(e.target.value)}
                  className={`mt-1 ${inputClass}`}
                >
                  {AWARD_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value || "empty"} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="award-remarks" className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]/80">
                  Remarks
                </label>
                <textarea
                  id="award-remarks"
                  value={awardRemarks}
                  onChange={(e) => setAwardRemarks(e.target.value)}
                  placeholder="Optional notes"
                  rows={3}
                  className={`mt-1 ${inputClass}`}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
