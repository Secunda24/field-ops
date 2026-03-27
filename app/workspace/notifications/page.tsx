import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { requireFieldOpsViewer } from "@/lib/fieldops-auth";
import { getNotificationsForRole } from "@/lib/fieldops-data";
import { formatDate } from "@/lib/utils";

export default function NotificationsPage() {
  const viewer = requireFieldOpsViewer();
  const notifications = getNotificationsForRole(viewer.profile.role);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Notifications"
        title="Notification center"
        description="New jobs, reschedules, overdue escalations, quote approvals, invoice payments, and technician updates all surface here."
      />

      <div className="grid gap-4">
        {notifications.map((item) => (
          <Link key={item.id} href={item.href}>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-xl">
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.18em] text-brand">
                  {formatDate(item.createdAt, "MMM d • HH:mm")}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
