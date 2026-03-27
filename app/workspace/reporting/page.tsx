import { FieldMetricCard } from "@/components/fieldops/metric-card";
import { RevenueMixChart, WeeklyPerformanceChart, WorkloadChart } from "@/components/fieldops/charts";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireFieldOpsRoles } from "@/lib/fieldops-auth";
import { getReportingSnapshot } from "@/lib/fieldops-data";

export default function ReportingPage() {
  requireFieldOpsRoles(["admin", "dispatcher", "manager"]);
  const snapshot = getReportingSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Reporting"
        description="Jobs completed, response times, technician performance, completion rates, high-priority volume, and revenue mix presented with demo-ready polish."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {snapshot.kpis.map((item) => (
          <FieldMetricCard key={item.label} label={item.label} value={item.value} detail={item.detail} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly completion trend</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyPerformanceChart data={snapshot.weeklyTrend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue by job type</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueMixChart data={snapshot.revenueByType} valueKey="revenue" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Technician performance</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkloadChart
            data={snapshot.technicianPerformance.map((item) => ({
              label: item.label.split(" ")[0],
              assigned: item.completed,
              today: Math.max(1, Math.round(item.response / 20))
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
