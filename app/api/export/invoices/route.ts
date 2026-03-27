import { NextResponse } from "next/server";

import { fieldOpsInvoices } from "@/lib/fieldops-data";
import { toCsv } from "@/lib/utils";

export async function GET() {
  const csv = toCsv(
    fieldOpsInvoices.map((invoice) => ({
      invoice_number: invoice.invoiceNumber,
      customer: invoice.customerName,
      status: invoice.status,
      total: invoice.total,
      issued_at: invoice.issuedAt,
      due_at: invoice.dueAt,
      paid_at: invoice.paidAt ?? ""
    }))
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="fieldops-invoices.csv"'
    }
  });
}
