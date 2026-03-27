import { notFound } from "next/navigation";

import { PrintButton } from "@/components/fieldops/print-button";
import { JobStatusBadge, PriorityBadge } from "@/components/fieldops/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireFieldOpsViewer } from "@/lib/fieldops-auth";
import { getJobById } from "@/lib/fieldops-data";
import { formatDate } from "@/lib/utils";

export default function JobSheetPage({ params }: { params: { id: string } }) {
  requireFieldOpsViewer();
  const job = getJobById(params.id);

  if (!job) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 print:px-0">
      <div className="flex items-center justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Print-friendly job sheet</p>
          <h1 className="font-display text-4xl font-semibold">{job.jobCode}</h1>
        </div>
        <PrintButton />
      </div>

      <Card className="print:shadow-none">
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Customer</p>
              <p className="mt-2 font-semibold">{job.customerCompany}</p>
              <p className="text-sm text-muted-foreground">{job.customerName}</p>
              <p className="mt-2 text-sm text-muted-foreground">{job.address}</p>
            </div>
            <div className="rounded-3xl border border-border/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Schedule</p>
              <p className="mt-2 font-semibold">{formatDate(job.scheduledStart, "EEE, MMM d yyyy • HH:mm")}</p>
              <div className="mt-3 flex gap-3">
                <JobStatusBadge status={job.status} />
                <PriorityBadge priority={job.priority} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Description</p>
            <p className="mt-2 text-sm text-muted-foreground">{job.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Labor notes</p>
              <p className="mt-2 text-sm text-muted-foreground">{job.laborNotes}</p>
            </div>
            <div className="rounded-3xl border border-border/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Work summary</p>
              <p className="mt-2 text-sm text-muted-foreground">{job.workSummary}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
