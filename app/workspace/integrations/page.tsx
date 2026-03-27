import { IntegrationStatusBadge } from "@/components/fieldops/status-badges";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireFieldOpsRoles } from "@/lib/fieldops-auth";
import { fieldOpsIntegrations } from "@/lib/fieldops-data";

export default function IntegrationsPage() {
  requireFieldOpsRoles(["admin", "dispatcher", "manager"]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Integrations"
        title="Integrations"
        description="Premium-looking placeholders for messaging, maps, accounting, CRM, automation, payments, and webhooks make the platform feel deployment-ready."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fieldOpsIntegrations.map((integration) => (
          <Card key={integration.id} className="h-full">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{integration.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{integration.category}</p>
                </div>
                <IntegrationStatusBadge status={integration.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{integration.description}</p>
              <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Status detail</p>
                <p className="mt-2 text-sm text-muted-foreground">{integration.detail}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
