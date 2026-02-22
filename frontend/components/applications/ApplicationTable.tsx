"use client";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Application } from "./types";

type ApplicationTableProps = {
  applications: Application[];
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
};

function formatDate(s: string | null | undefined) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return s;
  }
}

export function ApplicationTable({ applications, onEdit, onDelete }: ApplicationTableProps) {
  if (applications.length === 0) {
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium text-[var(--foreground)]">No applications yet</p>
        <p className="mt-1 text-sm text-[var(--foreground)]/60">Add your first application to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] shadow-subtle dark:shadow-subtle-dark">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-subtle)]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Prequalification No
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Last name
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                First name
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Application type
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Origin
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Created at
              </th>
              <th scope="col" className="relative px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {applications.map((app) => (
              <tr key={app.app_id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--foreground)]">
                  {app.prequalification_no ?? "—"}
                </td>
                <td className="px-4 py-3 text-sm text-[var(--foreground)]">{app.last_name ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-[var(--foreground)]">{app.first_name ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-[var(--foreground)]">{app.application_type ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-[var(--foreground)]">{app.origin ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--foreground)]/80">
                  {formatDate(app.created_at)}
                </td>
                <td className="relative whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(app)}
                      className="min-h-[44px] min-w-[44px] rounded p-1.5 text-[var(--foreground)]/70 hover:bg-primary/10 hover:text-primary sm:min-h-0 sm:min-w-0"
                      aria-label={`Edit application ${app.app_id}`}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(app)}
                      className="min-h-[44px] min-w-[44px] rounded p-1.5 text-[var(--foreground)]/70 hover:bg-red-500/10 hover:text-red-600 sm:min-h-0 sm:min-w-0"
                      aria-label={`Delete application ${app.app_id}`}
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
