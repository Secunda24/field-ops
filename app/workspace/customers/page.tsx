import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fieldOpsCustomers, fieldOpsJobs } from "@/lib/fieldops-data";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customers"
        title="Customers and service history"
        description="Searchable customer records with contact detail, address, active jobs, job history, notes, and tags for better office-to-field continuity."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {fieldOpsCustomers.map((customer) => {
          const jobs = fieldOpsJobs.filter((job) => job.customerId === customer.id);
          const active = jobs.filter((job) => !["Completed", "Cancelled", "Invoiced"].includes(job.status)).length;

          return (
            <Link key={customer.id} href={`/workspace/customers/${customer.id}`}>
              <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-xl">
                <CardHeader>
                  <CardTitle>{customer.companyName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{customer.contactName}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                  <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">{customer.address}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{customer.industry}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{active} active jobs</span>
                    <span className="font-medium">{jobs.length} total jobs</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
