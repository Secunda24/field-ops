import Link from "next/link";
import { Bell, ChevronRight, FileText, MapPinned, Wrench } from "lucide-react";

import { StatusBreakdownChart, RevenueMixChart, WorkloadChart } from "@/components/fieldops/charts";
import { FieldMetricCard } from "@/components/fieldops/metric-card";
import { JobStatusBadge, PriorityBadge } from "@/components/fieldops/status-badges";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireFieldOpsViewer } from "@/lib/fieldops-auth";
import { getOfficeDashboardSnapshot, getTechnicianDashboardSnapshot } from "@/lib/fieldops-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function WorkspaceDashboardPage() {
  const viewer = requireFieldOpsViewer();

  if (viewer.profile.role === "technician") {
    const snapshot = getTechnicianDashboardSnapshot(viewer.profile.id);

    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Mobile dashboard"
          title={`Welcome back, ${viewer.profile.fullName.split(" ")[0]}`}
          description="Your field schedule, active job flow, recent alerts, and performance summary are all ready on one screen."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldMetricCard label="Today's jobs" value={String(snapshot.todaysJobs.length)} detail="Assigned on your route" />
          <FieldMetricCard label="Checked in" value={snapshot.checkedIn ? "Yes" : "No"} detail="Live attendance status" tone={snapshot.checkedIn ? "success" : "warning"} />
          <FieldMetricCard label="In progress" value={String(snapshot.inProgress.length)} detail="Active and paused work" tone="warning" />
          <FieldMetricCard label="Completed" value={String(snapshot.completed.length)} detail="Ready for office invoicing" tone="success" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's route</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.todaysJobs.slice(0, 4).map((job) => (
              <Link key={job.id} href={`/workspace/jobs/${job.id}`} className="block rounded-3xl border border-border/70 bg-background/60 p-4 transition hover:-translate-y-0.5 hover:shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{job.jobCode}</p>
                    <p className="mt-1 font-semibold">{job.customerCompany}</p>
                    <p className="text-sm text-muted-foreground">{job.address}</p>
                  </div>
                  <JobStatusBadge status={job.status} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <PriorityBadge priority={job.priority} />
                  <span className="text-sm text-muted-foreground">{formatDate(job.scheduledStart, "HH:mm")}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {snapshot.upcomingJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/60 px-4 py-3">
                  <div>
                    <p className="font-medium">{job.customerCompany}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(job.scheduledStart, "EEE, MMM d • HH:mm")}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {snapshot.notifications.map((item) => (
                <div key={item.id} className="rounded-3xl border border-border/70 bg-background/60 p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-brand" />
                    <p className="font-medium">{item.title}</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Performance summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {snapshot.performance.map((item) => (
              <div key={item.label} className="rounded-3xl border border-border/70 bg-background/60 p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 font-display text-3xl font-semibold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const snapshot = getOfficeDashboardSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations overview"
        title="FieldOps command center"
        description="Monitor live jobs, track technicians, keep dispatch moving, and convert completed work into quotes and invoices without breaking flow."
        actions={
          <>
            <Button asChild>
              <Link href="/workspace/jobs/new">Create job</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/workspace/dispatch">Open dispatch</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/workspace/reporting">View reports</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <FieldMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.change}
            tone={
              metric.tone === "accent"
                ? "brand"
                : metric.tone === "warning"
                  ? "warning"
                  : metric.tone === "success"
                    ? "success"
                    : metric.tone === "danger"
                      ? "danger"
                      : "info"
            }
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Jobs by status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBreakdownChart data={snapshot.statusBreakdown} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl bg-brand p-5 text-brand-foreground">
              <p className="text-sm text-brand-foreground/80">Billed revenue snapshot</p>
              <p className="mt-2 font-display text-4xl font-semibold">
                {formatCurrency(snapshot.revenueSummary)}
              </p>
            </div>
            <RevenueMixChart data={snapshot.revenueByType} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Technician workload</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkloadChart data={snapshot.workload} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {snapshot.quickActions.map((action) => (
              <Link key={action.href} href={action.href} className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/60 px-4 py-4 transition hover:border-brand/40 hover:bg-brand-soft/40">
                <div className="flex items-center gap-3">
                  {action.label === "Create job" ? <Wrench className="h-4 w-4 text-brand" /> : action.label === "Open dispatch" ? <MapPinned className="h-4 w-4 text-brand" /> : <FileText className="h-4 w-4 text-brand" />}
                  <span className="font-medium">{action.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity feed</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {snapshot.recentActivity.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 rounded-3xl border border-border/70 bg-background/60 px-4 py-4">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.18em] text-brand">
                {formatDate(item.createdAt, "HH:mm")}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
