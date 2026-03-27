import { NextResponse } from "next/server";

import { fieldOpsJobs } from "@/lib/fieldops-data";
import { toCsv } from "@/lib/utils";

export async function GET() {
  const csv = toCsv(
    fieldOpsJobs.map((job) => ({
      job_code: job.jobCode,
      customer: job.customerCompany,
      contact: job.customerName,
      status: job.status,
      priority: job.priority,
      technician_id: job.technicianId,
      scheduled_start: job.scheduledStart,
      address: job.address
    }))
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="fieldops-jobs.csv"'
    }
  });
}
