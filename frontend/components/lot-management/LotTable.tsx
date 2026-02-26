"use client";

import type { Lot } from "@/app/lib/mockData";

type LotTableProps = {
  lots: Lot[];
};

const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  awarded: "Awarded",
};

export function LotTable({ lots }: LotTableProps) {
  if (lots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] py-12 text-center shadow-subtle dark:shadow-subtle-dark">
        <p className="text-sm font-medium text-[var(--foreground)]">No lots found</p>
        <p className="mt-1 text-sm text-[var(--foreground)]/60">
          Try adjusting filters or add lots in MVP 2.
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
                Lot number
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Block
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Project
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {lots.map((lot) => (
              <tr
                key={lot.id}
                className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              >
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-primary">
                  {lot.lot_number}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--foreground)]/80">
                  {lot.block ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      lot.status === "available"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : lot.status === "reserved"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {STATUS_LABELS[lot.status] ?? lot.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--foreground)]/80">
                  {lot.project_name ?? lot.project_code ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
