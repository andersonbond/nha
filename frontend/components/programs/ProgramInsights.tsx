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
  ChartBarIcon,
  BanknotesIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import type { Program } from "./types";

type ProgramInsightsProps = {
  programs: Program[];
};

function buildByMaxTerm(programs: Program[]): { term: string; count: number }[] {
  const map: Record<string, number> = {};
  programs.forEach((p) => {
    const t = p.max_term_yrs != null ? String(p.max_term_yrs) : "—";
    map[t] = (map[t] || 0) + 1;
  });
  return Object.entries(map)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => {
      if (a.term === "—") return 1;
      if (b.term === "—") return -1;
      return Number(a.term) - Number(b.term);
    })
    .slice(0, 6);
}

function buildInterestBuckets(programs: Program[]): { name: string; value: number }[] {
  const buckets: Record<string, number> = { "0–5%": 0, "5–10%": 0, "10–15%": 0, "15%+": 0 };
  programs.forEach((p) => {
    const r = p.interest_rate ?? 0;
    if (r < 5) buckets["0–5%"]++;
    else if (r < 10) buckets["5–10%"]++;
    else if (r < 15) buckets["10–15%"]++;
    else buckets["15%+"]++;
  });
  return Object.entries(buckets)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));
}

const BUCKET_COLORS = ["var(--primary)", "#64748b", "#94a3b8", "#cbd5e1"];

function safeAvg(values: (number | string | null | undefined)[], defaultVal: number): number {
  const nums = values.map((v) => Number(v)).filter((n) => Number.isFinite(n));
  if (nums.length === 0) return defaultVal;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function ProgramInsights({ programs }: ProgramInsightsProps) {
  const total = programs.length;
  const avgInterest = safeAvg(
    programs.map((p) => p.interest_rate),
    0
  );
  const avgDelinquency = safeAvg(
    programs.map((p) => p.delinquency_rate),
    0
  );
  const withTerm = programs.filter((p) => p.max_term_yrs != null);
  const maxTermRange =
    withTerm.length > 0
      ? `${Math.min(...withTerm.map((p) => p.max_term_yrs!))}–${Math.max(...withTerm.map((p) => p.max_term_yrs!))} yrs`
      : "—";

  const byMaxTerm = buildByMaxTerm(programs);
  const interestBuckets = buildInterestBuckets(programs);

  const topByInterest = [...programs]
    .sort((a, b) => (Number(b.interest_rate) || 0) - (Number(a.interest_rate) || 0))
    .slice(0, 3);

  const statCards = [
    { label: "Programs", value: total.toLocaleString(), icon: DocumentTextIcon },
    { label: "Avg interest", value: `${Number.isFinite(avgInterest) ? avgInterest.toFixed(1) : "0.0"}%`, icon: BanknotesIcon },
    { label: "Avg delinquency", value: `${Number.isFinite(avgDelinquency) ? avgDelinquency.toFixed(1) : "0.0"}%`, icon: ChartBarIcon },
    { label: "Max term", value: maxTermRange, icon: ClockIcon },
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
            By max term (yrs)
          </p>
          {byMaxTerm.length === 0 ? (
            <p className="py-4 text-center text-xs text-[var(--foreground)]/40">No data</p>
          ) : (
            <div className="h-[100px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byMaxTerm} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="term"
                    width={28}
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
                    formatter={(v: number | undefined) => [v ?? 0, "Programs"]}
                  />
                  <Bar dataKey="count" fill="var(--primary)" radius={[0, 3, 3, 0]} maxBarSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="min-h-0 rounded-lg border border-[var(--border-subtle)]/80 bg-[var(--background)]/50 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground)]/60">
            Interest rate
          </p>
          {interestBuckets.length === 0 ? (
            <p className="py-4 text-center text-xs text-[var(--foreground)]/40">No data</p>
          ) : (
            <div className="mx-auto h-[100px] w-full max-w-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={interestBuckets}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={42}
                    paddingAngle={1}
                  >
                    {interestBuckets.map((_, i) => (
                      <Cell key={i} fill={BUCKET_COLORS[i % BUCKET_COLORS.length]} />
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
            Highest interest
          </p>
          {topByInterest.length === 0 ? (
            <p className="py-4 text-center text-xs text-[var(--foreground)]/40">No data</p>
          ) : (
            <ul className="space-y-1.5">
              {topByInterest.map((p) => (
                <li key={p.project_prog_id ?? p.mc_ref ?? ""} className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-medium text-[var(--foreground)]">
                    {(p.mc_ref || `#${p.project_prog_id}`).slice(0, 18)}
                    {(p.mc_ref || `#${p.project_prog_id}`).length > 18 ? "…" : ""}
                  </span>
                  <span className="shrink-0 font-semibold text-primary">{p.interest_rate}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
