"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { apiFetch } from "@/app/lib/api";

type AddressOption = { code: string; name: string };

type AddressLevel = "regions" | "provinces" | "municipalities" | "barangays";

const LEVEL_LABELS: Record<AddressLevel, string> = {
  regions: "Regions",
  provinces: "Provinces",
  municipalities: "Municipalities",
  barangays: "Barangays",
};

export function AddressConfigSection() {
  const [level, setLevel] = useState<AddressLevel>("regions");
  const [regions, setRegions] = useState<AddressOption[]>([]);
  const [provinces, setProvinces] = useState<AddressOption[]>([]);
  const [municipalities, setMunicipalities] = useState<AddressOption[]>([]);
  const [barangays, setBarangays] = useState<AddressOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parentRegion, setParentRegion] = useState("");
  const [parentProvince, setParentProvince] = useState("");
  const [parentMunicipal, setParentMunicipal] = useState("");
  const [formOpen, setFormOpen] = useState<"add" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<AddressOption | null>(null);
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<AddressOption | null>(null);

  const fetchRegions = useCallback(() => {
    setLoading(true);
    setError(null);
    apiFetch<AddressOption[]>("/address/regions")
      .then((data) => setRegions(Array.isArray(data) ? data : []))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const fetchProvinces = useCallback(() => {
    if (!parentRegion) {
      setProvinces([]);
      return;
    }
    setLoading(true);
    setError(null);
    apiFetch<AddressOption[]>(`/address/provinces?region_code=${encodeURIComponent(parentRegion)}`)
      .then((data) => setProvinces(Array.isArray(data) ? data : []))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [parentRegion]);

  const fetchMunicipalities = useCallback(() => {
    if (!parentProvince) {
      setMunicipalities([]);
      return;
    }
    setLoading(true);
    setError(null);
    apiFetch<AddressOption[]>(`/address/municipalities?province_code=${encodeURIComponent(parentProvince)}`)
      .then((data) => setMunicipalities(Array.isArray(data) ? data : []))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [parentProvince]);

  const fetchBarangays = useCallback(() => {
    if (!parentMunicipal) {
      setBarangays([]);
      return;
    }
    setLoading(true);
    setError(null);
    apiFetch<AddressOption[]>(`/address/barangays?municipal_code=${encodeURIComponent(parentMunicipal)}`)
      .then((data) => setBarangays(Array.isArray(data) ? data : []))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [parentMunicipal]);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  useEffect(() => {
    if (level === "provinces" && parentRegion) fetchProvinces();
    else if (level === "municipalities") {
      if (parentRegion) fetchProvinces();
      else setProvinces([]);
      if (parentProvince) fetchMunicipalities();
      else setMunicipalities([]);
    } else if (level === "barangays") {
      if (parentRegion) fetchProvinces();
      else setProvinces([]);
      if (parentProvince) fetchMunicipalities();
      else setMunicipalities([]);
      if (parentMunicipal) fetchBarangays();
      else setBarangays([]);
    }
  }, [level, parentRegion, parentProvince, parentMunicipal, fetchProvinces, fetchMunicipalities, fetchBarangays]);

  const currentList = level === "regions" ? regions : level === "provinces" ? provinces : level === "municipalities" ? municipalities : barangays;

  function openAdd() {
    setEditingItem(null);
    setFormCode("");
    setFormName("");
    setFormError("");
    setFormOpen("add");
  }

  function openEdit(item: AddressOption) {
    setEditingItem(item);
    setFormCode(item.code);
    setFormName(item.name);
    setFormError("");
    setFormOpen("edit");
  }

  function closeForm() {
    setFormOpen(null);
    setEditingItem(null);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const code = formCode.trim();
    const name = formName.trim();
    if (!code || !name) {
      setFormError("Code and name are required.");
      return;
    }
    setSaving(true);
    const base = "/address";
    if (formOpen === "add") {
      const body = level === "regions" ? { code, name } :
        level === "provinces" ? { code, name, region_code: parentRegion } :
        level === "municipalities" ? { code, name, province_code: parentProvince } :
        { code, name, municipal_code: parentMunicipal };
      const path = level === "regions" ? `${base}/regions` : level === "provinces" ? `${base}/provinces` : level === "municipalities" ? `${base}/municipalities` : `${base}/barangays`;
      apiFetch(path, { method: "POST", body: JSON.stringify(body) })
        .then(() => {
          closeForm();
          fetchRegions();
          if (level === "provinces") fetchProvinces();
          else if (level === "municipalities") fetchMunicipalities();
          else if (level === "barangays") fetchBarangays();
        })
        .catch((e) => setFormError(e instanceof Error ? e.message : String(e)))
        .finally(() => setSaving(false));
    } else {
      const path = level === "regions" ? `${base}/regions/${encodeURIComponent(editingItem!.code)}` :
        level === "provinces" ? `${base}/provinces/${encodeURIComponent(editingItem!.code)}` :
        level === "municipalities" ? `${base}/municipalities/${encodeURIComponent(editingItem!.code)}` :
        `${base}/barangays/${encodeURIComponent(editingItem!.code)}`;
      apiFetch(path, { method: "PATCH", body: JSON.stringify({ name }) })
        .then(() => {
          closeForm();
          fetchRegions();
          if (level === "provinces") fetchProvinces();
          else if (level === "municipalities") fetchMunicipalities();
          else if (level === "barangays") fetchBarangays();
        })
        .catch((e) => setFormError(e instanceof Error ? e.message : String(e)))
        .finally(() => setSaving(false));
    }
  }

  function handleDelete(item: AddressOption) {
    setDeleteConfirm(item);
  }

  function confirmDelete() {
    if (!deleteConfirm) return;
    const code = deleteConfirm.code;
    const base = "/address";
    const path = level === "regions" ? `${base}/regions/${encodeURIComponent(code)}` :
      level === "provinces" ? `${base}/provinces/${encodeURIComponent(code)}` :
      level === "municipalities" ? `${base}/municipalities/${encodeURIComponent(code)}` :
      `${base}/barangays/${encodeURIComponent(code)}`;
    apiFetch(path, { method: "DELETE" })
      .then(() => {
        setDeleteConfirm(null);
        fetchRegions();
        if (level === "provinces") fetchProvinces();
        else if (level === "municipalities") fetchMunicipalities();
        else if (level === "barangays") fetchBarangays();
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }

  const cardClass = "rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark";
  const inputClass = "mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]";
  const btnPrimary = "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90";
  const btnSecondary = "rounded-md border border-[var(--border-subtle)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10";

  return (
    <div className="space-y-4">
      <div className={cardClass}>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <MapPinIcon className="h-5 w-5" aria-hidden />
          Address reference data
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground)]/70">
          Manage regions, provinces, municipalities, and barangays. Select a level and use Add / Edit / Delete.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-4">
          {(Object.keys(LEVEL_LABELS) as AddressLevel[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                level === l ? "bg-primary text-primary-foreground" : "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {LEVEL_LABELS[l]}
            </button>
          ))}
        </div>

        {level === "provinces" && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-[var(--foreground)]/80">Region</label>
            <select
              value={parentRegion}
              onChange={(e) => setParentRegion(e.target.value)}
              className={`${inputClass} max-w-xs`}
            >
              <option value="">Select region</option>
              {regions.map((r) => (
                <option key={r.code} value={r.code}>{r.name}</option>
              ))}
            </select>
          </div>
        )}
        {level === "municipalities" && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]/80">Region</label>
              <select
                value={parentRegion}
                onChange={(e) => {
                  setParentRegion(e.target.value);
                  setParentProvince("");
                }}
                className={`${inputClass} max-w-xs`}
              >
                <option value="">Select region</option>
                {regions.map((r) => (
                  <option key={r.code} value={r.code}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]/80">Province</label>
              <select
                value={parentProvince}
                onChange={(e) => setParentProvince(e.target.value)}
                disabled={!parentRegion}
                className={`${inputClass} max-w-xs`}
              >
                <option value="">Select province</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        {level === "barangays" && (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]/80">Region</label>
              <select
                value={parentRegion}
                onChange={(e) => {
                  setParentRegion(e.target.value);
                  setParentProvince("");
                  setParentMunicipal("");
                }}
                className={`${inputClass} max-w-xs`}
              >
                <option value="">Select region</option>
                {regions.map((r) => (
                  <option key={r.code} value={r.code}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]/80">Province</label>
              <select
                value={parentProvince}
                onChange={(e) => {
                  setParentProvince(e.target.value);
                  setParentMunicipal("");
                }}
                disabled={!parentRegion}
                className={`${inputClass} max-w-xs`}
              >
                <option value="">Select province</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]/80">Municipality</label>
              <select
                value={parentMunicipal}
                onChange={(e) => setParentMunicipal(e.target.value)}
                disabled={!parentProvince}
                className={`${inputClass} max-w-xs`}
              >
                <option value="">Select municipality</option>
                {municipalities.map((m) => (
                  <option key={m.code} value={m.code}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-sm text-[var(--foreground)]/70">
            {LEVEL_LABELS[level]}: {currentList.length} entries
          </span>
          <button
            type="button"
            onClick={openAdd}
            disabled={(level === "provinces" && !parentRegion) || (level === "municipalities" && !parentProvince) || (level === "barangays" && !parentMunicipal)}
            className={`inline-flex items-center gap-2 ${btnPrimary} disabled:opacity-50`}
          >
            <PlusIcon className="h-4 w-4" aria-hidden />
            Add {LEVEL_LABELS[level].slice(0, -1)}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>
        )}

        {loading ? (
          <p className="mt-4 text-sm text-[var(--foreground)]/70">Loading…</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-left">
                  <th className="pb-2 pr-4 font-medium text-[var(--foreground)]">Code</th>
                  <th className="pb-2 pr-4 font-medium text-[var(--foreground)]">Name</th>
                  <th className="pb-2 font-medium text-[var(--foreground)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentList.map((item) => (
                  <tr key={item.code} className="border-b border-[var(--border-subtle)]/50">
                    <td className="py-2 pr-4 font-mono text-[var(--foreground)]">{item.code}</td>
                    <td className="py-2 pr-4 text-[var(--foreground)]">{item.name}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="rounded p-1.5 text-[var(--foreground)]/70 hover:bg-black/5 hover:text-[var(--foreground)] dark:hover:bg-white/10"
                          aria-label={`Edit ${item.code}`}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="rounded p-1.5 text-[var(--foreground)]/70 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                          aria-label={`Delete ${item.code}`}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {currentList.length === 0 && !loading && (
              <p className="py-6 text-center text-sm text-[var(--foreground)]/60">No entries. Add one above.</p>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit slide-over */}
      {formOpen && (
        <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/30" aria-hidden onClick={closeForm} />
          <div className="fixed inset-y-0 right-0 flex w-full flex-col bg-[var(--background)] shadow-xl sm:max-w-md">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {formOpen === "add" ? `Add ${LEVEL_LABELS[level].slice(0, -1)}` : `Edit ${LEVEL_LABELS[level].slice(0, -1)}`}
              </h3>
              <button type="button" onClick={closeForm} className="rounded p-2 text-[var(--foreground)]/70 hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex flex-1 flex-col overflow-y-auto p-4">
              <div className="space-y-3">
                <div>
                  <label htmlFor="addr-form-code" className="block text-sm font-medium text-[var(--foreground)]/80">Code</label>
                  <input
                    id="addr-form-code"
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    disabled={formOpen === "edit"}
                    maxLength={level === "regions" ? 8 : level === "provinces" ? 12 : level === "municipalities" ? 14 : 16}
                    className={inputClass}
                  />
                  {formOpen === "edit" && <p className="mt-1 text-xs text-[var(--foreground)]/60">Code cannot be changed when editing.</p>}
                </div>
                <div>
                  <label htmlFor="addr-form-name" className="block text-sm font-medium text-[var(--foreground)]/80">Name</label>
                  <input
                    id="addr-form-name"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    maxLength={255}
                    className={inputClass}
                  />
                </div>
                {formError && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{formError}</p>}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={closeForm} className={btnSecondary}>Cancel</button>
                <button type="submit" disabled={saving} className={`${btnPrimary} disabled:opacity-60`}>
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50" aria-modal="true" role="alertdialog">
          <div className="absolute inset-0 bg-black/30" aria-hidden onClick={() => setDeleteConfirm(null)} />
          <div className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-xl">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Delete {LEVEL_LABELS[level].slice(0, -1)}?</h3>
            <p className="mt-2 text-sm text-[var(--foreground)]/80">
              Delete &quot;{deleteConfirm.name}&quot; ({deleteConfirm.code})? This may fail if it has child entries.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteConfirm(null)} className={btnSecondary}>Cancel</button>
              <button type="button" onClick={confirmDelete} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
