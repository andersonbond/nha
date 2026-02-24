"use client";

import { useState, useEffect } from "react";
import { PlusIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { ApplicationFormSlideOver } from "@/components/applications/ApplicationFormSlideOver";
import { ApplicationInsights } from "@/components/applications/ApplicationInsights";
import { ConfirmDialog } from "@/components/projects/ConfirmDialog";
import type { Application } from "@/components/applications/types";
import { emptyApplication } from "@/components/applications/types";
import { apiFetch } from "@/app/lib/api";

function payloadFromApplication(app: Application) {
  return {
    prequalification_no: app.prequalification_no || null,
    origin: app.origin || null,
    indicator: app.indicator || null,
    tenurial_code: app.tenurial_code || null,
    application_type: app.application_type || null,
    current_addr: app.current_addr || null,
    last_name: app.last_name || null,
    first_name: app.first_name || null,
    middle_name: app.middle_name || null,
    birth_date: app.birth_date || null,
    sex: app.sex || null,
    civil_status: app.civil_status || null,
    address: app.address || null,
    region_code: app.region_code || null,
    province_code: app.province_code || null,
    municipal_code: app.municipal_code || null,
    barangay_code: app.barangay_code || null,
    district_code: app.district_code || null,
    valid_id_image: app.valid_id_image || null,
    valid_id_type: app.valid_id_type || null,
  };
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [formApplication, setFormApplication] = useState<Application>({ ...emptyApplication, app_id: "" });
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    apiFetch<Application[]>("/applications")
      .then((data) => {
        if (!cancelled) setApplications(Array.isArray(data) ? data : []);
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
    setEditingApplication(null);
    setFormApplication({ ...emptyApplication, app_id: "" });
    setFormOpen(true);
  }

  function openEdit(app: Application) {
    setEditingApplication(app);
    setFormApplication({ ...app });
    setFormOpen(true);
  }

  function handleSave(app: Application) {
    setError(null);
    if (editingApplication?.app_id) {
      apiFetch<Application>(`/applications/${editingApplication.app_id}`, {
        method: "PUT",
        body: JSON.stringify(payloadFromApplication(app)),
      })
        .then((updated) => {
          setApplications((prev) =>
            prev.map((a) => (a.app_id === editingApplication.app_id ? updated : a))
          );
          setFormOpen(false);
          setEditingApplication(null);
          setFormApplication({ ...emptyApplication, app_id: "" });
        })
        .catch((err) => setError(err instanceof Error ? err.message : String(err)));
    } else {
      apiFetch<Application>("/applications", {
        method: "POST",
        body: JSON.stringify(payloadFromApplication(app)),
      })
        .then((created) => {
          setApplications((prev) => [...prev, created]);
          setFormOpen(false);
          setFormApplication({ ...emptyApplication, app_id: "" });
        })
        .catch((err) => setError(err instanceof Error ? err.message : String(err)));
    }
  }

  function handleDeleteConfirm() {
    if (!deleteTarget?.app_id) return;
    setError(null);
    apiFetch(`/applications/${deleteTarget.app_id}`, { method: "DELETE" })
      .then(() => {
        setApplications((prev) => prev.filter((a) => a.app_id !== deleteTarget.app_id));
        setDeleteTarget(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-[var(--foreground)]">
            <DocumentTextIcon className="h-7 w-7 shrink-0 text-primary" aria-hidden />
            Applications
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/70">
            List, filter, and manage lot applications.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[var(--background)] sm:min-h-0 sm:min-w-0 sm:w-auto"
        >
          <PlusIcon className="h-5 w-5 shrink-0" aria-hidden />
          Add application
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] py-16 shadow-subtle dark:shadow-subtle-dark">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label="Loading" />
        </div>
      ) : (
        <>
          <ApplicationInsights applications={applications} />
          <ApplicationTable
            applications={applications}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        </>
      )}

      <ApplicationFormSlideOver
        open={formOpen}
        application={formApplication}
        isEdit={!!editingApplication}
        onClose={() => {
          setFormOpen(false);
          setEditingApplication(null);
          setFormApplication({ ...emptyApplication, app_id: "" });
        }}
        onSave={handleSave}
        onChange={setFormApplication}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete application"
        message={
          deleteTarget
            ? `Are you sure you want to delete this application${deleteTarget.prequalification_no ? ` (${deleteTarget.prequalification_no})` : ""}? This cannot be undone.`
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
