"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, Clock3, FileUp, PauseCircle, PlayCircle, Plus, Save, Truck } from "lucide-react";
import { toast } from "sonner";

import { JobStatusBadge } from "@/components/fieldops/status-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type FieldOpsJob,
  type FieldOpsJobMaterial,
  type FieldOpsJobSignature,
  type FieldOpsJobNote,
  type FieldOpsJobPhoto,
  type FieldOpsPhotoStage
} from "@/lib/fieldops-data";
import { formatDate } from "@/lib/utils";

type JobDetailData = FieldOpsJob & {
  notes: FieldOpsJobNote[];
  photos: FieldOpsJobPhoto[];
  materials: FieldOpsJobMaterial[];
  signature: FieldOpsJobSignature | null;
  technician: { name: string } | null;
};

const workflowSteps = [
  "Start travel",
  "Arrive on site",
  "Check in",
  "Start work",
  "Pause",
  "Resume",
  "Complete job",
  "Check out"
];

export function JobDetailConsole({ job }: { job: JobDetailData }) {
  const [currentStatus, setCurrentStatus] = useState(job.status);
  const [note, setNote] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [materialQty, setMaterialQty] = useState("1");
  const [materialCost, setMaterialCost] = useState("");
  const [materials, setMaterials] = useState<FieldOpsJobMaterial[]>(job.materials);
  const [uploadedPhotos, setUploadedPhotos] = useState(job.photos);
  const [signName, setSignName] = useState(job.signature?.customerName ?? job.customerName);
  const [signNote, setSignNote] = useState(job.signature?.note ?? "");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.lineWidth = 2.4;
    context.lineCap = "round";
    context.strokeStyle = "#2563eb";
  }, []);

  function drawPoint(x: number, y: number) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    context.lineTo(x - rect.left, y - rect.top);
    context.stroke();
  }

  function startDrawing(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    drawingRef.current = true;
    context.beginPath();
    context.moveTo(clientX - rect.left, clientY - rect.top);
  }

  function stopDrawing() {
    drawingRef.current = false;
  }

  function updateStatus(nextStatus: string) {
    setCurrentStatus(nextStatus as typeof currentStatus);
    toast.success(`Job moved to ${nextStatus}.`);
  }

  function addNote() {
    if (!note.trim()) {
      toast.error("Add a note before saving.");
      return;
    }

    toast.success("Job note saved to the mobile log.");
    setNote("");
  }

  function addMaterial() {
    if (!materialName.trim() || !materialCost.trim()) {
      toast.error("Add a material name and unit cost.");
      return;
    }

    setMaterials((current) => [
      {
        id: `${job.id}-extra-${current.length + 1}`,
        jobId: job.id,
        itemName: materialName,
        quantity: Number(materialQty) || 1,
        unitCost: Number(materialCost) || 0,
        notes: "Added from mobile job flow."
      },
      ...current
    ]);

    setMaterialName("");
    setMaterialQty("1");
    setMaterialCost("");
    toast.success("Material added to job summary.");
  }

  function addUpload(event: ChangeEvent<HTMLInputElement>, stage: FieldOpsPhotoStage) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadedPhotos((current) => [
      {
        id: `${job.id}-${stage.toLowerCase()}-${current.length + 1}`,
        jobId: job.id,
        stage,
        caption: `${stage} upload added from device`,
        fileName: file.name,
        uploadedBy: job.technician?.name ?? "Technician",
        uploadedAt: new Date().toISOString(),
        tone: stage === "After" ? "from-emerald-500 to-teal-400" : "from-sky-500 to-cyan-400"
      },
      ...current
    ]);

    event.target.value = "";
    toast.success(`${stage} photo added to the job card.`);
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function saveSignature() {
    toast.success("Customer sign-off saved to the demo record.");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Field workflow</CardTitle>
              <p className="text-sm text-muted-foreground">
                Live technician actions, attendance, uploads, and client sign-off.
              </p>
            </div>
            <JobStatusBadge status={currentStatus} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Button variant="outline" onClick={() => updateStatus("En Route")}>
              <Truck className="mr-2 h-4 w-4" />
              Start travel
            </Button>
            <Button variant="outline" onClick={() => updateStatus("On Site")}>
              <Clock3 className="mr-2 h-4 w-4" />
              Arrive on site
            </Button>
            <Button variant="outline" onClick={() => updateStatus("In Progress")}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Start work
            </Button>
            <Button variant="outline" onClick={() => updateStatus("Paused")}>
              <PauseCircle className="mr-2 h-4 w-4" />
              Pause
            </Button>
            <Button variant="outline" onClick={() => updateStatus("In Progress")}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Resume
            </Button>
            <Button variant="outline" onClick={() => updateStatus("Completed")}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete job
            </Button>
            <Button variant="outline" onClick={() => toast.success("Check-in timestamp recorded.")}>
              Check in
            </Button>
            <Button variant="outline" onClick={() => toast.success("Check-out timestamp recorded.")}>
              Check out
            </Button>
          </div>
          <div className="grid gap-2 rounded-3xl border border-border/70 bg-background/60 p-4 text-sm sm:grid-cols-2">
            {workflowSteps.map((step) => (
              <div key={step} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                <span>{step}</span>
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">GPS status</p>
              <p className="mt-2 font-semibold">{job.gpsStatus}</p>
              <p className="text-sm text-muted-foreground">{job.capturedLocation}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Planned window</p>
              <p className="mt-2 font-semibold">{formatDate(job.scheduledStart, "EEE, MMM d • HH:mm")}</p>
              <p className="text-sm text-muted-foreground">
                Estimated duration {job.estimatedDurationHours} hours
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Work notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add notes from site, customer requests, or work completed..."
            />
            <Button onClick={addNote}>
              <Save className="mr-2 h-4 w-4" />
              Save note
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photos and files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="rounded-3xl border border-dashed border-border/80 p-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Before photo
                </div>
                <input type="file" className="mt-3 w-full text-sm" onChange={(event) => addUpload(event, "Before")} />
              </label>
              <label className="rounded-3xl border border-dashed border-border/80 p-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <FileUp className="h-4 w-4" />
                  After photo
                </div>
                <input type="file" className="mt-3 w-full text-sm" onChange={(event) => addUpload(event, "After")} />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {uploadedPhotos.slice(0, 6).map((photo) => (
                <div key={photo.id} className={`rounded-3xl bg-gradient-to-br ${photo.tone} p-[1px]`}>
                  <div className="h-full rounded-[calc(1.5rem-1px)] bg-background/95 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{photo.stage}</p>
                    <p className="mt-2 font-medium">{photo.fileName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Materials / parts used</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1.6fr_0.5fr_0.7fr_auto]">
              <Input value={materialName} onChange={(event) => setMaterialName(event.target.value)} placeholder="Item name" />
              <Input value={materialQty} onChange={(event) => setMaterialQty(event.target.value)} placeholder="Qty" />
              <Input value={materialCost} onChange={(event) => setMaterialCost(event.target.value)} placeholder="Unit cost" />
              <Button type="button" onClick={addMaterial}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {materials.slice(0, 8).map((material) => (
                <div key={material.id} className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/60 px-4 py-3">
                  <div>
                    <p className="font-medium">{material.itemName}</p>
                    <p className="text-sm text-muted-foreground">{material.notes}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{material.quantity}x</p>
                    <p className="text-muted-foreground">R {material.unitCost.toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client sign-off</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={signName} onChange={(event) => setSignName(event.target.value)} placeholder="Customer name" />
            <Textarea value={signNote} onChange={(event) => setSignNote(event.target.value)} placeholder="Sign-off note" />
            <div className="overflow-hidden rounded-3xl border border-border/70 bg-background/60">
              <canvas
                ref={canvasRef}
                width={500}
                height={180}
                className="h-[180px] w-full touch-none"
                onMouseDown={(event) => startDrawing(event.clientX, event.clientY)}
                onMouseMove={(event) => {
                  if (drawingRef.current) {
                    drawPoint(event.clientX, event.clientY);
                  }
                }}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={(event) => {
                  const touch = event.touches[0];
                  if (touch) {
                    startDrawing(touch.clientX, touch.clientY);
                  }
                }}
                onTouchMove={(event) => {
                  const touch = event.touches[0];
                  if (touch && drawingRef.current) {
                    drawPoint(touch.clientX, touch.clientY);
                  }
                }}
                onTouchEnd={stopDrawing}
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={clearSignature}>
                Clear
              </Button>
              <Button type="button" onClick={saveSignature}>
                Save sign-off
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-20 z-20 rounded-[2rem] border border-border/70 bg-background/90 p-4 shadow-2xl backdrop-blur lg:bottom-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Sticky mobile actions keep technicians moving without hunting for controls.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => toast.success("Customer call action placeholder opened.")}>
              Call customer
            </Button>
            <Button variant="outline" onClick={() => toast.success("Maps deep link placeholder opened.")}>
              Open in maps
            </Button>
            <Button onClick={() => toast.success("Client update queued from the mobile workflow.")}>
              Send update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
