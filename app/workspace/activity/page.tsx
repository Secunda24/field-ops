import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { requireFieldOpsRoles } from "@/lib/fieldops-auth";
import { fieldOpsActivityLog } from "@/lib/fieldops-data";
import { formatDate } from "@/lib/utils";

export default function ActivityPage() {
  requireFieldOpsRoles(["admin", "dispatcher", "manager"]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Activity log"
        title="System-wide activity"
        description="Track job created, assigned, en route, arrived, notes added, photos uploaded, signatures captured, and completed events from one feed."
      />

      <div className="grid gap-4">
        {fieldOpsActivityLog.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-brand">{item.actor}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDate(item.createdAt, "MMM d • HH:mm")}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
