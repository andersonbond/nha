"use client";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Project } from "./types";

type ProjectTableProps = {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

function formatDate(s: string) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return s;
  }
}

function formatNum(n: number | null | undefined) {
  if (n == null) return "—";
  return n.toLocaleString();
}

export function ProjectTable({ projects, onEdit, onDelete }: ProjectTableProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] py-16 text-center shadow-subtle dark:shadow-subtle-dark">
        <div className="rounded-full border border-[var(--border-subtle)] p-4">
          <svg
            className="h-10 w-10 text-[var(--foreground)]/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium text-[var(--foreground)]">
          No projects yet
        </p>
        <p className="mt-1 text-sm text-[var(--foreground)]/60">
          Add your first project to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] shadow-subtle dark:shadow-subtle-dark">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-subtle)]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Project Code
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Project Name
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Region
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Total Area
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Project Cost
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Lot Type
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Input Date
              </th>
              <th scope="col" className="relative px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {projects.map((project) => (
              <tr
                key={project.project_code}
                className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              >
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-primary">
                  {project.project_code}
                </td>
                <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                  {project.project_name ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-[var(--foreground)]/80">
                  {project.region_code || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-[var(--foreground)]/80">
                  {formatNum(project.total_area)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-[var(--foreground)]/80">
                  {formatNum(project.project_cost)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--foreground)]/80">
                  {project.lot_type || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--foreground)]/80">
                  {formatDate(project.created_at ?? project.inp_date ?? "")}
                </td>
                <td className="relative whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(project)}
                      className="min-h-[44px] min-w-[44px] rounded p-1.5 text-[var(--foreground)]/70 hover:bg-primary/10 hover:text-primary sm:min-h-0 sm:min-w-0"
                      aria-label={`Edit ${project.project_name ?? project.project_code}`}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(project)}
                      className="min-h-[44px] min-w-[44px] rounded p-1.5 text-[var(--foreground)]/70 hover:bg-red-500/10 hover:text-red-600 sm:min-h-0 sm:min-w-0"
                      aria-label={`Delete ${project.project_name ?? project.project_code}`}
                    >
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
  );
}
