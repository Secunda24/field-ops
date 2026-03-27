import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FieldMetricCard({
  label,
  value,
  detail,
  tone = "brand"
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "brand" | "success" | "warning" | "danger" | "info";
}) {
  const toneClass =
    tone === "success"
      ? "text-emerald-600 dark:text-emerald-300"
      : tone === "warning"
        ? "text-amber-600 dark:text-amber-300"
        : tone === "danger"
          ? "text-rose-600 dark:text-rose-300"
          : tone === "info"
            ? "text-sky-600 dark:text-sky-300"
            : "text-brand";

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-muted-foreground">{label}</p>
          <ArrowUpRight className={cn("h-4 w-4", toneClass)} />
        </div>
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}
