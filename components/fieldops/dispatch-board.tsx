"use client";

import { useState } from "react";
import { MapPin, MoveRight, Route, Timer } from "lucide-react";

import { JobStatusBadge, PriorityBadge } from "@/components/fieldops/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FieldOpsJob, FieldOpsTechnician } from "@/lib/fieldops-data";
import { formatDate } from "@/lib/utils";

type DispatchSnapshot = {
  dayColumns: Array<{ technician: FieldOpsTechnician; jobs: FieldOpsJob[] }>;
  weekMatrix: Array<{
    label: string;
    technicians: Array<{ technician: FieldOpsTechnician; jobs: FieldOpsJob[] }>;
  }>;
  filters: {
    technicians: string[];
    dates: {
      today: string;
      end: string;
    };
  };
};

export function DispatchBoard({
  snapshot
}: {
  snapshot: DispatchSnapshot;
}) {
  const [selectedTechnician, setSelectedTechnician] = useState("all");

  return (
    <Tabs defaultValue="day" className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <TabsList>
          <TabsTrigger value="day">Day view</TabsTrigger>
          <TabsTrigger value="week">Week view</TabsTrigger>
        </TabsList>
        <div className="flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedTechnician("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${selectedTechnician === "all" ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}
          >
            All technicians
          </button>
          {snapshot.filters.technicians.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelectedTechnician(name)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${selectedTechnician === name ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <TabsContent value="day" className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-4">
          {snapshot.dayColumns
            .filter((column) => selectedTechnician === "all" || column.technician.name === selectedTechnician)
            .map((column) => (
              <Card key={column.technician.id}>
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>{column.technician.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{column.technician.region}</p>
                    </div>
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                      {column.technician.availability}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {column.jobs.map((job) => (
                    <div key={job.id} className="rounded-3xl border border-border/70 bg-background/60 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                            {formatDate(job.scheduledStart, "HH:mm")} - {formatDate(job.scheduledEnd, "HH:mm")}
                          </p>
                          <p className="mt-1 font-semibold">{job.customerCompany}</p>
                          <p className="text-sm text-muted-foreground">{job.jobType}</p>
                        </div>
                        <JobStatusBadge status={job.status} />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <PriorityBadge priority={job.priority} />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{job.suburb}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="week">
        <div className="space-y-4">
          {snapshot.weekMatrix.map((day) => (
            <Card key={day.label}>
              <CardHeader>
                <CardTitle>{day.label}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                {day.technicians
                  .filter((item) => selectedTechnician === "all" || item.technician.name === selectedTechnician)
                  .map((item) => (
                    <div key={`${day.label}-${item.technician.id}`} className="rounded-3xl border border-border/70 bg-background/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{item.technician.name}</p>
                          <p className="text-xs text-muted-foreground">{item.technician.region}</p>
                        </div>
                        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                          {item.jobs.length} jobs
                        </span>
                      </div>
                      <div className="mt-4 space-y-3">
                        {item.jobs.length ? (
                          item.jobs.map((job) => (
                            <div key={job.id} className="rounded-2xl border border-border/60 bg-card px-3 py-3">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium">{job.jobCode}</p>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(job.scheduledStart, "HH:mm")}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">{job.customerCompany}</p>
                              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                <Route className="h-3.5 w-3.5" />
                                <span>{job.suburb}</span>
                                <MoveRight className="h-3.5 w-3.5" />
                                <Timer className="h-3.5 w-3.5" />
                                <span>{job.estimatedDurationHours}h</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-border/80 px-4 py-6 text-sm text-muted-foreground">
                            Available capacity for new jobs.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
