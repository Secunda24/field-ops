import { PageHeader } from "@/components/shared/page-header";
import { QuoteStatusBadge } from "@/components/fieldops/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireFieldOpsRoles } from "@/lib/fieldops-auth";
import { fieldOpsQuotes } from "@/lib/fieldops-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function QuotesPage() {
  requireFieldOpsRoles(["admin", "dispatcher", "manager"]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quotes"
        title="Quote pipeline"
        description="Create, present, approve, and convert quotes into scheduled work with believable commercial detail for demos."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {fieldOpsQuotes.map((quote) => (
          <Card key={quote.id}>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{quote.quoteNumber}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{quote.customerName}</p>
              </div>
              <QuoteStatusBadge status={quote.status} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="mt-2 font-display text-3xl font-semibold">{formatCurrency(quote.total)}</p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                  <p className="text-sm text-muted-foreground">Valid until</p>
                  <p className="mt-2 font-medium">{formatDate(quote.validUntil, "MMM d, yyyy")}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{quote.approvalNote}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
