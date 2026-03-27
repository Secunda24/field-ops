import { DispatchBoard } from "@/components/fieldops/dispatch-board";
import { PageHeader } from "@/components/shared/page-header";
import { requireFieldOpsRoles } from "@/lib/fieldops-auth";
import { getDispatchSnapshot } from "@/lib/fieldops-data";

export default function DispatchPage() {
  requireFieldOpsRoles(["admin", "dispatcher", "manager"]);
  const snapshot = getDispatchSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Scheduling and dispatch"
        title="Dispatch board"
        description="A high-impact scheduling view for day and week planning, technician workload, quick reassignment, and operational visibility."
      />
      <DispatchBoard snapshot={snapshot} />
    </div>
  );
}
