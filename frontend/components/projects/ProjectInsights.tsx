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
  FolderIcon,
  BanknotesIcon,
  ChartBarIcon,
  MapPinIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import type { Project } from "./types";

type ProjectInsightsProps = {
  projects: Project[];
};

function formatMoney(n: number): string {
  if (n >= 1e9) return `₱${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `₱${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `₱${(n / 1e3).toFixed(0)}k`;
  return `₱${n.toLocaleString()}`;
}

function buildByRegion(projects: Project[]): { region: string; count: number }[] {
  const map: Record<string, number> = {};
  projects.forEach((p) => {
    const r = p.region_code?.trim() || "—";
    map[r] = (map[r] || 0) + 1;
  });
  return Object.entries(map)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

function buildByLotType(projects: Project[]): { name: string; value: number }[] {
  const map: Record<string, number> = {};
  projects.forEach((p) => {
    const t = p.lot_type?.trim() || "Other";
    map[t] = (map[t] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

const LOT_TYPE_COLORS = ["var(--primary)", "#64748b", "#94a3b8", "#cbd5e1"];

export function ProjectInsights({ projects }: ProjectInsightsProps) {
  const totalProjects = projects.length;
  const totalCost = projects.reduce((s, p) => s + (p.project_cost != null ? Number(p.project_cost) : 0), 0);
  const withCost = projects.filter((p) => p.project_cost != null && Number(p.project_cost) > 0);
  const avgCost = withCost.length ? totalCost / withCost.length : 0;
  const uniqueRegions = new Set(projects.map((p) => p.region_code?.trim()).filter(Boolean)).size;

  const byRegion = buildByRegion(projects);
  const byLotType = buildByLotType(projects);

  const topByCost = [...projects]
    .filter((p) => p.project_cost != null)
    .sort((a, b) => Number(b.project_cost) - Number(a.project_cost))
    .slice(0, 3);

  const statCards = [
    { label: "Projects", value: totalProjects.toLocaleString(), icon: FolderIcon },
    { label: "Total value", value: formatMoney(totalCost), icon: BanknotesIcon },
    { label: "Avg cost", value: formatMoney(avgCost), icon: ChartBarIcon },
    { label: "Regions", value: String(uniqueRegions), icon: MapPinIcon },
  ];

  return (
    <section className="rounded-xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--background)] to-[var(--background)]/95 p-4 shadow-subtle dark:shadow-subtle-dark" aria-label="Quick insights">
      <div className="mb-3 flex items-center gap-2">
        <SparklesIcon className="h-4 w-4 text-primary" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/70">
          Quick insights
        </span>
      </div>

      {/* Compact stat strip */}
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

      {/* One row: bar + donut + top 3 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="min-h-0 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/50 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]/60">By region</p>
          {byRegion.length === 0 ? (
            <p className="py-4 text-center text-xs text-[var(--foreground)]/40">No data</p>
          ) : (
            <div className="h-[100px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byRegion} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="region" width={32} tick={{ fontSize: 9, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border-subtle)", borderRadius: "6px", fontSize: "11px" }} formatter={(v: number | undefined) => [v ?? 0, "Projects"]} />
                  <Bar dataKey="count" fill="var(--primary)" radius={[0, 3, 3, 0]} maxBarSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="min-h-0 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/50 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]/60">Lot type</p>
          {byLotType.length === 0 ? (
            <p className="py-4 text-center text-xs text-[var(--foreground)]/40">No data</p>
          ) : (
            <div className="mx-auto h-[100px] w-full max-w-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byLotType} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={28} outerRadius={42} paddingAngle={1}>
                    {byLotType.map((_, i) => (
                      <Cell key={i} fill={LOT_TYPE_COLORS[i % LOT_TYPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "var(--background)", border: "1px solid var(--border-subtle)", borderRadius: "6px", fontSize: "11px" }} formatter={(v: number | undefined, name?: string) => [v ?? 0, name ?? ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="min-h-0 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/50 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]/60">Top by cost</p>
          {topByCost.length === 0 ? (
            <p className="py-4 text-center text-xs text-[var(--foreground)]/40">No data</p>
          ) : (
            <ul className="space-y-1.5">
              {topByCost.map((p, i) => (
                <li key={p.project_code} className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-medium text-[var(--foreground)]">{(p.project_name || p.project_code).slice(0, 20)}{(p.project_name || p.project_code).length > 20 ? "…" : ""}</span>
                  <span className="shrink-0 font-semibold text-primary">{formatMoney(Number(p.project_cost))}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
