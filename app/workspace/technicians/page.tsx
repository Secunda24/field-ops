import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireFieldOpsRoles } from "@/lib/fieldops-auth";
import { fieldOpsJobs, fieldOpsTechnicians } from "@/lib/fieldops-data";

export default function TechniciansPage() {
  requireFieldOpsRoles(["admin", "dispatcher", "manager"]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Technicians"
        title="Field team performance"
        description="Track active status, assigned jobs, completed jobs, workload, contact detail, and operational capacity across the technician roster."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {fieldOpsTechnicians.map((technician) => {
          const jobs = fieldOpsJobs.filter((job) => job.technicianId === technician.id);
          const completed = jobs.filter((job) => ["Completed", "Invoiced"].includes(job.status)).length;

          return (
            <Card key={technician.id}>
              <CardHeader>
                <CardTitle>{technician.name}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between rounded-3xl bg-background/60 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="font-medium">{technician.status}</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">Assigned</p>
                    <p className="mt-2 font-display text-3xl font-semibold">{jobs.length}</p>
                  </div>
                  <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="mt-2 font-display text-3xl font-semibold">{completed}</p>
                  </div>
                  <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">Availability</p>
                    <p className="mt-2 text-sm font-medium">{technician.availability}</p>
                  </div>
                </div>
                <div className="grid gap-3 text-sm text-muted-foreground">
                  <p>{technician.phone}</p>
                  <p>{technician.email}</p>
                  <p>{technician.vehicle}</p>
                  <p>{technician.currentLocation}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
