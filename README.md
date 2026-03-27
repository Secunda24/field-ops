# FieldOps Mobile

FieldOps Mobile is a production-style, mobile-first SaaS demo for field service businesses. It is designed to feel like software a company would actually buy, with a premium landing page, polished office dashboard, operational technician flow, job cards, dispatch board, quotes, invoices, notifications, reporting, and white-label settings.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Lucide icons
- Supabase-ready auth, database, and storage schema
- React Hook Form + Zod
- Framer Motion
- TanStack Table
- Recharts
- PWA manifest + install prompt

## Demo credentials

- Admin
  - Email: `admin@fieldopsmobile.com`
  - Password: `AdminField123!`
- Dispatcher
  - Email: `dispatch@apexservicegroup.com`
  - Password: `DispatchField123!`
- Technician
  - Email: `tech@apexservicegroup.com`
  - Password: `TechField123!`
- Manager
  - Email: `manager@apexservicegroup.com`
  - Password: `ManagerField123!`

## What is included

- Public landing page with premium hero, feature grid, showcase cards, industry use cases, testimonials, FAQ, and CTAs
- Protected workspace shell with desktop sidebar, technician mobile bottom nav, search, notifications, and dark mode
- Office dashboard with KPI cards, status chart, workload chart, revenue summary, activity feed, and quick actions
- Technician dashboard with today's jobs, upcoming work, checked-in status, notifications, and performance summary
- Jobs module with office filters/table and technician mobile job list
- Standout job detail page with timeline, notes, photos, materials, signature pad, attendance controls, and sticky mobile actions
- Create/edit job form with React Hook Form + Zod validation
- Dispatch board with day/week views and technician scheduling columns
- Customers, technicians, quotes, invoices, reporting, notifications, activity log, settings, and integrations pages
- Print-friendly job sheet and invoice view
- Supabase SQL schema with enums, foreign keys, timestamps, RLS, and storage bucket
- Seed script with realistic demo data:
  - 25 customers
  - 8 technicians
  - 60 jobs
  - 18 quotes
  - 22 invoices
  - 80 job photos
  - 120 activity log entries

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in the environment variables you want to use.
3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Create a new Supabase project.
2. Run [`supabase/schema.sql`](./supabase/schema.sql).
3. Add these values to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Seed the demo data:

```bash
npm run seed:demo
```

The seed script creates auth users for the demo accounts, then upserts companies, profiles, technicians, customers, jobs, job notes, job photos, job files, job materials, signatures, quotes, invoices, notifications, activity logs, settings, and integrations.

## Environment variables

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_PORTAL_NAME`
- `NEXT_PUBLIC_COMPANY_NAME`
- `NEXT_PUBLIC_LOGO_PLACEHOLDER`
- `NEXT_PUBLIC_ACCENT_HSL`
- `NEXT_PUBLIC_SUPPORT_EMAIL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DEMO_ADMIN_EMAIL`
- `DEMO_ADMIN_PASSWORD`
- `DEMO_DISPATCHER_EMAIL`
- `DEMO_DISPATCHER_PASSWORD`
- `DEMO_TECHNICIAN_EMAIL`
- `DEMO_TECHNICIAN_PASSWORD`
- `DEMO_MANAGER_EMAIL`
- `DEMO_MANAGER_PASSWORD`

## Key routes

- `/` marketing landing page
- `/login` demo login
- `/workspace` dashboard
- `/workspace/jobs` jobs module
- `/workspace/jobs/[id]` job detail
- `/workspace/dispatch` dispatch board
- `/workspace/customers` customers
- `/workspace/technicians` technicians
- `/workspace/quotes` quotes
- `/workspace/invoices` invoices
- `/workspace/reporting` reporting
- `/workspace/notifications` notifications
- `/workspace/activity` activity log
- `/workspace/settings` branding and defaults
- `/workspace/integrations` integrations

## Verification

Run a production build:

```bash
npm run build
```
