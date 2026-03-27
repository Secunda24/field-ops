import "dotenv/config";

import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import {
  fieldOpsActivityLog,
  fieldOpsCompany,
  fieldOpsCustomers,
  fieldOpsDemoCredentials,
  fieldOpsIntegrations,
  fieldOpsInvoices,
  fieldOpsJobFiles,
  fieldOpsJobMaterials,
  fieldOpsJobNotes,
  fieldOpsJobPhotos,
  fieldOpsJobs,
  fieldOpsJobSignatures,
  fieldOpsNotifications,
  fieldOpsProfiles,
  fieldOpsQuotes,
  fieldOpsTechnicians,
  getSettingsSnapshot
} from "@/lib/fieldops-data";

if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

async function ensureUser(email: string, password: string, fullName: string, role: string) {
  const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  const existing = listed.data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

  if (existing) {
    return existing.id;
  }

  const created = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role
    }
  });

  if (created.error || !created.data.user) {
    throw created.error ?? new Error(`Unable to create auth user for ${email}`);
  }

  return created.data.user.id;
}

async function upsert(table: string, rows: Record<string, unknown>[]) {
  if (!rows.length) {
    return;
  }

  const result = await supabase.from(table).upsert(rows, {
    onConflict: "id"
  });

  if (result.error) {
    throw result.error;
  }
}

