import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentAnalyses } from "@/components/dashboard/RecentAnalyses";

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">
          Overview of recent clinical coding analyses and compliance checks.
        </p>
      </div>

      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAnalyses />
        {/* Placeholder for future QuickAsk or system status widget */}
        <div className="border border-surface-border rounded-lg bg-surface-card/50 flex items-center justify-center min-h-[300px]">
          <p className="text-sm text-text-muted">System Status: All Services Operational</p>
        </div>
      </div>
    </div>
  );
}