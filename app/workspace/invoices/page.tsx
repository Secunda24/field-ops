import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { InvoiceStatusBadge } from "@/components/fieldops/status-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireFieldOpsRoles } from "@/lib/fieldops-auth";
import { fieldOpsInvoices } from "@/lib/fieldops-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function InvoicesPage() {
  requireFieldOpsRoles(["admin", "dispatcher", "manager"]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Invoices"
        title="Invoice list"
        description="Link invoices to completed jobs, track payment status, and open a print-friendly invoice view for PDF export."
        actions={
          <Button variant="outline" asChild>
            <Link href="/api/export/invoices">Export CSV</Link>
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {fieldOpsInvoices.map((invoice) => (
          <Link key={invoice.id} href={`/workspace/invoices/${invoice.id}`}>
            <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-xl">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle>{invoice.invoiceNumber}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{invoice.customerName}</p>
                </div>
                <InvoiceStatusBadge status={invoice.status} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="mt-2 font-display text-3xl font-semibold">{formatCurrency(invoice.total)}</p>
                  </div>
                  <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">Due date</p>
                    <p className="mt-2 font-medium">{formatDate(invoice.dueAt, "MMM d, yyyy")}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{invoice.summary}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
