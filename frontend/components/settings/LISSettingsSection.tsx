"use client";

import { useState } from "react";
import { Cog6ToothIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { apiFetch } from "@/app/lib/api";

const TABLE_PAGE_SIZE_KEY = "lis-table-page-size";
const DEFAULT_REGION_KEY = "lis-default-region-code";
const DEFAULT_PROVINCE_KEY = "lis-default-province-code";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function LISSettingsSection() {
  const [warmLoading, setWarmLoading] = useState(false);
  const [warmMessage, setWarmMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window === "undefined") return 25;
    const v = localStorage.getItem(TABLE_PAGE_SIZE_KEY);
    const n = parseInt(v ?? "25", 10);
    return PAGE_SIZE_OPTIONS.includes(n) ? n : 25;
  });
  const [defaultRegion, setDefaultRegion] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(DEFAULT_REGION_KEY) ?? "";
  });
  const [defaultProvince, setDefaultProvince] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(DEFAULT_PROVINCE_KEY) ?? "";
  });

  function handleWarmCache() {
    setWarmLoading(true);
    setWarmMessage(null);
    apiFetch<{ status: string }>("/address/warm", { method: "POST" })
      .then(() => {
        setWarmMessage({ type: "success", text: "Address cache warmed successfully." });
      })
      .catch((err) => {
        setWarmMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to warm cache." });
      })
      .finally(() => setWarmLoading(false));
  }

  function handlePageSizeChange(value: number) {
    setPageSize(value);
    if (typeof window !== "undefined") {
      localStorage.setItem(TABLE_PAGE_SIZE_KEY, String(value));
    }
  }

  function handleDefaultRegionChange(value: string) {
    setDefaultRegion(value);
    if (typeof window !== "undefined") {
      localStorage.setItem(DEFAULT_REGION_KEY, value);
    }
  }

  function handleDefaultProvinceChange(value: string) {
    setDefaultProvince(value);
    if (typeof window !== "undefined") {
      localStorage.setItem(DEFAULT_PROVINCE_KEY, value);
    }
  }

  return (
    <div className="space-y-6">
      <section
        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark"
        aria-labelledby="lis-defaults-heading"
      >
        <h2 id="lis-defaults-heading" className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <Cog6ToothIcon className="h-5 w-5" aria-hidden />
          Defaults
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground)]/70">
          Default address and table size for new forms and lists.
        </p>
        <div className="mt-4 max-w-md space-y-3">
          <div>
            <label htmlFor="lis-default-region" className="block text-sm font-medium text-[var(--foreground)]/80">
              Default region code (for new applications)
            </label>
            <input
              id="lis-default-region"
              type="text"
              value={defaultRegion}
              onChange={(e) => handleDefaultRegionChange(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
              placeholder="e.g. PH13"
              maxLength={8}
            />
          </div>
          <div>
            <label htmlFor="lis-default-province" className="block text-sm font-medium text-[var(--foreground)]/80">
              Default province code (for new applications)
            </label>
            <input
              id="lis-default-province"
              type="text"
              value={defaultProvince}
              onChange={(e) => handleDefaultProvinceChange(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
              placeholder="e.g. 1339"
              maxLength={12}
            />
          </div>
          <div>
            <label htmlFor="lis-page-size" className="block text-sm font-medium text-[var(--foreground)]/80">
              Table page size
            </label>
            <select
              id="lis-page-size"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="mt-1 w-full max-w-[120px] rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n} rows</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section
        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark"
        aria-labelledby="lis-cache-heading"
      >
        <h2 id="lis-cache-heading" className="text-sm font-semibold text-[var(--foreground)]">
          Address cache
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground)]/70">
          Preload address data into cache after bulk imports or CSV changes.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={handleWarmCache}
            disabled={warmLoading}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            <ArrowPathIcon className={`h-4 w-4 ${warmLoading ? "animate-spin" : ""}`} aria-hidden />
            {warmLoading ? "Warming…" : "Warm address cache"}
          </button>
          {warmMessage && (
            <p className={`text-sm ${warmMessage.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {warmMessage.text}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
