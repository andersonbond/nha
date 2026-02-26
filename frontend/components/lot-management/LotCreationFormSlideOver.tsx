"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import {
  XMarkIcon,
  MapPinIcon,
  TagIcon,
  FolderIcon,
  PlusCircleIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

const SatelliteMap = dynamic(
  () => import("@/components/lot-management/SatelliteMap").then((m) => m.SatelliteMap),
  { ssr: false }
);

const inputClass =
  "mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40";

const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "awarded", label: "Awarded" },
];

type CoordinatePoint = { lat: string; lng: string };

const defaultPoint = (): CoordinatePoint => ({ lat: "", lng: "" });

type LotCreationFormSlideOverProps = {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
};

export function LotCreationFormSlideOver({
  open,
  onClose,
  onSave,
}: LotCreationFormSlideOverProps) {
  const [points, setPoints] = useState<CoordinatePoint[]>(() => [defaultPoint()]);
  const [kmlFile, setKmlFile] = useState<File | null>(null);
  const kmlInputRef = useRef<HTMLInputElement | null>(null);

  const addPoint = useCallback(() => {
    setPoints((prev) => [...prev, defaultPoint()]);
  }, []);

  const updatePoint = useCallback((index: number, field: "lat" | "lng", value: string) => {
    setPoints((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  }, []);

  const removePoint = useCallback((index: number) => {
    setPoints((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave?.();
    onClose();
  }

  function handleKmlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setKmlFile(file);
    e.target.value = "";
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="lot-creation-title"
    >
      <div className="absolute inset-0 bg-black/30" aria-hidden onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex w-full flex-col bg-[var(--background)] shadow-xl sm:max-w-5xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] px-6 py-4">
          <h2 id="lot-creation-title" className="text-lg font-semibold text-[var(--foreground)]">
            Create lot
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

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_1fr]">
          {/* Column 1: Map */}
          <div className="flex min-h-[280px] flex-col border-b border-[var(--border-subtle)] lg:border-b-0 lg:border-r border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-4 py-2">
              <MapPinIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="text-sm font-semibold text-[var(--foreground)]">Map</span>
            </div>
            <div className="relative min-h-0 flex-1 [&_.leaflet-container]:z-0">
              <SatelliteMap height={400} className="h-full min-h-[300px] w-full" />
            </div>
          </div>

          {/* Column 2: Form */}
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-4">

              {/* Coordinates */}
              <section className="mt-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <MapPinIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                  Boundary coordinates
                </h3>
                <div className="mt-3 space-y-3">
                  {points.map((point, index) => (
                    <div key={index} className="flex flex-wrap items-end gap-2">
                      <span className="w-14 shrink-0 text-sm font-medium text-[var(--foreground)]/80">
                        Point {index + 1}
                      </span>
                      <div className="flex min-w-0 flex-1 gap-2">
                        <div className="min-w-0 flex-1">
                          <label htmlFor={`create-lot-point-${index}-lat`} className="sr-only">
                            Latitude
                          </label>
                          <input
                            id={`create-lot-point-${index}-lat`}
                            type="text"
                            placeholder="Lat"
                            value={point.lat}
                            onChange={(e) => updatePoint(index, "lat", e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <label htmlFor={`create-lot-point-${index}-lng`} className="sr-only">
                            Longitude
                          </label>
                          <input
                            id={`create-lot-point-${index}-lng`}
                            type="text"
                            placeholder="Lng"
                            value={point.lng}
                            onChange={(e) => updatePoint(index, "lng", e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>
                      {points.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePoint(index)}
                          className="shrink-0 rounded p-2 text-[var(--foreground)]/60 hover:bg-red-500/10 hover:text-red-600"
                          aria-label={`Remove point ${index + 1}`}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPoint}
                    className="flex items-center gap-2 rounded-md border border-dashed border-[var(--border-subtle)] px-3 py-2 text-sm font-medium text-[var(--foreground)]/70 hover:border-primary hover:bg-primary/5 hover:text-primary"
                  >
                    <PlusCircleIcon className="h-4 w-4 shrink-0" aria-hidden />
                    Add more
                  </button>
                </div>
              </section>

              {/* Upload KML */}
              <section className="mt-5">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Vector file</h3>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <input
                    ref={kmlInputRef}
                    type="file"
                    accept=".kml"
                    onChange={handleKmlChange}
                    className="hidden"
                    aria-label="Upload KML file"
                  />
                  <button
                    type="button"
                    onClick={() => kmlInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <ArrowUpTrayIcon className="h-4 w-4 shrink-0" aria-hidden />
                    Upload Vector File (KML)
                  </button>
                  {kmlFile && (
                    <span className="text-sm text-[var(--foreground)]/70">
                      {kmlFile.name}
                    </span>
                  )}
                </div>
              </section>

              <section className="mt-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <TagIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                  Lot details
                </h3>
                <div className="mt-3 space-y-3">
                  <div>
                    <label htmlFor="create-lot-number" className="block text-sm font-medium text-[var(--foreground)]/80">
                      Lot number
                    </label>
                    <input
                      id="create-lot-number"
                      type="text"
                      placeholder="e.g. LOT-001"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="create-lot-block" className="block text-sm font-medium text-[var(--foreground)]/80">
                      Block
                    </label>
                    <input
                      id="create-lot-block"
                      type="text"
                      placeholder="e.g. A"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="create-lot-status" className="block text-sm font-medium text-[var(--foreground)]/80">
                      Status
                    </label>
                    <select id="create-lot-status" className={inputClass}>
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="mt-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <FolderIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                  Project
                </h3>
                <div className="mt-3 space-y-3">
                  <div>
                    <label htmlFor="create-lot-project" className="block text-sm font-medium text-[var(--foreground)]/80">
                      Project
                    </label>
                    <input
                      id="create-lot-project"
                      type="text"
                      placeholder="Project code or name"
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              <section className="mt-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <MapPinIcon className="h-4 w-4 shrink-0 text-primary/80" aria-hidden />
                  Location / area
                </h3>
                <div className="mt-3 space-y-3">
                  <div>
                    <label htmlFor="create-lot-area" className="block text-sm font-medium text-[var(--foreground)]/80">
                      Area (sqm)
                    </label>
                    <input
                      id="create-lot-area"
                      type="text"
                      placeholder="Optional"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="create-lot-remarks" className="block text-sm font-medium text-[var(--foreground)]/80">
                      Remarks
                    </label>
                    <textarea
                      id="create-lot-remarks"
                      rows={2}
                      placeholder="Optional notes"
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="shrink-0 flex justify-end gap-2 border-t border-[var(--border-subtle)] px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-[var(--border-subtle)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Save lot
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
