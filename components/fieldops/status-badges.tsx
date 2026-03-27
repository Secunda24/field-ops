import { Badge } from "@/components/ui/badge";
import {
  getIntegrationStatusTone,
  getInvoiceStatusTone,
  getJobStatusTone,
  getPriorityTone,
  getQuoteStatusTone,
  type FieldOpsIntegrationStatus,
  type FieldOpsInvoiceStatus,
  type FieldOpsJobStatus,
  type FieldOpsPriority,
  type FieldOpsQuoteStatus
} from "@/lib/fieldops-data";

export function JobStatusBadge({ status }: { status: FieldOpsJobStatus }) {
  return <Badge variant={getJobStatusTone(status)}>{status}</Badge>;
}

export function PriorityBadge({ priority }: { priority: FieldOpsPriority }) {
  return <Badge variant={getPriorityTone(priority)}>{priority}</Badge>;
}

export function QuoteStatusBadge({ status }: { status: FieldOpsQuoteStatus }) {
  return <Badge variant={getQuoteStatusTone(status)}>{status}</Badge>;
}

export function InvoiceStatusBadge({ status }: { status: FieldOpsInvoiceStatus }) {
  return <Badge variant={getInvoiceStatusTone(status)}>{status}</Badge>;
}

export function IntegrationStatusBadge({ status }: { status: FieldOpsIntegrationStatus }) {
  return <Badge variant={getIntegrationStatusTone(status)}>{status}</Badge>;
}
