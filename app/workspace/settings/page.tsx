import { BrandingForm } from "@/components/forms/branding-form";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSettingsSnapshot } from "@/lib/fieldops-data";
import { requireFieldOpsRoles } from "@/lib/fieldops-auth";

export default function SettingsPage() {
  requireFieldOpsRoles(["admin", "manager"]);
  const snapshot = getSettingsSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Workspace settings"
        description="Branding, business hours, technician roles, notification defaults, quote and invoice defaults, theme, and support contact details."
      />

      <BrandingForm settings={snapshot.branding} />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Business hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.businessHours.map((item) => (
              <div key={item.day} className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/60 px-4 py-3">
                <span className="font-medium">{item.day}</span>
                <span className="text-sm text-muted-foreground">{item.hours}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Defaults</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <p className="font-medium">Job priorities</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {snapshot.defaultPriorities.join(", ")}
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <p className="font-medium">Technician roles</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {snapshot.technicianRoles.join(", ")}
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <p className="font-medium">Invoice defaults</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Payment terms: {snapshot.invoiceDefaults.paymentTerms}
              </p>
              <p className="text-sm text-muted-foreground">
                Quote validity: {snapshot.invoiceDefaults.quoteValidity}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
