"use client";

import Link from "next/link";
import type { SearchResponse } from "@/app/lib/search";
import {
  FolderIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

type SearchDropdownProps = {
  query: string;
  results: SearchResponse | null;
  loading: boolean;
  open: boolean;
  onClose: () => void;
};

function Section({
  title,
  icon: Icon,
  items,
  getHref,
  getLabel,
  getSublabel,
  onSelect,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: unknown[];
  getHref: (item: unknown) => string;
  getLabel: (item: unknown) => string;
  getSublabel?: (item: unknown) => string;
  onSelect: () => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="border-b border-[var(--border-subtle)] last:border-b-0">
      <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <ul className="py-1">
        {items.map((item, i) => (
          <li key={i}>
            <Link
              href={getHref(item)}
              onClick={onSelect}
              className="flex flex-col gap-0.5 px-3 py-2 text-left text-sm text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10 outline-none"
            >
              <span className="font-medium text-primary">{getLabel(item)}</span>
              {getSublabel && (
                <span className="text-xs text-[var(--foreground)]/70">{getSublabel(item)}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SearchDropdown({ query, results, loading, open, onClose }: SearchDropdownProps) {
  if (!open) return null;

  const isEmpty =
    !loading &&
    results &&
    results.projects.length === 0 &&
    results.programs.length === 0 &&
    results.applications.length === 0 &&
    results.beneficiaries.length === 0;

  return (
    <div
      className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[min(70vh,400px)] overflow-y-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] shadow-lg"
      role="listbox"
      aria-label="Search results"
    >
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      {!loading && results && (
        <>
          {isEmpty ? (
            <p className="px-4 py-6 text-center text-sm text-[var(--foreground)]/70">
              No results for &quot;{query}&quot;
            </p>
          ) : (
            <>
              <Section
                title="Projects"
                icon={FolderIcon}
                items={results.projects}
                getHref={() => `/projects`}
                getLabel={(p) => (p as { project_code: string }).project_code}
                getSublabel={(p) => (p as { project_name?: string }).project_name ?? ""}
                onSelect={onClose}
              />
              <Section
                title="Programs"
                icon={ClipboardDocumentListIcon}
                items={results.programs}
                getHref={() => `/programs`}
                getLabel={(p) => (p as { mc_ref?: string | null }).mc_ref ?? `Program #${(p as { project_prog_id?: number }).project_prog_id}`}
                getSublabel={(p) => `ID: ${(p as { project_prog_id?: number }).project_prog_id}`}
                onSelect={onClose}
              />
              <Section
                title="Applications"
                icon={DocumentTextIcon}
                items={results.applications}
                getHref={() => `/applications`}
                getLabel={(a) => {
                  const app = a as { last_name?: string; first_name?: string; app_id: string };
                  const name = [app.last_name, app.first_name].filter(Boolean).join(", ");
                  return name || app.app_id;
                }}
                getSublabel={(a) => (a as { prequalification_no?: string }).prequalification_no ?? ""}
                onSelect={onClose}
              />
              <Section
                title="Beneficiaries"
                icon={UserGroupIcon}
                items={results.beneficiaries}
                getHref={() => `/beneficiaries`}
                getLabel={(b) => {
                  const ben = b as { last_name?: string; first_name?: string; id?: number };
                  return [ben.last_name, ben.first_name].filter(Boolean).join(", ") || `#${ben.id}`;
                }}
                getSublabel={(b) => (b as { bin?: string }).bin ?? ""}
                onSelect={onClose}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
