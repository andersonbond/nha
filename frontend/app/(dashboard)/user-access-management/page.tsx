"use client";

import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function UserAccessManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-[var(--foreground)]">
          <ShieldCheckIcon className="h-7 w-7 shrink-0 text-primary" aria-hidden />
          User Access Management
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground)]/70">
          Manage user roles and LIS module access. Users are authenticated via SSO; use this module to assign roles and permissions.
        </p>
      </div>

      <section
        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-6 shadow-subtle dark:shadow-subtle-dark"
        aria-labelledby="uam-placeholder-heading"
      >
        <h2 id="uam-placeholder-heading" className="text-lg font-semibold text-[var(--foreground)]">
          Coming in MVP 3
        </h2>
        <p className="mt-2 text-sm text-[var(--foreground)]/70">
          User Access Management will allow LIS admins to:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-[var(--foreground)]/80">
          <li>List and sync users from SSO</li>
          <li>Assign roles (e.g. LIS Admin, LIS Viewer, Approver) to users</li>
          <li>Configure module-level access per role</li>
        </ul>
        <div className="mt-4 flex min-h-[100px] items-center justify-center rounded-md border border-dashed border-[var(--border-subtle)] bg-[var(--background-elevated)]/30">
          <p className="text-sm text-[var(--foreground)]/50">
            User and role management UI will be implemented here.
          </p>
        </div>
      </section>
    </div>
  );
}
