"use client";

import { useState } from "react";
import { PlusIcon, FolderIcon } from "@heroicons/react/24/outline";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { ProjectFormSlideOver } from "@/components/projects/ProjectFormSlideOver";
import { ConfirmDialog } from "@/components/projects/ConfirmDialog";
import type { Project } from "@/components/projects/types";
import { emptyProject } from "@/components/projects/types";

const MOCK_PROJECTS: Project[] = [
  {
    project_code: "PRJ-2024-001",
    project_name: "NHA Resettlement Phase 1",
    total_area: 125000.5,
    project_cost: 85000000,
    region_code: "04",
    province_code: "0401",
    inp_date: "2024-01-15",
    downpayment: 50000,
    monthly_amortization: 3500,
    interest_rate: 0.06,
    selling_price: 450000,
    terms_yr: 25,
    lot_type: "R",
  },
  {
    project_code: "PRJ-2024-002",
    project_name: "Community Housing Program – South",
    total_area: 89000,
    project_cost: 62000000,
    region_code: "04",
    province_code: "0402",
    inp_date: "2024-03-20",
    downpayment: 42000,
    monthly_amortization: 2800,
    interest_rate: 0.055,
    selling_price: 380000,
    terms_yr: 20,
    lot_type: "R",
  },
  {
    project_code: "PRJ-2023-012",
    project_name: "Urban Lot Development – Metro",
    total_area: 45000.25,
    project_cost: 120000000,
    region_code: "13",
    province_code: "1339",
    inp_date: "2023-11-01",
    downpayment: 80000,
    monthly_amortization: 5200,
    interest_rate: 0.065,
    selling_price: 720000,
    terms_yr: 30,
    lot_type: "C",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formProject, setFormProject] = useState<Project>(emptyProject);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

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

  function handleSave(project: Project) {
    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) =>
          p.project_code === editingProject.project_code ? project : p
        )
      );
    } else {
      setProjects((prev) => [...prev, project]);
    }
    setFormOpen(false);
    setEditingProject(null);
    setFormProject(emptyProject);
  }

  function handleDeleteConfirm() {
    if (deleteTarget) {
      setProjects((prev) =>
        prev.filter((p) => p.project_code !== deleteTarget.project_code)
      );
      setDeleteTarget(null);
    }
  }

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
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[var(--background)]"
        >
          <PlusIcon className="h-5 w-5" aria-hidden />
          Add project
        </button>
      </div>

      <ProjectTable
        projects={projects}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <ProjectFormSlideOver
        open={formOpen}
        project={formProject}
        isEdit={!!editingProject}
        onClose={() => {
          setFormOpen(false);
          setEditingProject(null);
          setFormProject(emptyProject);
        }}
        onSave={handleSave}
        onChange={setFormProject}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete project"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.project_name}"? This cannot be undone.`
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
