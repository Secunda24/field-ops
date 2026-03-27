import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { JobStatusBadge } from "@/components/fieldops/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCustomerDetail } from "@/lib/fieldops-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = getCustomerDetail(params.id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer record"
        title={customer.companyName}
        description="Contact detail, service history, active jobs, notes, and commercial context for office and technician handoffs."
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact detail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium">{customer.contactName}</p>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
              <p className="text-sm text-muted-foreground">{customer.address}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                <p className="text-sm text-muted-foreground">Active jobs</p>
                <p className="mt-2 font-display text-3xl font-semibold">{customer.activeJobs}</p>
              </div>
              <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                <p className="text-sm text-muted-foreground">Job history</p>
                <p className="mt-2 font-display text-3xl font-semibold">{customer.jobHistoryCount}</p>
              </div>
              <div className="rounded-3xl border border-border/70 bg-background/60 p-4 sm:col-span-2">
                <p className="text-sm text-muted-foreground">Lifetime value</p>
                <p className="mt-2 font-display text-3xl font-semibold">{formatCurrency(customer.lifetimeValue)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Related jobs timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customer.jobs.map((job) => (
              <div key={job.id} className="rounded-3xl border border-border/70 bg-background/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{job.jobCode}</p>
                    <p className="text-sm text-muted-foreground">{job.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatDate(job.scheduledStart, "EEE, MMM d • HH:mm")}</p>
                  </div>
                  <JobStatusBadge status={job.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
