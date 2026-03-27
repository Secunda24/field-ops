import { notFound } from "next/navigation";

import { JobForm } from "@/components/fieldops/job-form";
import { PageHeader } from "@/components/shared/page-header";
import { requireFieldOpsRoles } from "@/lib/fieldops-auth";
import { getJobById } from "@/lib/fieldops-data";

export default function EditJobPage({ params }: { params: { id: string } }) {
  requireFieldOpsRoles(["admin", "dispatcher", "manager"]);
  const job = getJobById(params.id);

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={job.jobCode}
        title="Edit job"
        description="Update scheduling, priority, field instructions, or technician assignment without leaving the operational workflow."
      />
      <JobForm mode="edit" job={job} />
    </div>
  );
}
