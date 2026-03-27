"use client";

import { useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Filter, Plus, Search } from "lucide-react";

import { DataTable } from "@/components/tables/data-table";
import { PriorityBadge, JobStatusBadge } from "@/components/fieldops/status-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FieldOpsJob, FieldOpsRole } from "@/lib/fieldops-data";
import { formatDate } from "@/lib/utils";

function OfficeJobsTable({ jobs }: { jobs: FieldOpsJob[] }) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = jobs.filter((job) => {
    const haystack = `${job.jobCode} ${job.customerCompany} ${job.customerName} ${job.address}`.toLowerCase();
    return (
      (statusFilter === "all" || job.status === statusFilter) &&
      (priorityFilter === "all" || job.priority === priorityFilter) &&
      (jobTypeFilter === "all" || job.jobType === jobTypeFilter) &&
      (!search || haystack.includes(search.toLowerCase()))
    );
  });

  const columns: ColumnDef<FieldOpsJob>[] = [
    {
      accessorKey: "jobCode",
      header: "Job ID",
      cell: ({ row }) => (
        <Link href={`/workspace/jobs/${row.original.id}`} className="font-semibold text-brand">
          {row.original.jobCode}
        </Link>
      )
    },
    {
      accessorKey: "customerCompany",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.customerCompany}</p>
          <p className="text-xs text-muted-foreground">{row.original.customerName}</p>
        </div>
      )
    },
    {
      accessorKey: "jobType",
      header: "Job type",
      cell: ({ row }) => row.original.jobType
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => <PriorityBadge priority={row.original.priority} />
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <JobStatusBadge status={row.original.status} />
    },
    {
      accessorKey: "scheduledStart",
      header: "Scheduled",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{formatDate(row.original.scheduledStart, "MMM d")}</p>
          <p className="text-xs text-muted-foreground">{formatDate(row.original.scheduledStart, "HH:mm")}</p>
        </div>
      )
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.address}</span>
    },
    {
      accessorKey: "updatedAt",
      header: "Last updated",
      cell: ({ row }) => formatDate(row.original.updatedAt, "MMM d, HH:mm")
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1.6fr_repeat(3,minmax(0,1fr))]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jobs, customer, or site..."
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["New", "Assigned", "En Route", "On Site", "In Progress", "Paused", "Waiting on Client", "Completed", "Invoiced", "Cancelled", "Overdue"].map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {["Low", "Normal", "High", "Urgent"].map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All job types</SelectItem>
              {["installation", "repair", "maintenance", "inspection", "callout", "emergency service", "servicing", "follow-up visit"].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <DataTable columns={columns} data={filtered} searchKey="customerCompany" placeholder="Search customer..." />
    </div>
  );
}

function TechnicianJobList({ jobs }: { jobs: FieldOpsJob[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = jobs.filter((job) => filter === "all" || job.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", "Assigned", "En Route", "On Site", "In Progress", "Paused", "Completed"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${filter === item ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {item === "all" ? "All jobs" : item}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filtered.map((job) => (
          <Link key={job.id} href={`/workspace/jobs/${job.id}`}>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-xl">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">{job.jobCode}</p>
                    <h3 className="mt-1 font-semibold">{job.customerCompany}</h3>
                    <p className="text-sm text-muted-foreground">{job.customerName}</p>
                  </div>
                  <JobStatusBadge status={job.status} />
                </div>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Scheduled</p>
                    <p className="font-medium">{formatDate(job.scheduledStart, "EEE, MMM d • HH:mm")}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Priority</p>
                    <PriorityBadge priority={job.priority} />
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Address</p>
                  <p className="mt-1 text-sm">{job.address}</p>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{job.jobType}</span>
                  <span className="text-sm font-medium text-brand">Open job</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function JobsView({
  role,
  jobs
}: {
  role: FieldOpsRole;
  jobs: FieldOpsJob[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Search, filter, and open live job cards</span>
        </div>
        {role !== "technician" ? (
          <Button asChild>
            <Link href="/workspace/jobs/new">
              <Plus className="mr-2 h-4 w-4" />
              Create new job
            </Link>
          </Button>
        ) : null}
      </div>
      {role === "technician" ? <TechnicianJobList jobs={jobs} /> : <OfficeJobsTable jobs={jobs} />}
    </div>
  );
}
