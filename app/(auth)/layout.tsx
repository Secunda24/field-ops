import type { ReactNode } from "react";

export default function AuthLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="container grid min-h-screen items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <span className="eyebrow">FieldOps Mobile</span>
        <h1 className="font-display text-5xl font-semibold tracking-tight">
          Run jobs, technicians, dispatch, and sign-offs from one premium mobile system
        </h1>
        <p className="max-w-xl text-lg leading-8 text-muted-foreground">
          A production-style field service demo with mobile job cards, real-time updates, quotes, invoices, photos, materials, and customer sign-off.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
            <p className="font-semibold">Built for demos</p>
            <p className="mt-2 text-sm text-muted-foreground">The technician flow, dispatch board, and job detail page are designed to look like software businesses would pay for.</p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
            <p className="font-semibold">Supabase ready</p>
            <p className="mt-2 text-sm text-muted-foreground">Auth, schema, RLS policies, storage-ready tables, and realistic seed data are included for production rollout.</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center lg:justify-end">{children}</div>
    </div>
  );
}
