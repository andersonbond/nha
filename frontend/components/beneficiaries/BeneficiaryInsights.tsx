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
  UserGroupIcon,
  TagIcon,
  ChartBarIcon,
  IdentificationIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import type { Beneficiary } from "./types";

type BeneficiaryInsightsProps = {
  beneficiaries: Beneficiary[];
};

function buildByCategory(bens: Beneficiary[]): { category: string; count: number }[] {
  const map: Record<string, number> = {};
  bens.forEach((b) => {
    const c = b.category?.trim() || "—";
    map[c] = (map[c] || 0) + 1;
  });
  return Object.entries(map)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

function buildBySex(bens: Beneficiary[]): { name: string; value: number }[] {
  const map: Record<string, number> = {};
  bens.forEach((b) => {
    const s = b.sex?.trim() || "—";
    map[s] = (map[s] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function buildByCivilStatus(bens: Beneficiary[]): { name: string; value: number }[] {
  const map: Record<string, number> = {};
  bens.forEach((b) => {
    const c = b.civil_status?.trim() || "—";
    map[c] = (map[c] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

const PIE_COLORS = ["var(--primary)", "#64748b", "#94a3b8", "#cbd5e1"];

export function BeneficiaryInsights({ beneficiaries }: BeneficiaryInsightsProps) {
  const total = beneficiaries.length;
  const withBin = beneficiaries.filter((b) => (b.bin ?? "").trim()).length;
  const withCategory = beneficiaries.filter((b) => (b.category ?? "").trim()).length;
  const uniqueAppIds = new Set(beneficiaries.map((b) => b.app_id?.trim()).filter(Boolean)).size;

  const byCategory = buildByCategory(beneficiaries);
  const bySex = buildBySex(beneficiaries);
  const byCivilStatus = buildByCivilStatus(beneficiaries);

  const statCards = [
    { label: "Beneficiaries", value: total.toLocaleString(), icon: UserGroupIcon },
    { label: "With BIN", value: withBin.toLocaleString(), icon: IdentificationIcon },
    { label: "Categories", value: withCategory.toLocaleString(), icon: TagIcon },
    { label: "App IDs", value: String(uniqueAppIds), icon: ChartBarIcon },
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
            By category
          </p>
          {byCategory.length === 0 ? (
            <p className="py-4 text-center text-xs text-[var(--foreground)]/40">No data</p>
          ) : (
            <div className="h-[100px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="category"
                    width={36}
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
                    formatter={(v: number | undefined) => [v ?? 0, "Beneficiaries"]}
                  />
                  <Bar dataKey="count" fill="var(--primary)" radius={[0, 3, 3, 0]} maxBarSize={14} />
                </BarChart>
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
            <div className="mx-auto h-[100px] w-full max-w-[140px]">
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

        <div className="min-h-0 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/50 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]/60">
            By civil status
          </p>
          {byCivilStatus.length === 0 ? (
            <p className="py-4 text-center text-xs text-[var(--foreground)]/40">No data</p>
          ) : (
            <div className="mx-auto h-[100px] w-full max-w-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCivilStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={42}
                    paddingAngle={1}
                  >
                    {byCivilStatus.map((_, i) => (
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
    </section>
  );
}
