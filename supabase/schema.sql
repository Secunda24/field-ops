create extension if not exists pgcrypto;

drop table if exists public.activity_logs cascade;
drop table if exists public.notifications cascade;
drop table if exists public.invoices cascade;
drop table if exists public.quotes cascade;
drop table if exists public.job_signatures cascade;
drop table if exists public.job_materials cascade;
drop table if exists public.job_files cascade;
drop table if exists public.job_photos cascade;
drop table if exists public.job_notes cascade;
drop table if exists public.jobs cascade;
drop table if exists public.technicians cascade;
drop table if exists public.customers cascade;
drop table if exists public.integrations cascade;
drop table if exists public.settings cascade;
drop table if exists public.profiles cascade;
drop table if exists public.companies cascade;

drop type if exists public.fieldops_role cascade;
drop type if exists public.job_status cascade;
drop type if exists public.job_priority cascade;
drop type if exists public.job_type cascade;
drop type if exists public.quote_status cascade;
drop type if exists public.invoice_status cascade;
drop type if exists public.integration_status cascade;

create type public.fieldops_role as enum ('admin', 'dispatcher', 'technician', 'manager');
create type public.job_status as enum (
  'New',
  'Assigned',
  'En Route',
  'On Site',
  'In Progress',
  'Paused',
  'Waiting on Client',
  'Completed',
  'Invoiced',
  'Cancelled',
  'Overdue'
);
create type public.job_priority as enum ('Low', 'Normal', 'High', 'Urgent');
create type public.job_type as enum (
  'installation',
  'repair',
  'maintenance',
  'inspection',
  'callout',
  'emergency service',
  'servicing',
  'follow-up visit'
);
create type public.quote_status as enum ('Draft', 'Sent', 'Approved', 'Rejected', 'Expired', 'Converted');
create type public.invoice_status as enum ('Paid', 'Unpaid', 'Overdue', 'Partially Paid');
create type public.integration_status as enum ('Connected', 'Not connected', 'Coming soon');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.current_company_id()
returns text
language sql
stable
as $$
  select company_id
  from public.profiles
  where auth_user_id = auth.uid()
  limit 1
$$;