async function main() {
  const settings = getSettingsSnapshot();

  const authUserIds = {
    admin: await ensureUser(
      fieldOpsDemoCredentials.admin.email,
      fieldOpsDemoCredentials.admin.password,
      "Olivia Mercer",
      "admin"
    ),
    dispatcher: await ensureUser(
      fieldOpsDemoCredentials.dispatcher.email,
      fieldOpsDemoCredentials.dispatcher.password,
      "Lebo Nkosi",
      "dispatcher"
    ),
    technician: await ensureUser(
      fieldOpsDemoCredentials.technician.email,
      fieldOpsDemoCredentials.technician.password,
      "Ethan Dlamini",
      "technician"
    ),
    manager: await ensureUser(
      fieldOpsDemoCredentials.manager.email,
      fieldOpsDemoCredentials.manager.password,
      "Priya Naidoo",
      "manager"
    )
  };

  await upsert("companies", [
    {
      id: fieldOpsCompany.id,
      name: fieldOpsCompany.name,
      legal_name: fieldOpsCompany.legalName,
      app_name: fieldOpsCompany.appName,
      industry: fieldOpsCompany.industry,
      location: fieldOpsCompany.location,
      timezone: fieldOpsCompany.timezone,
      logo_placeholder: fieldOpsCompany.logoPlaceholder,
      accent_hsl: fieldOpsCompany.accentHsl,
      support_email: fieldOpsCompany.supportEmail,
      support_phone: fieldOpsCompany.supportPhone
    }
  ]);

  await upsert(
    "profiles",
    fieldOpsProfiles.map((profile) => ({
      id: profile.id,
      auth_user_id:
        profile.role === "admin"
          ? authUserIds.admin
          : profile.role === "dispatcher"
            ? authUserIds.dispatcher
            : profile.role === "manager"
              ? authUserIds.manager
              : profile.id === "profile-tech-1"
                ? authUserIds.technician
                : null,
      company_id: profile.companyId,
      full_name: profile.fullName,
      email: profile.email,
      role: profile.role,
      title: profile.title,
      avatar: profile.avatar,
      phone: profile.phone,
      team: profile.team,
      region: profile.region
    }))
  );

  await upsert(
    "technicians",
    fieldOpsTechnicians.map((technician) => ({
      id: technician.id,
      profile_id: technician.profileId,
      company_id: fieldOpsCompany.id,
      status: technician.status,
      vehicle: technician.vehicle,
      region: technician.region,
      availability: technician.availability,
      certifications: technician.certifications,
      skills: technician.skills,
      current_location: technician.currentLocation
    }))
  );

  await upsert(
    "customers",
    fieldOpsCustomers.map((customer) => ({
      id: customer.id,
      company_id: customer.companyId,
      company_name: customer.companyName,
      contact_name: customer.contactName,
      industry: customer.industry,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      suburb: customer.suburb,
      tags: customer.tags,
      notes: customer.notes
    }))
  );

  await upsert(
    "jobs",
    fieldOpsJobs.map((job) => ({
      id: job.id,
      company_id: job.companyId,
      customer_id: job.customerId,
      technician_id: job.technicianId,
      dispatcher_id: job.dispatcherId,
      job_code: job.jobCode,
      title: job.title,
      industry: job.industry,
      job_type: job.jobType,
      priority: job.priority,
      status: job.status,
      description: job.description,
      work_summary: job.workSummary,
      labor_notes: job.laborNotes,
      internal_notes: job.internalNotes,
      customer_instructions: job.customerInstructions,
      scheduled_start: job.scheduledStart,
      scheduled_end: job.scheduledEnd,
      estimated_duration_hours: job.estimatedDurationHours,
      started_travel_at: job.startedTravelAt,
      check_in_at: job.checkInAt,
      started_work_at: job.startedWorkAt,
      completed_at: job.completedAt,
      check_out_at: job.checkOutAt,
      gps_status: job.gpsStatus,
      captured_location: job.capturedLocation
    }))
  );

  await upsert(
    "job_notes",
    fieldOpsJobNotes.map((note) => ({
      id: note.id,
      company_id: fieldOpsCompany.id,
      job_id: note.jobId,
      author: note.author,
      body: note.body,
      created_at: note.createdAt
    }))
  );

  await upsert(
    "job_photos",
    fieldOpsJobPhotos.map((photo) => ({
      id: photo.id,
      company_id: fieldOpsCompany.id,
      job_id: photo.jobId,
      stage: photo.stage,
      caption: photo.caption,
      file_name: photo.fileName,
      storage_path: `job-assets/${photo.fileName}`,
      uploaded_by: photo.uploadedBy,
      uploaded_at: photo.uploadedAt
    }))
  );

  await upsert(
    "job_files",
    fieldOpsJobFiles.map((file) => ({
      id: file.id,
      company_id: fieldOpsCompany.id,
      job_id: file.jobId,
      name: file.name,
      size: file.size,
      category: file.category,
      storage_path: `job-assets/${file.name}`,
      uploaded_by: file.uploadedBy,
      uploaded_at: file.uploadedAt
    }))
  );

  await upsert(
    "job_materials",
    fieldOpsJobMaterials.map((material) => ({
      id: material.id,
      company_id: fieldOpsCompany.id,
      job_id: material.jobId,
      item_name: material.itemName,
      quantity: material.quantity,
      unit_cost: material.unitCost,
      notes: material.notes
    }))
  );

  await upsert(
    "job_signatures",
    fieldOpsJobSignatures.map((signature) => ({
      id: signature.id,
      company_id: fieldOpsCompany.id,
      job_id: signature.jobId,
      customer_name: signature.customerName,
      note: signature.note,
      signed_at: signature.signedAt
    }))
  );

  await upsert(
    "quotes",
    fieldOpsQuotes.map((quote) => ({
      id: quote.id,
      company_id: fieldOpsCompany.id,
      job_id: quote.jobId,
      customer_id: quote.customerId,
      quote_number: quote.quoteNumber,
      status: quote.status,
      total: quote.total,
      issued_at: quote.issuedAt,
      valid_until: quote.validUntil,
      approval_note: quote.approvalNote
    }))
  );

  await upsert(
    "invoices",
    fieldOpsInvoices.map((invoice) => ({
      id: invoice.id,
      company_id: fieldOpsCompany.id,
      job_id: invoice.jobId,
      customer_id: invoice.customerId,
      invoice_number: invoice.invoiceNumber,
      status: invoice.status,
      total: invoice.total,
      issued_at: invoice.issuedAt,
      due_at: invoice.dueAt,
      paid_at: invoice.paidAt,
      summary: invoice.summary
    }))
  );

  await upsert(
    "notifications",
    fieldOpsNotifications.map((notification) => ({
      id: notification.id,
      company_id: fieldOpsCompany.id,
      title: notification.title,
      description: notification.description,
      href: notification.href,
      unread: notification.unread,
      roles: notification.roles,
      created_at: notification.createdAt
    }))
  );

  await upsert(
    "activity_logs",
    fieldOpsActivityLog.map((item) => ({
      id: item.id,
      company_id: fieldOpsCompany.id,
      job_id: item.jobId,
      title: item.title,
      detail: item.detail,
      actor: item.actor,
      tone: item.tone,
      created_at: item.createdAt
    }))
  );

  await upsert(
    "settings",
    [
      {
        id: "settings-default",
        company_id: fieldOpsCompany.id,
        support_email: settings.branding.supportEmail,
        notification_preferences: settings.notificationPreferences,
        business_hours: settings.businessHours,
        invoice_defaults: settings.invoiceDefaults,
        theme_settings: {
          app_name: settings.branding.portalName,
          company_name: settings.branding.companyName,
          logo_placeholder: settings.branding.logoPlaceholder,
          accent_hsl: settings.branding.accentHsl
        }
      }
    ]
  );

  await upsert(
    "integrations",
    fieldOpsIntegrations.map((integration) => ({
      id: integration.id,
      company_id: fieldOpsCompany.id,
      name: integration.name,
      category: integration.category,
      description: integration.description,
      status: integration.status,
      detail: integration.detail
    }))
  );

  console.log("FieldOps Mobile demo seed complete.");
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
