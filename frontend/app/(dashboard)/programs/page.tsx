"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { PlusIcon, DocumentTextIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ProgramTable } from "@/components/programs/ProgramTable";
import { ProgramFormSlideOver } from "@/components/programs/ProgramFormSlideOver";
import { ProgramInsights } from "@/components/programs/ProgramInsights";
import { AddProgramReview } from "@/components/programs/AddProgramReview";
import { ConfirmDialog } from "@/components/projects/ConfirmDialog";
import type { Program } from "@/components/programs/types";
import { emptyProgram } from "@/components/programs/types";
import { apiFetch } from "@/app/lib/api";

type ProgramFilters = {
  mc_ref: string;
  interest_rate_min: string;
  max_term_yrs: string;
};

const emptyProgramFilters: ProgramFilters = {
  mc_ref: "",
  interest_rate_min: "",
  max_term_yrs: "",
};

function filterPrograms(programs: Program[], f: ProgramFilters): Program[] {
  return programs.filter((p) => {
    if (f.mc_ref.trim()) {
      const ref = (p.mc_ref ?? "").toLowerCase();
      if (!ref.includes(f.mc_ref.trim().toLowerCase())) return false;
    }
    if (f.interest_rate_min.trim()) {
      const min = Number(f.interest_rate_min);
      if (!Number.isFinite(min) || (p.interest_rate ?? 0) < min) return false;
    }
    if (f.max_term_yrs.trim()) {
      const term = Number(f.max_term_yrs);
      if (!Number.isFinite(term) || p.max_term_yrs !== term) return false;
    }
    return true;
  });
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formProgram, setFormProgram] = useState<Program>(emptyProgram);
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);
  const [pendingAddProgram, setPendingAddProgram] = useState<Program | null>(null);
  const [filterValues, setFilterValues] = useState<ProgramFilters>(emptyProgramFilters);
  const [appliedFilters, setAppliedFilters] = useState<ProgramFilters>(emptyProgramFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterPopoverRef = useRef<HTMLDivElement>(null);

  const filteredPrograms = useMemo(
    () => filterPrograms(programs, appliedFilters),
    [programs, appliedFilters]
  );

  useEffect(() => {
    let cancelled = false;
    setError(null);
    apiFetch<Program[]>("/programs")
      .then((data) => {
        if (!cancelled) setPrograms(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function openCreate() {
    setEditingProgram(null);
    setFormProgram(emptyProgram);
    setFormOpen(true);
  }

  function openEdit(program: Program) {
    setEditingProgram(program);
    setFormProgram({ ...program });
    setFormOpen(true);
  }

  function handleSave(program: Program) {
    setError(null);
    if (editingProgram && editingProgram.project_prog_id != null) {
      apiFetch<Program>(`/programs/${editingProgram.project_prog_id}`, {
        method: "PUT",
        body: JSON.stringify({
          mc_ref: program.mc_ref || null,
          interest_rate: program.interest_rate,
          delinquency_rate: program.delinquency_rate,
          max_term_yrs: program.max_term_yrs,
        }),
      })
        .then((updated) => {
          setPrograms((prev) =>
            prev.map((p) =>
              p.project_prog_id === editingProgram.project_prog_id ? updated : p
            )
          );
          setFormOpen(false);
          setEditingProgram(null);
          setFormProgram(emptyProgram);
        })
        .catch((err) => setError(err instanceof Error ? err.message : String(err)));
    } else {
      setPendingAddProgram(program);
    }
  }

  function handleConfirmAddProgram() {
    if (!pendingAddProgram) return;
    setError(null);
    apiFetch<Program>("/programs", {
      method: "POST",
      body: JSON.stringify({
        mc_ref: pendingAddProgram.mc_ref || null,
        interest_rate: pendingAddProgram.interest_rate,
        delinquency_rate: pendingAddProgram.delinquency_rate,
        max_term_yrs: pendingAddProgram.max_term_yrs,
      }),
    })
      .then((created) => {
        setPrograms((prev) => [...prev, created]);
        setFormOpen(false);
        setFormProgram(emptyProgram);
        setPendingAddProgram(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }

  function handleDeleteConfirm() {
    if (!deleteTarget || deleteTarget.project_prog_id == null) return;
    setError(null);
    apiFetch(`/programs/${deleteTarget.project_prog_id}`, {
      method: "DELETE",
    })
      .then(() => {
        setPrograms((prev) =>
          prev.filter((p) => p.project_prog_id !== deleteTarget.project_prog_id)
        );
        setDeleteTarget(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }

  function applyAndClose() {
    setAppliedFilters({ ...filterValues });
    setFilterOpen(false);
  }

  function clearFilters() {
    setFilterValues(emptyProgramFilters);
    setAppliedFilters(emptyProgramFilters);
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

  const activeFilterCount = (
    [
      appliedFilters.mc_ref.trim(),
      appliedFilters.interest_rate_min.trim(),
      appliedFilters.max_term_yrs.trim(),
    ] as const
  ).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-[var(--foreground)]">
            <DocumentTextIcon className="h-7 w-7 shrink-0 text-primary" aria-hidden />
            Programs
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/70">
            Manage programs linked to projects and lots.
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
            onClick={openCreate}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[var(--background)] sm:min-h-0 sm:min-w-0 sm:w-auto"
          >
            <PlusIcon className="h-5 w-5 shrink-0" aria-hidden />
            Add program
          </button>
        </div>
      </div>

      {/* Filter popup */}
      {filterOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" aria-hidden />
          <div
            ref={filterPopoverRef}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] p-5 shadow-xl"
            role="dialog"
            aria-labelledby="programs-filter-title"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="programs-filter-title" className="text-base font-semibold text-[var(--foreground)]">
                Filter programs
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
              <div className="col-span-2">
                <label htmlFor="program-filter-mc_ref" className="block text-xs font-medium text-[var(--foreground)]/80">MC Ref</label>
                <input
                  id="program-filter-mc_ref"
                  type="text"
                  value={filterValues.mc_ref}
                  onChange={(e) => setFilterValues((f) => ({ ...f, mc_ref: e.target.value }))}
                  placeholder="Filter..."
                  className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]"
                />
              </div>
              <div>
                <label htmlFor="program-filter-interest_rate_min" className="block text-xs font-medium text-[var(--foreground)]/80">Interest rate (min %)</label>
                <input
                  id="program-filter-interest_rate_min"
                  type="number"
                  min={0}
                  step={0.1}
                  value={filterValues.interest_rate_min}
                  onChange={(e) => setFilterValues((f) => ({ ...f, interest_rate_min: e.target.value }))}
                  placeholder="e.g. 5"
                  className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]"
                />
              </div>
              <div>
                <label htmlFor="program-filter-max_term_yrs" className="block text-xs font-medium text-[var(--foreground)]/80">Max term (yrs)</label>
                <input
                  id="program-filter-max_term_yrs"
                  type="number"
                  min={0}
                  value={filterValues.max_term_yrs}
                  onChange={(e) => setFilterValues((f) => ({ ...f, max_term_yrs: e.target.value }))}
                  placeholder="e.g. 25"
                  className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={clearFilters}
                disabled={activeFilterCount === 0}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden />
                Clear
              </button>
              <button
                type="button"
                onClick={applyAndClose}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] py-16 shadow-subtle dark:shadow-subtle-dark">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
            aria-label="Loading"
          />
        </div>
      ) : (
        <>
          <ProgramInsights programs={filteredPrograms} />
          <ProgramTable
            programs={filteredPrograms}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        </>
      )}

      <ProgramFormSlideOver
        open={formOpen}
        program={formProgram}
        isEdit={!!editingProgram}
        onClose={() => {
          setFormOpen(false);
          setEditingProgram(null);
          setFormProgram(emptyProgram);
        }}
        onSave={handleSave}
        onChange={setFormProgram}
      />

      {pendingAddProgram && (
        <AddProgramReview
          program={pendingAddProgram}
          onConfirm={handleConfirmAddProgram}
          onBack={() => setPendingAddProgram(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete program"
        message={
          deleteTarget
            ? `Are you sure you want to delete this program${deleteTarget.mc_ref ? ` (${deleteTarget.mc_ref})` : ""}? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
