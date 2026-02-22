"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DocumentTextIcon,
  MapPinIcon,
  TagIcon,
  UserIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import type { Application } from "./types";

type ApplicationInsightsProps = {
  applications: Application[];
};

function buildByApplicationType(apps: Application[]): { type: string; count: number }[] {
  const map: Record<string, number> = {};
  apps.forEach((a) => {
    const t = a.application_type?.trim() || "—";
    map[t] = (map[t] || 0) + 1;
  });
  return Object.entries(map)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

function buildByOrigin(apps: Application[]): { name: string; value: number }[] {
  const map: Record<string, number> = {};
  apps.forEach((a) => {
    const o = a.origin?.trim() || "—";
    map[o] = (map[o] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0);
}

function buildBySex(apps: Application[]): { name: string; value: number }[] {
  const map: Record<string, number> = {};
  apps.forEach((a) => {
    const s = a.sex?.trim() || "—";
    map[s] = (map[s] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

const PIE_COLORS = ["var(--primary)", "#64748b", "#94a3b8", "#cbd5e1"];

export function ApplicationInsights({ applications }: ApplicationInsightsProps) {
  const total = applications.length;
  const withOrigin = applications.filter((a) => (a.origin ?? "").trim()).length;
  const withType = applications.filter((a) => (a.application_type ?? "").trim()).length;
  const withBirthDate = applications.filter((a) => (a.birth_date ?? "").trim()).length;

  const byType = buildByApplicationType(applications);
  const byOrigin = buildByOrigin(applications);
  const bySex = buildBySex(applications);

  const recent = [...applications]
    .filter((a) => a.created_at)
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
    .slice(0, 3);

  const statCards = [
    { label: "Applications", value: total.toLocaleString(), icon: DocumentTextIcon },
    { label: "With type", value: withType.toLocaleString(), icon: TagIcon },
    { label: "With origin", value: withOrigin.toLocaleString(), icon: MapPinIcon },
    { label: "With birth date", value: withBirthDate.toLocaleString(), icon: UserIcon },
  ];

  return (
    <section
      className="rounded-xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--background)] to-[var(--background)]/95 p-4 shadow-subtle dark:shadow-subtle-dark"
      aria-label="Quick insights"
    >
      <div className="mb-3 flex items-center gap-2">
        <SparklesIcon className="h-4 w-4 text-primary" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/70">
          Quick insights
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/80 px-3 py-2"
            >
              <Icon className="h-4 w-4 text-primary/80" aria-hidden />
              <span className="text-xs text-[var(--foreground)]/70">{card.label}</span>
              <span className="text-sm font-semibold text-[var(--foreground)]">{card.value}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="min-h-0 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/50 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]/60">
            By application type
          </p>
          {byType.length === 0 ? (
            <p className="py-4 text-center text-xs text-[var(--foreground)]/40">No data</p>
          ) : (
            <div className="h-[100px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byType} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="type"
                    width={40}
                    tick={{ fontSize: 9, fill: "var(--foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "6px",
                      fontSize: "11px",
                    }}
                    formatter={(v: number | undefined) => [v ?? 0, "Applications"]}
                  />
                  <Bar dataKey="count" fill="var(--primary)" radius={[0, 3, 3, 0]} maxBarSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="min-h-0 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/50 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]/60">
            By origin
          </p>
          {byOrigin.length === 0 ? (
            <p className="py-4 text-center text-xs text-[var(--foreground)]/40">No data</p>
          ) : (
            <div className="mx-auto h-[100px] w-full max-w-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byOrigin}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={42}
                    paddingAngle={1}
                  >
                    {byOrigin.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "6px",
                      fontSize: "11px",
                    }}
                    formatter={(v: number | undefined, name?: string) => [v ?? 0, name ?? ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="min-h-0 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/50 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]/60">
            By sex
          </p>
          {bySex.length === 0 ? (
            <p className="py-4 text-center text-xs text-[var(--foreground)]/40">No data</p>
          ) : (
            <div className="mx-auto h-[100px] w-full max-w-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bySex}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={42}
                    paddingAngle={1}
                  >
                    {bySex.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "6px",
                      fontSize: "11px",
                    }}
                    formatter={(v: number | undefined, name?: string) => [v ?? 0, name ?? ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {recent.length > 0 && (
        <div className="mt-3 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/50 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]/60">
            Recent applications
          </p>
          <ul className="space-y-1.5">
            {recent.map((a) => (
              <li key={a.app_id} className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate font-medium text-[var(--foreground)]">
                  {[a.last_name, a.first_name].filter(Boolean).join(", ") || a.prequalification_no || a.app_id.slice(0, 8)}
                </span>
                <span className="shrink-0 text-[var(--foreground)]/60">
                  {a.application_type ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
