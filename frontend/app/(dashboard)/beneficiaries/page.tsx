"use client";

import { useState, useEffect } from "react";
import { PlusIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { BeneficiaryTable } from "@/components/beneficiaries/BeneficiaryTable";
import { BeneficiaryFormSlideOver } from "@/components/beneficiaries/BeneficiaryFormSlideOver";
import { BeneficiaryInsights } from "@/components/beneficiaries/BeneficiaryInsights";
import { ConfirmDialog } from "@/components/projects/ConfirmDialog";
import type { Beneficiary } from "@/components/beneficiaries/types";
import { emptyBeneficiary } from "@/components/beneficiaries/types";
import { apiFetch } from "@/app/lib/api";

function payloadFromBeneficiary(b: Beneficiary) {
  return {
    bin: b.bin || null,
    app_id: b.app_id || null,
    last_name: b.last_name || null,
    first_name: b.first_name || null,
    middle_name: b.middle_name || null,
    birth_date: b.birth_date || null,
    sex: b.sex || null,
    civil_status: b.civil_status || null,
    address: b.address || null,
    membership_code: b.membership_code || null,
    old_common_code: b.old_common_code || null,
    common_code: b.common_code || null,
    act_tag: b.act_tag || null,
    indicator: b.indicator || null,
    inp_date: b.inp_date || null,
    ssp: b.ssp || null,
    category: b.category || null,
  };
}

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null);
  const [formBeneficiary, setFormBeneficiary] = useState<Beneficiary>(emptyBeneficiary);
  const [deleteTarget, setDeleteTarget] = useState<Beneficiary | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    apiFetch<Beneficiary[]>("/beneficiaries")
      .then((data) => {
        if (!cancelled) setBeneficiaries(Array.isArray(data) ? data : []);
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
    setEditingBeneficiary(null);
    setFormBeneficiary(emptyBeneficiary);
    setFormOpen(true);
  }

  function openEdit(b: Beneficiary) {
    setEditingBeneficiary(b);
    setFormBeneficiary({ ...b });
    setFormOpen(true);
  }

  function handleSave(b: Beneficiary) {
    setError(null);
    if (editingBeneficiary?.id != null) {
      apiFetch<Beneficiary>(`/beneficiaries/${editingBeneficiary.id}`, {
        method: "PUT",
        body: JSON.stringify(payloadFromBeneficiary(b)),
      })
        .then((updated) => {
          setBeneficiaries((prev) =>
            prev.map((item) => (item.id === editingBeneficiary.id ? updated : item))
          );
          setFormOpen(false);
          setEditingBeneficiary(null);
          setFormBeneficiary(emptyBeneficiary);
        })
        .catch((err) => setError(err instanceof Error ? err.message : String(err)));
    } else {
      apiFetch<Beneficiary>("/beneficiaries", {
        method: "POST",
        body: JSON.stringify(payloadFromBeneficiary(b)),
      })
        .then((created) => {
          setBeneficiaries((prev) => [...prev, created]);
          setFormOpen(false);
          setFormBeneficiary(emptyBeneficiary);
        })
        .catch((err) => setError(err instanceof Error ? err.message : String(err)));
    }
  }

  function handleDeleteConfirm() {
    if (deleteTarget?.id == null) return;
    setError(null);
    apiFetch(`/beneficiaries/${deleteTarget.id}`, { method: "DELETE" })
      .then(() => {
        setBeneficiaries((prev) => prev.filter((b) => b.id !== deleteTarget.id));
        setDeleteTarget(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-[var(--foreground)]">
            <UserGroupIcon className="h-7 w-7 shrink-0 text-primary" aria-hidden />
            Beneficiaries
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/70">
            Manage beneficiaries and their details.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[var(--background)] sm:min-h-0 sm:min-w-0 sm:w-auto"
        >
          <PlusIcon className="h-5 w-5 shrink-0" aria-hidden />
          Add beneficiary
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
          <BeneficiaryInsights beneficiaries={beneficiaries} />
          <BeneficiaryTable
            beneficiaries={beneficiaries}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        </>
      )}

      <BeneficiaryFormSlideOver
        open={formOpen}
        beneficiary={formBeneficiary}
        isEdit={!!editingBeneficiary}
        onClose={() => {
          setFormOpen(false);
          setEditingBeneficiary(null);
          setFormBeneficiary(emptyBeneficiary);
        }}
        onSave={handleSave}
        onChange={setFormBeneficiary}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete beneficiary"
        message={
          deleteTarget
            ? `Are you sure you want to delete this beneficiary${deleteTarget.last_name || deleteTarget.first_name ? ` (${[deleteTarget.last_name, deleteTarget.first_name].filter(Boolean).join(" ")})` : ""}? This cannot be undone.`
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
