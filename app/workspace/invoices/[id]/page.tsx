import { notFound } from "next/navigation";

import { PrintButton } from "@/components/fieldops/print-button";
import { InvoiceStatusBadge } from "@/components/fieldops/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireFieldOpsRoles } from "@/lib/fieldops-auth";
import { fieldOpsInvoices } from "@/lib/fieldops-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  requireFieldOpsRoles(["admin", "dispatcher", "manager"]);
  const invoice = fieldOpsInvoices.find((item) => item.id === params.id);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">PDF-style invoice view</p>
          <h1 className="font-display text-4xl font-semibold">{invoice.invoiceNumber}</h1>
        </div>
        <PrintButton />
      </div>

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>{invoice.customerName}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{invoice.summary}</p>
          </div>
          <InvoiceStatusBadge status={invoice.status} />
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/70 p-4">
              <p className="text-sm text-muted-foreground">Issued</p>
              <p className="mt-2 font-medium">{formatDate(invoice.issuedAt, "MMM d, yyyy")}</p>
            </div>
            <div className="rounded-3xl border border-border/70 p-4">
              <p className="text-sm text-muted-foreground">Due</p>
              <p className="mt-2 font-medium">{formatDate(invoice.dueAt, "MMM d, yyyy")}</p>
            </div>
            <div className="rounded-3xl border border-border/70 p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="mt-2 font-display text-3xl font-semibold">{formatCurrency(invoice.total)}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 p-4">
            <p className="text-sm font-medium">Invoice scope</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Labor and site attendance</span>
                <span>{formatCurrency(invoice.total * 0.55)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Materials and parts</span>
                <span>{formatCurrency(invoice.total * 0.32)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Callout and travel</span>
                <span>{formatCurrency(invoice.total * 0.13)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