create table public.companies (
  id text primary key,
  name text not null,
  legal_name text not null,
  app_name text not null,
  industry text not null,
  location text not null,
  timezone text not null,
  logo_placeholder text not null,
  accent_hsl text not null,
  support_email text not null,
  support_phone text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.profiles (
  id text primary key,
  auth_user_id uuid unique,
  company_id text not null references public.companies(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role public.fieldops_role not null,
  title text not null,
  avatar text not null,
  phone text,
  team text,
  region text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.customers (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  company_name text not null,
  contact_name text not null,
  industry text not null,
  email text,
  phone text,
  address text not null,
  suburb text,
  tags text[] not null default '{}',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.technicians (
  id text primary key,
  profile_id text not null unique references public.profiles(id) on delete cascade,
  company_id text not null references public.companies(id) on delete cascade,
  status text not null,
  vehicle text,
  region text,
  availability text,
  certifications text[] not null default '{}',
  skills text[] not null default '{}',
  current_location text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.jobs (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  customer_id text not null references public.customers(id) on delete cascade,
  technician_id text references public.technicians(id) on delete set null,
  dispatcher_id text references public.profiles(id) on delete set null,
  job_code text not null unique,
  title text not null,
  industry text,
  job_type public.job_type not null,
  priority public.job_priority not null default 'Normal',
  status public.job_status not null default 'New',
  description text not null,
  work_summary text,
  labor_notes text,
  internal_notes text,
  customer_instructions text,
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  estimated_duration_hours numeric(5,2),
  started_travel_at timestamptz,
  check_in_at timestamptz,
  started_work_at timestamptz,
  completed_at timestamptz,
  check_out_at timestamptz,
  gps_status text,
  captured_location text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.job_notes (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  job_id text not null references public.jobs(id) on delete cascade,
  author text not null,
  body text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.job_photos (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  job_id text not null references public.jobs(id) on delete cascade,
  stage text not null,
  caption text,
  file_name text not null,
  storage_path text,
  uploaded_by text,
  uploaded_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.job_files (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  job_id text not null references public.jobs(id) on delete cascade,
  name text not null,
  size text,
  category text,
  storage_path text,
  uploaded_by text,
  uploaded_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.job_materials (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  job_id text not null references public.jobs(id) on delete cascade,
  item_name text not null,
  quantity numeric(10,2) not null default 1,
  unit_cost numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.job_signatures (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  job_id text not null unique references public.jobs(id) on delete cascade,
  customer_name text not null,
  note text,
  signed_at timestamptz not null,
  signature_svg text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.quotes (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  job_id text references public.jobs(id) on delete set null,
  customer_id text not null references public.customers(id) on delete cascade,
  quote_number text not null unique,
  status public.quote_status not null default 'Draft',
  total numeric(12,2) not null default 0,
  issued_at timestamptz not null,
  valid_until timestamptz not null,
  approval_note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.invoices (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  job_id text references public.jobs(id) on delete set null,
  customer_id text not null references public.customers(id) on delete cascade,
  invoice_number text not null unique,
  status public.invoice_status not null default 'Unpaid',
  total numeric(12,2) not null default 0,
  issued_at timestamptz not null,
  due_at timestamptz not null,
  paid_at timestamptz,
  summary text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.notifications (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  title text not null,
  description text not null,
  href text,
  unread boolean not null default true,
  roles text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.activity_logs (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  job_id text references public.jobs(id) on delete set null,
  title text not null,
  detail text not null,
  actor text,
  tone text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.settings (
  id text primary key,
  company_id text not null unique references public.companies(id) on delete cascade,
  support_email text,
  notification_preferences jsonb not null default '[]'::jsonb,
  business_hours jsonb not null default '[]'::jsonb,
  invoice_defaults jsonb not null default '{}'::jsonb,
  theme_settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.integrations (
  id text primary key,
  company_id text not null references public.companies(id) on delete cascade,
  name text not null,
  category text,
  description text,
  status public.integration_status not null default 'Not connected',
  detail text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_companies_updated_at before update on public.companies for each row execute function public.set_updated_at();
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_customers_updated_at before update on public.customers for each row execute function public.set_updated_at();
create trigger set_technicians_updated_at before update on public.technicians for each row execute function public.set_updated_at();
create trigger set_jobs_updated_at before update on public.jobs for each row execute function public.set_updated_at();
create trigger set_job_notes_updated_at before update on public.job_notes for each row execute function public.set_updated_at();
create trigger set_job_photos_updated_at before update on public.job_photos for each row execute function public.set_updated_at();
create trigger set_job_files_updated_at before update on public.job_files for each row execute function public.set_updated_at();
create trigger set_job_materials_updated_at before update on public.job_materials for each row execute function public.set_updated_at();
create trigger set_job_signatures_updated_at before update on public.job_signatures for each row execute function public.set_updated_at();
create trigger set_quotes_updated_at before update on public.quotes for each row execute function public.set_updated_at();
create trigger set_invoices_updated_at before update on public.invoices for each row execute function public.set_updated_at();
create trigger set_notifications_updated_at before update on public.notifications for each row execute function public.set_updated_at();
create trigger set_activity_logs_updated_at before update on public.activity_logs for each row execute function public.set_updated_at();
create trigger set_settings_updated_at before update on public.settings for each row execute function public.set_updated_at();
create trigger set_integrations_updated_at before update on public.integrations for each row execute function public.set_updated_at();

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.technicians enable row level security;
alter table public.jobs enable row level security;
alter table public.job_notes enable row level security;
alter table public.job_photos enable row level security;
alter table public.job_files enable row level security;
alter table public.job_materials enable row level security;
alter table public.job_signatures enable row level security;
alter table public.quotes enable row level security;
alter table public.invoices enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;
alter table public.settings enable row level security;
alter table public.integrations enable row level security;

create policy "company members can read companies" on public.companies
for select using (id = public.current_company_id());

create policy "company members can read profiles" on public.profiles
for select using (company_id = public.current_company_id());

create policy "company members can manage their profile row" on public.profiles
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access customers" on public.customers
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access technicians" on public.technicians
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access jobs" on public.jobs
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access job notes" on public.job_notes
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access job photos" on public.job_photos
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access job files" on public.job_files
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access job materials" on public.job_materials
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access job signatures" on public.job_signatures
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access quotes" on public.quotes
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access invoices" on public.invoices
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access notifications" on public.notifications
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access activity logs" on public.activity_logs
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access settings" on public.settings
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

create policy "company members can access integrations" on public.integrations
for all using (company_id = public.current_company_id()) with check (company_id = public.current_company_id());

insert into storage.buckets (id, name, public)
values ('job-assets', 'job-assets', false)
on conflict (id) do nothing;
