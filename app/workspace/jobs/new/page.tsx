import { JobForm } from "@/components/fieldops/job-form";
import { PageHeader } from "@/components/shared/page-header";
import { requireFieldOpsRoles } from "@/lib/fieldops-auth";

export default function NewJobPage() {
  requireFieldOpsRoles(["admin", "dispatcher", "manager"]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Office workflow"
        title="Create and assign a job"
        description="Capture the customer request, validate the detail, assign the right technician, and schedule the site visit with clean, mobile-friendly form UX."
      />
      <JobForm mode="create" />
    </div>
  );
}
