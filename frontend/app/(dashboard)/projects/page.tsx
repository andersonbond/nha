"use client";

import { useState, useEffect, useRef } from "react";
import { PlusIcon, FolderIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { ProjectFormSlideOver } from "@/components/projects/ProjectFormSlideOver";
import { ProjectInsights } from "@/components/projects/ProjectInsights";
import { AddProjectReview } from "@/components/projects/AddProjectReview";
import { ConfirmDialog } from "@/components/projects/ConfirmDialog";
import type { Project } from "@/components/projects/types";
import { emptyProject } from "@/components/projects/types";
import type { Program } from "@/components/programs/types";
import { apiFetch } from "@/app/lib/api";

type ProjectFilters = {
  project_code: string;
  project_name: string;
  region_code: string;
  province_code: string;
  lot_type: string;
  project_prog_id: string;
};

const emptyFilters: ProjectFilters = {
  project_code: "",
  project_name: "",
  region_code: "",
  province_code: "",
  lot_type: "",
  project_prog_id: "",
};

function buildProjectsQuery(f: ProjectFilters): string {
  const params = new URLSearchParams();
  if (f.project_code.trim()) params.set("project_code", f.project_code.trim());
  if (f.project_name.trim()) params.set("project_name", f.project_name.trim());
  if (f.region_code.trim()) params.set("region_code", f.region_code.trim());
  if (f.province_code.trim()) params.set("province_code", f.province_code.trim());
  if (f.lot_type.trim()) params.set("lot_type", f.lot_type.trim());
  if (f.project_prog_id.trim()) params.set("project_prog_id", f.project_prog_id.trim());
  const q = params.toString();
  return q ? `?${q}` : "";
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formProject, setFormProject] = useState<Project>(emptyProject);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [pendingAddProject, setPendingAddProject] = useState<Project | null>(null);
  const [filterValues, setFilterValues] = useState<ProjectFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<ProjectFilters>(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const query = buildProjectsQuery(appliedFilters);
    apiFetch<Project[]>(`/projects${query}`)
      .then((data) => {
        if (!cancelled) setProjects(Array.isArray(data) ? data : []);
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
  }, [appliedFilters]);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Program[]>("/programs")
      .then((data) => {
        if (!cancelled) setPrograms(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function openCreate() {
    setEditingProject(null);
    setFormProject(emptyProject);
    setFormOpen(true);
  }

  function openEdit(project: Project) {
    setEditingProject(project);
    setFormProject({ ...project });
    setFormOpen(true);
  }

  function payloadFromProject(project: Project) {
    return {
      project_code: project.project_code,
      project_name: project.project_name || null,
      project_prog_id: project.project_prog_id ?? null,
      total_area: project.total_area,
      project_cost: project.project_cost,
      region_code: project.region_code || null,
      province_code: project.province_code || null,
      municipal_code: project.municipal_code || null,
      barangay_code: project.barangay_code || null,
      district_code: project.district_code || null,
      inp_date: project.inp_date || null,
      downpayment: project.downpayment,
      monthly_amortization: project.monthly_amortization,
      interest_rate: project.interest_rate,
      selling_price: project.selling_price,
      terms_yr: project.terms_yr,
      lot_type: project.lot_type || null,
    };
  }

  function handleSave(project: Project) {
    setError(null);
    if (editingProject) {
      apiFetch<Project>(`/projects/${encodeURIComponent(editingProject.project_code)}`, {
        method: "PUT",
        body: JSON.stringify(payloadFromProject(project)),
      })
        .then((updated) => {
          setProjects((prev) =>
            prev.map((p) => (p.project_code === editingProject.project_code ? updated : p))
          );
          setFormOpen(false);
          setEditingProject(null);
          setFormProject(emptyProject);
        })
        .catch((err) => setError(err instanceof Error ? err.message : String(err)));
    } else {
      setPendingAddProject(project);
    }
  }

  function handleConfirmAddProject() {
    if (!pendingAddProject) return;
    setError(null);
    apiFetch<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(payloadFromProject(pendingAddProject)),
    })
      .then((created) => {
        setProjects((prev) => [...prev, created]);
        setFormOpen(false);
        setFormProject(emptyProject);
        setPendingAddProject(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setError(null);
    apiFetch(`/projects/${encodeURIComponent(deleteTarget.project_code)}`, {
      method: "DELETE",
    })
      .then(() => {
        setProjects((prev) =>
          prev.filter((p) => p.project_code !== deleteTarget.project_code)
        );
        setDeleteTarget(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }

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

  const hasActiveFilters =
    Object.keys(emptyFilters).some((k) => (appliedFilters as ProjectFilters)[k as keyof ProjectFilters]?.trim());
  const activeFilterCount = Object.keys(emptyFilters).filter(
    (k) => (appliedFilters as ProjectFilters)[k as keyof ProjectFilters]?.trim()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-[var(--foreground)]">
            <FolderIcon className="h-7 w-7 shrink-0 text-primary" aria-hidden />
            Projects
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/70">
            Manage housing and resettlement projects.
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
            Add project
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
            aria-labelledby="filter-popover-title"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="filter-popover-title" className="text-base font-semibold text-[var(--foreground)]">
                Filter projects
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
                <label htmlFor="popover-filter-project_code" className="block text-xs font-medium text-[var(--foreground)]/80">Project code</label>
                <input id="popover-filter-project_code" type="text" value={filterValues.project_code} onChange={(e) => setFilterValues((f) => ({ ...f, project_code: e.target.value }))} placeholder="Filter..." className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]" />
              </div>
              <div>
                <label htmlFor="popover-filter-project_name" className="block text-xs font-medium text-[var(--foreground)]/80">Project name</label>
                <input id="popover-filter-project_name" type="text" value={filterValues.project_name} onChange={(e) => setFilterValues((f) => ({ ...f, project_name: e.target.value }))} placeholder="Filter..." className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]" />
              </div>
              <div>
                <label htmlFor="popover-filter-region_code" className="block text-xs font-medium text-[var(--foreground)]/80">Region</label>
                <input id="popover-filter-region_code" type="text" value={filterValues.region_code} onChange={(e) => setFilterValues((f) => ({ ...f, region_code: e.target.value }))} placeholder="e.g. 04" maxLength={4} className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]" />
              </div>
              <div>
                <label htmlFor="popover-filter-province_code" className="block text-xs font-medium text-[var(--foreground)]/80">Province</label>
                <input id="popover-filter-province_code" type="text" value={filterValues.province_code} onChange={(e) => setFilterValues((f) => ({ ...f, province_code: e.target.value }))} placeholder="e.g. 0401" maxLength={4} className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]" />
              </div>
              <div>
                <label htmlFor="popover-filter-lot_type" className="block text-xs font-medium text-[var(--foreground)]/80">Lot type</label>
                <input id="popover-filter-lot_type" type="text" value={filterValues.lot_type} onChange={(e) => setFilterValues((f) => ({ ...f, lot_type: e.target.value }))} placeholder="e.g. R" maxLength={1} className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]" />
              </div>
              <div>
                <label htmlFor="popover-filter-program" className="block text-xs font-medium text-[var(--foreground)]/80">Program</label>
                <select id="popover-filter-program" value={filterValues.project_prog_id} onChange={(e) => setFilterValues((f) => ({ ...f, project_prog_id: e.target.value }))} className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]">
                  <option value="">All</option>
                  {programs.filter((p) => p.project_prog_id != null).map((p) => (
                    <option key={p.project_prog_id} value={p.project_prog_id}>{p.mc_ref || `Program ${p.project_prog_id}`}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={clearFilters} disabled={!hasActiveFilters} className="rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10">Clear</button>
              <button type="button" onClick={applyAndClose} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">Apply</button>
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
          <ProjectInsights projects={projects} />
          <ProjectTable
            projects={projects}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        </>
      )}

      <ProjectFormSlideOver
        open={formOpen}
        project={formProject}
        isEdit={!!editingProject}
        programs={programs.filter((p): p is Program & { project_prog_id: number } => p.project_prog_id != null).map((p) => ({ project_prog_id: p.project_prog_id, mc_ref: p.mc_ref }))}
        onClose={() => {
          setFormOpen(false);
          setEditingProject(null);
          setFormProject(emptyProject);
          setPendingAddProject(null);
        }}
        onSave={handleSave}
        onChange={setFormProject}
      />

      {pendingAddProject && (
        <AddProjectReview
          project={pendingAddProject}
          programs={programs.filter((p): p is Program & { project_prog_id: number } => p.project_prog_id != null).map((p) => ({ project_prog_id: p.project_prog_id, mc_ref: p.mc_ref }))}
          onConfirm={handleConfirmAddProject}
          onBack={() => setPendingAddProject(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete project"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.project_name ?? deleteTarget.project_code}"? This cannot be undone.`
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
