import { ChartBarSquareIcon } from "@heroicons/react/24/outline";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardBreakdown } from "@/components/dashboard/DashboardBreakdown";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-[var(--foreground)]">
          <ChartBarSquareIcon className="h-7 w-7 shrink-0 text-primary" aria-hidden />
          Lot Information System
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground)]/70">
          Dashboard – Overview of applications, beneficiaries, and lot information
        </p>
      </div>

      <DashboardStats />
      <DashboardBreakdown />
      <RecentActivity />
    </div>
  );
}
