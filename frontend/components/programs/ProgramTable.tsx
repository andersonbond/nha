"use client";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Program } from "./types";

type ProgramTableProps = {
  programs: Program[];
  onEdit: (program: Program) => void;
  onDelete: (program: Program) => void;
};

function formatNum(n: number | null) {
  if (n == null) return "—";
  return typeof n === "number" ? n.toLocaleString() : String(n);
}

export function ProgramTable({ programs, onEdit, onDelete }: ProgramTableProps) {
  if (programs.length === 0) {
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium text-[var(--foreground)]">
          No programs yet
        </p>
        <p className="mt-1 text-sm text-[var(--foreground)]/60">
          Add your first program to get started.
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
                Program ID
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                MC Ref
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Interest Rate
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Delinquency Rate
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Max Term (Yrs)
              </th>
              <th scope="col" className="relative px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {programs.map((program) => (
              <tr
                key={program.project_prog_id ?? program.mc_ref ?? Math.random()}
                className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              >
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-primary">
                  {program.project_prog_id ?? "—"}
                </td>
                <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                  {program.mc_ref ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-[var(--foreground)]/80">
                  {formatNum(program.interest_rate)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-[var(--foreground)]/80">
                  {formatNum(program.delinquency_rate)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-[var(--foreground)]/80">
                  {program.max_term_yrs ?? "—"}
                </td>
                <td className="relative whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(program)}
                      className="min-h-[44px] min-w-[44px] rounded p-1.5 text-[var(--foreground)]/70 hover:bg-primary/10 hover:text-primary sm:min-h-0 sm:min-w-0"
                      aria-label={`Edit program ${program.project_prog_id ?? program.mc_ref}`}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(program)}
                      className="min-h-[44px] min-w-[44px] rounded p-1.5 text-[var(--foreground)]/70 hover:bg-red-500/10 hover:text-red-600 sm:min-h-0 sm:min-w-0"
                      aria-label={`Delete program ${program.project_prog_id ?? program.mc_ref}`}
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
