import { PageHeader } from "@/components/shared/page-header";
import { JobsView } from "@/components/fieldops/jobs-view";
import { Button } from "@/components/ui/button";
import { requireFieldOpsViewer } from "@/lib/fieldops-auth";
import { getJobsForRole } from "@/lib/fieldops-data";
import Link from "next/link";

export default function JobsPage() {
  const viewer = requireFieldOpsViewer();
  const jobs = getJobsForRole(viewer.profile.role, viewer.technician?.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={viewer.profile.role === "technician" ? "Assigned jobs" : "Jobs management"}
        title={viewer.profile.role === "technician" ? "Your live jobs" : "Jobs"}
        description={
          viewer.profile.role === "technician"
            ? "Open every assigned job with one tap, keep statuses updated, and push notes, photos, and signatures back to the office."
            : "Search the schedule, filter by status and priority, open live job cards, and keep the field team moving."
        }
        actions={
          viewer.profile.role !== "technician" ? (
            <Button variant="outline" asChild>
              <Link href="/api/export/jobs">Export CSV</Link>
            </Button>
          ) : null
        }
      />
      <JobsView role={viewer.profile.role} jobs={jobs} />
    </div>
  );
}
