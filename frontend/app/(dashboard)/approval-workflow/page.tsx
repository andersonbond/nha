"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import type { Project } from "@/components/projects/types";
import type { Program } from "@/components/programs/types";
import { apiFetch } from "@/app/lib/api";

type RejectTarget =
  | { type: "project"; project_code: string; name: string }
  | { type: "program"; project_prog_id: number; name: string }
  | null;

type ApproveTarget =
  | { type: "project"; project: Project }
  | { type: "program"; program: Program }
  | null;

function formatNum(n: number | null | undefined) {
  if (n == null) return "—";
  return n.toLocaleString();
}

export default function ApprovalWorkflowPage() {
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [pendingPrograms, setPendingPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [approveTarget, setApproveTarget] = useState<ApproveTarget>(null);
  const [rejectTarget, setRejectTarget] = useState<RejectTarget>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchPending = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      apiFetch<Project[]>("/projects?approval_status=pending_approval"),
      apiFetch<Program[]>("/programs?approval_status=pending_approval"),
    ])
      .then(([projects, programs]) => {
        setPendingProjects(Array.isArray(projects) ? projects : []);
        setPendingPrograms(Array.isArray(programs) ? programs : []);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  function handleApproveProject(project: Project) {
    const key = `project:${project.project_code}`;
    setActionLoading(key);
    setError(null);
    apiFetch<Project>(`/projects/${project.project_code}`, {
      method: "PATCH",
      body: JSON.stringify({ approval_status: "approved" }),
    })
      .then(() => {
        setPendingProjects((prev) => prev.filter((p) => p.project_code !== project.project_code));
        setApproveTarget(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setActionLoading(null));
  }

  function handleApproveProgram(program: Program) {
    const id = program.project_prog_id ?? 0;
    const key = `program:${id}`;
    setActionLoading(key);
    setError(null);
    apiFetch<Program>(`/programs/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ approval_status: "approved" }),
    })
      .then(() => {
        setPendingPrograms((prev) => prev.filter((p) => (p.project_prog_id ?? 0) !== id));
        setApproveTarget(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setActionLoading(null));
  }

  function openApproveProject(project: Project) {
    setApproveTarget({ type: "project", project });
  }

  function openApproveProgram(program: Program) {
    setApproveTarget({ type: "program", program });
  }

  function confirmApprove() {
    if (!approveTarget) return;
    if (approveTarget.type === "project") {
      handleApproveProject(approveTarget.project);
    } else {
      handleApproveProgram(approveTarget.program);
    }
  }

  function openRejectProject(project: Project) {
    setRejectTarget({
      type: "project",
      project_code: project.project_code,
      name: project.project_name ?? project.project_code,
    });
    setRejectReason("");
  }

  function openRejectProgram(program: Program) {
    const id = program.project_prog_id ?? 0;
    setRejectTarget({
      type: "program",
      project_prog_id: id,
      name: program.mc_ref ?? `Program ${id}`,
    });
    setRejectReason("");
  }

  function confirmReject() {
    if (!rejectTarget) return;
    setError(null);
    if (rejectTarget.type === "project") {
      const key = `project:${rejectTarget.project_code}`;
      setActionLoading(key);
      apiFetch<Project>(`/projects/${rejectTarget.project_code}`, {
        method: "PATCH",
        body: JSON.stringify({
          approval_status: "rejected",
          rejection_reason: rejectReason.trim() || undefined,
        }),
      })
        .then(() => {
          setPendingProjects((prev) =>
            prev.filter((p) => p.project_code !== rejectTarget.project_code)
          );
          setRejectTarget(null);
          setRejectReason("");
        })
        .catch((err) => setError(err instanceof Error ? err.message : String(err)))
        .finally(() => setActionLoading(null));
    } else {
      const key = `program:${rejectTarget.project_prog_id}`;
      setActionLoading(key);
      apiFetch<Program>(`/programs/${rejectTarget.project_prog_id}`, {
        method: "PATCH",
        body: JSON.stringify({
          approval_status: "rejected",
          rejection_reason: rejectReason.trim() || undefined,
        }),
      })
        .then(() => {
          setPendingPrograms((prev) =>
            prev.filter((p) => (p.project_prog_id ?? 0) !== rejectTarget.project_prog_id)
          );
          setRejectTarget(null);
          setRejectReason("");
        })
        .catch((err) => setError(err instanceof Error ? err.message : String(err)))
        .finally(() => setActionLoading(null));
    }
  }

  const isEmpty = pendingProjects.length === 0 && pendingPrograms.length === 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">
            Approval Workflow
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/70">
            Review and approve or reject pending projects and programs.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchPending}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-[var(--foreground)]/70">Loading pending items…</p>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] py-16 text-center shadow-subtle dark:shadow-subtle-dark">
          <ClipboardDocumentCheckIcon className="h-12 w-12 text-[var(--foreground)]/40" />
          <p className="mt-4 text-sm font-medium text-[var(--foreground)]">
            No items pending approval
          </p>
          <p className="mt-1 text-sm text-[var(--foreground)]/60">
            New projects and programs will appear here until approved.
          </p>
        </div>
      ) : (
        <>
          {/* Projects pending approval */}
          <section>
            <h2 className="mb-3 text-base font-semibold text-[var(--foreground)]">
              Projects pending approval
            </h2>
            {pendingProjects.length === 0 ? (
              <p className="text-sm text-[var(--foreground)]/60">No pending projects.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] shadow-subtle dark:shadow-subtle-dark">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--border-subtle)]">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900/50">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Project Code
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Project Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Program ID
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Region
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Cost
                        </th>
                        <th className="relative px-4 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {pendingProjects.map((project) => {
                        const key = `project:${project.project_code}`;
                        const busy = actionLoading === key;
                        return (
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
                            <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--foreground)]/80">
                              {project.project_prog_id ?? "—"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-[var(--foreground)]/80">
                              {project.region_code ?? "—"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-[var(--foreground)]/80">
                              {formatNum(project.project_cost)}
                            </td>
                            <td className="relative whitespace-nowrap px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openApproveProject(project)}
                                  disabled={!!actionLoading}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                                >
                                  {busy ? (
                                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  ) : (
                                    <CheckCircleIcon className="h-4 w-4" />
                                  )}
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openRejectProject(project)}
                                  disabled={!!actionLoading}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* Programs pending approval */}
          <section>
            <h2 className="mb-3 text-base font-semibold text-[var(--foreground)]">
              Programs pending approval
            </h2>
            {pendingPrograms.length === 0 ? (
              <p className="text-sm text-[var(--foreground)]/60">No pending programs.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] shadow-subtle dark:shadow-subtle-dark">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--border-subtle)]">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900/50">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          MC Ref
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Interest Rate
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Max Term (yrs)
                        </th>
                        <th className="relative px-4 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {pendingPrograms.map((program) => {
                        const id = program.project_prog_id ?? 0;
                        const key = `program:${id}`;
                        const busy = actionLoading === key;
                        return (
                          <tr
                            key={id}
                            className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                          >
                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-primary">
                              {id}
                            </td>
                            <td className="px-4 py-3 text-sm text-[var(--foreground)]">
                              {program.mc_ref ?? "—"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-[var(--foreground)]/80">
                              {program.interest_rate ?? "—"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-[var(--foreground)]/80">
                              {program.max_term_yrs ?? "—"}
                            </td>
                            <td className="relative whitespace-nowrap px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openApproveProgram(program)}
                                  disabled={!!actionLoading}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                                >
                                  {busy ? (
                                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  ) : (
                                    <CheckCircleIcon className="h-4 w-4" />
                                  )}
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openRejectProgram(program)}
                                  disabled={!!actionLoading}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {/* Approve confirmation modal */}
      {approveTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="approve-title"
        >
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden
            onClick={() => setApproveTarget(null)}
          />
          <div className="relative w-full max-w-lg rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-5 shadow-lg">
            <h2 id="approve-title" className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
              <CheckCircleIcon className="h-5 w-5 text-primary" aria-hidden />
              Confirm approval
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground)]/80">
              Review the details below before approving.
            </p>

            <div className="mt-4 rounded-md border border-[var(--border-subtle)] bg-[var(--background-elevated)]/50 p-4">
              {approveTarget.type === "project" ? (
                <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-[var(--foreground)]/70">Type</dt>
                    <dd className="mt-0.5 font-medium text-[var(--foreground)]">Project</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--foreground)]/70">Project code</dt>
                    <dd className="mt-0.5 text-[var(--foreground)]">{approveTarget.project.project_code}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--foreground)]/70">Project name</dt>
                    <dd className="mt-0.5 text-[var(--foreground)]">{approveTarget.project.project_name ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--foreground)]/70">Program ID</dt>
                    <dd className="mt-0.5 text-[var(--foreground)]">{approveTarget.project.project_prog_id ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--foreground)]/70">Region</dt>
                    <dd className="mt-0.5 text-[var(--foreground)]">{approveTarget.project.region_code ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--foreground)]/70">Project cost</dt>
                    <dd className="mt-0.5 text-[var(--foreground)]">{formatNum(approveTarget.project.project_cost)}</dd>
                  </div>
                  {approveTarget.project.lot_type != null && approveTarget.project.lot_type !== "" && (
                    <div>
                      <dt className="font-medium text-[var(--foreground)]/70">Lot type</dt>
                      <dd className="mt-0.5 text-[var(--foreground)]">{approveTarget.project.lot_type}</dd>
                    </div>
                  )}
                </dl>
              ) : (
                <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-[var(--foreground)]/70">Type</dt>
                    <dd className="mt-0.5 font-medium text-[var(--foreground)]">Program</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--foreground)]/70">ID</dt>
                    <dd className="mt-0.5 text-[var(--foreground)]">{approveTarget.program.project_prog_id ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--foreground)]/70">MC Ref</dt>
                    <dd className="mt-0.5 text-[var(--foreground)]">{approveTarget.program.mc_ref ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--foreground)]/70">Interest rate</dt>
                    <dd className="mt-0.5 text-[var(--foreground)]">{approveTarget.program.interest_rate ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--foreground)]/70">Delinquency rate</dt>
                    <dd className="mt-0.5 text-[var(--foreground)]">{approveTarget.program.delinquency_rate ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--foreground)]/70">Max term (years)</dt>
                    <dd className="mt-0.5 text-[var(--foreground)]">{approveTarget.program.max_term_yrs ?? "—"}</dd>
                  </div>
                </dl>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setApproveTarget(null)}
                disabled={!!actionLoading}
                className="rounded-md border border-[var(--border-subtle)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmApprove}
                disabled={!!actionLoading}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {actionLoading ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <CheckCircleIcon className="h-4 w-4" />
                )}
                Confirm Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject reason modal */}
      {rejectTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-title"
        >
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden
            onClick={() => setRejectTarget(null)}
          />
          <div className="relative w-full max-w-md rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-5 shadow-lg">
            <h2 id="reject-title" className="text-lg font-semibold text-[var(--foreground)]">
              Reject {rejectTarget.type === "project" ? "project" : "program"}
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground)]/80">
              {rejectTarget.name}
            </p>
            <label htmlFor="reject-reason" className="mt-4 block text-sm font-medium text-[var(--foreground)]">
              Rejection reason (optional)
            </label>
            <textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Incomplete information"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setRejectTarget(null);
                  setRejectReason("");
                }}
                className="rounded-md border border-[var(--border-subtle)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
