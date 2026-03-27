"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Paperclip, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fieldOpsTechnicians, type FieldOpsJob } from "@/lib/fieldops-data";

const schema = z.object({
  customerName: z.string().min(2),
  contactNumber: z.string().min(7),
  email: z.string().email(),
  address: z.string().min(8),
  jobType: z.string().min(2),
  description: z.string().min(20),
  priority: z.string().min(2),
  technicianId: z.string().min(2),
  scheduledDate: z.string().min(4),
  scheduledTime: z.string().min(4),
  attachments: z.string().optional(),
  estimatedDuration: z.string().min(1),
  materialsNeeded: z.string().optional(),
  internalNotes: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

function toDefaults(job?: FieldOpsJob | null): FormValues {
  return {
    customerName: job?.customerCompany ?? "",
    contactNumber: job?.customerPhone ?? "",
    email: job?.customerEmail ?? "",
    address: job?.address ?? "",
    jobType: job?.jobType ?? "installation",
    description: job?.description ?? "",
    priority: job?.priority ?? "Normal",
    technicianId: job?.technicianId ?? fieldOpsTechnicians[0].id,
    scheduledDate: job?.scheduledStart?.slice(0, 10) ?? "2026-03-27",
    scheduledTime: job?.scheduledStart?.slice(11, 16) ?? "09:00",
    attachments: "",
    estimatedDuration: String(job?.estimatedDurationHours ?? 2),
    materialsNeeded: "",
    internalNotes: job?.internalNotes ?? ""
  };
}

export function JobForm({
  mode,
  job
}: {
  mode: "create" | "edit";
  job?: FieldOpsJob | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(job)
  });

  async function submit() {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setLoading(false);
    toast.success(mode === "create" ? "Demo job created." : "Demo job updated.");
    router.push(job ? `/workspace/jobs/${job.id}` : "/workspace/jobs");
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Create new job" : "Edit job"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer name</Label>
              <Input id="customerName" {...form.register("customerName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact number</Label>
              <Input id="contactNumber" {...form.register("contactNumber")} />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...form.register("address")} />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Job type</Label>
              <Select value={form.watch("jobType")} onValueChange={(value) => form.setValue("jobType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {["installation", "repair", "maintenance", "inspection", "callout", "emergency service", "servicing", "follow-up visit"].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={form.watch("priority")} onValueChange={(value) => form.setValue("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {["Low", "Normal", "High", "Urgent"].map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assign technician</Label>
              <Select
                value={form.watch("technicianId")}
                onValueChange={(value) => form.setValue("technicianId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose technician" />
                </SelectTrigger>
                <SelectContent>
                  {fieldOpsTechnicians.map((technician) => (
                    <SelectItem key={technician.id} value={technician.id}>
                      {technician.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled date</Label>
              <Input id="scheduledDate" type="date" {...form.register("scheduledDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Scheduled time</Label>
              <Input id="scheduledTime" type="time" {...form.register("scheduledTime")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Estimated duration (hours)</Label>
              <Input id="estimatedDuration" {...form.register("estimatedDuration")} />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments</Label>
              <div className="relative">
                <Paperclip className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="attachments" placeholder="Permit.pdf, photo.jpg" className="pl-10" {...form.register("attachments")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="materialsNeeded">Materials needed</Label>
              <Input id="materialsNeeded" placeholder="Cable, fittings, filters..." {...form.register("materialsNeeded")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="internalNotes">Internal notes</Label>
            <Textarea id="internalNotes" {...form.register("internalNotes")} />
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-20 z-20 rounded-[2rem] border border-border/70 bg-background/90 p-4 shadow-2xl backdrop-blur lg:bottom-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Validation is active and the form is set up for production-style UX.
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {mode === "create" ? "Save job" : "Update job"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
