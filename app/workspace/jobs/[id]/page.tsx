import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, MapPin, Phone, Printer, Send, SquarePen } from "lucide-react";

import { JobDetailConsole } from "@/components/fieldops/job-detail-console";
import { PriorityBadge, JobStatusBadge } from "@/components/fieldops/status-badges";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireFieldOpsViewer } from "@/lib/fieldops-auth";
import { getJobById } from "@/lib/fieldops-data";
import { formatDate } from "@/lib/utils";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const viewer = requireFieldOpsViewer();
  const job = getJobById(params.id);

  if (!job) {
    notFound();
  }

  if (viewer.profile.role === "technician" && viewer.technician?.id !== job.technicianId) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={job.jobCode}
        title={job.title}
        description="This is the core demo flow: customer detail, timeline, attendance, photos, materials, signature capture, and office-ready completion data."
        actions={
          <>
            {viewer.profile.role !== "technician" ? (
              <Button variant="outline" asChild>
                <Link href={`/workspace/jobs/${job.id}/edit`}>
                  <SquarePen className="mr-2 h-4 w-4" />
                  Edit job
                </Link>
              </Button>
            ) : null}
            <Button variant="outline" asChild>
              <Link href={`/workspace/jobs/${job.id}/sheet`}>
                <Printer className="mr-2 h-4 w-4" />
                Print job sheet
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Status</p>
                <JobStatusBadge status={job.status} />
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Priority</p>
                <PriorityBadge priority={job.priority} />
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Job type</p>
                <p className="font-medium">{job.jobType}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Scheduled</p>
                <p className="font-medium">{formatDate(job.scheduledStart, "EEE, MMM d • HH:mm")}</p>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Description</p>
                <p className="text-sm text-muted-foreground">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer and site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">{job.customerCompany}</p>
                <p className="text-sm text-muted-foreground">{job.customerName}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-brand" />
                    <span className="font-medium">Contact</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{job.customerPhone}</p>
                  <p className="text-sm text-muted-foreground">{job.customerEmail}</p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand" />
                    <span className="font-medium">Site address</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{job.address}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Customer instructions</p>
                  <p className="mt-2 text-sm text-muted-foreground">{job.customerInstructions}</p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Internal notes</p>
                  <p className="mt-2 text-sm text-muted-foreground">{job.internalNotes}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" asChild>
                  <Link href={`tel:${job.customerPhone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call customer
                  </Link>
                </Button>
                <Button variant="outline">
                  <MapPin className="mr-2 h-4 w-4" />
                  Open in maps
                </Button>
                <Button variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  Send update
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.timeline.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="mt-1 h-3.5 w-3.5 rounded-full bg-brand" />
                  <div className="pb-4">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-brand">
                      {formatDate(item.timestamp, "MMM d • HH:mm")} • {item.actor}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attached files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.files.length ? (
                job.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/60 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-brand" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{file.category}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{file.size}</span>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-border/80 px-4 py-6 text-sm text-muted-foreground">
                  No supporting files attached yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <JobDetailConsole job={job} />
      </div>
    </div>
  );
}
