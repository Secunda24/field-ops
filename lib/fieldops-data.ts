import {
  addDays,
  addHours,
  addMinutes,
  eachDayOfInterval,
  endOfDay,
  endOfWeek,
  isSameDay,
  startOfDay,
  startOfWeek,
  subDays,
  subHours,
  subMinutes
} from "date-fns";

import { env } from "@/lib/env";

export type FieldOpsRole = "admin" | "dispatcher" | "technician" | "manager";
export type FieldOpsStatusTone =
  | "neutral"
  | "info"
  | "warning"
  | "success"
  | "danger"
  | "accent";
export type FieldOpsJobStatus =
  | "New"
  | "Assigned"
  | "En Route"
  | "On Site"
  | "In Progress"
  | "Paused"
  | "Waiting on Client"
  | "Completed"
  | "Invoiced"
  | "Cancelled"
  | "Overdue";
export type FieldOpsPriority = "Low" | "Normal" | "High" | "Urgent";
export type FieldOpsJobType =
  | "installation"
  | "repair"
  | "maintenance"
  | "inspection"
  | "callout"
  | "emergency service"
  | "servicing"
  | "follow-up visit";
export type FieldOpsQuoteStatus =
  | "Draft"
  | "Sent"
  | "Approved"
  | "Rejected"
  | "Expired"
  | "Converted";
export type FieldOpsInvoiceStatus = "Paid" | "Unpaid" | "Overdue" | "Partially Paid";
export type FieldOpsTechnicianStatus = "Available" | "On Job" | "Traveling" | "Offline";
export type FieldOpsIntegrationStatus = "Connected" | "Not connected" | "Coming soon";
export type FieldOpsPhotoStage = "Before" | "After" | "Progress" | "Document";

export interface FieldOpsCompany {
  id: string;
  name: string;
  legalName: string;
  appName: string;
  industry: string;
  location: string;
  timezone: string;
  supportEmail: string;
  supportPhone: string;
  logoPlaceholder: string;
  accentHsl: string;
  businessHours: Array<{ day: string; hours: string }>;
}

export interface FieldOpsProfile {
  id: string;
  companyId: string;
  fullName: string;
  email: string;
  role: FieldOpsRole;
  title: string;
  avatar: string;
  phone: string;
  team: string;
  region: string;
  technicianId?: string;
}

export interface FieldOpsTechnician {
  id: string;
  profileId: string;
  name: string;
  avatar: string;
  status: FieldOpsTechnicianStatus;
  phone: string;
  email: string;
  vehicle: string;
  region: string;
  availability: string;
  certifications: string[];
  skills: string[];
  currentLocation: string;
}

export interface FieldOpsCustomer {
  id: string;
  companyId: string;
  companyName: string;
  contactName: string;
  industry: string;
  email: string;
  phone: string;
  address: string;
  suburb: string;
  tags: string[];
  notes: string;
}

export interface FieldOpsTimelineItem {
  id: string;
  title: string;
  detail: string;
  actor: string;
  timestamp: string;
  tone: FieldOpsStatusTone;
}

export interface FieldOpsJob {
  id: string;
  companyId: string;
  jobCode: string;
  customerId: string;
  technicianId: string;
  dispatcherId: string;
  title: string;
  industry: string;
  jobType: FieldOpsJobType;
  priority: FieldOpsPriority;
  status: FieldOpsJobStatus;
  customerName: string;
  customerCompany: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  suburb: string;
  description: string;
  workSummary: string;
  laborNotes: string;
  internalNotes: string;
  customerInstructions: string;
  scheduledStart: string;
  scheduledEnd: string;
  estimatedDurationHours: number;
  startedTravelAt?: string;
  checkInAt?: string;
  startedWorkAt?: string;
  completedAt?: string;
  checkOutAt?: string;
  createdAt: string;
  updatedAt: string;
  gpsStatus: string;
  capturedLocation: string;
  timeline: FieldOpsTimelineItem[];
}

export interface FieldOpsJobNote {
  id: string;
  jobId: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface FieldOpsJobPhoto {
  id: string;
  jobId: string;
  stage: FieldOpsPhotoStage;
  caption: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  tone: string;
}

export interface FieldOpsJobFile {
  id: string;
  jobId: string;
  name: string;
  size: string;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface FieldOpsJobMaterial {
  id: string;
  jobId: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  notes: string;
}

export interface FieldOpsJobSignature {
  id: string;
  jobId: string;
  customerName: string;
  note: string;
  signedAt: string;
}

export interface FieldOpsQuote {
  id: string;
  quoteNumber: string;
  jobId: string;
  customerId: string;
  customerName: string;
  status: FieldOpsQuoteStatus;
  total: number;
  issuedAt: string;
  validUntil: string;
  approvalNote: string;
}

export interface FieldOpsInvoice {
  id: string;
  invoiceNumber: string;
  jobId: string;
  customerId: string;
  customerName: string;
  status: FieldOpsInvoiceStatus;
  total: number;
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  summary: string;
}

export interface FieldOpsNotification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  unread: boolean;
  roles: FieldOpsRole[];
  href: string;
}

export interface FieldOpsActivityLog {
  id: string;
  jobId?: string;
  title: string;
  detail: string;
  actor: string;
  createdAt: string;
  tone: FieldOpsStatusTone;
}

export interface FieldOpsIntegration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: FieldOpsIntegrationStatus;
  detail: string;
}

export interface FieldOpsSearchItem {
  id: string;
  label: string;
  type: string;
  href: string;
  meta?: string;
}

const now = new Date("2026-03-27T09:30:00+02:00");
const companyId = "company-fieldops";

const jobStatusPool: FieldOpsJobStatus[] = [
  ...Array.from({ length: 20 }, () => "Completed" as const),
  ...Array.from({ length: 15 }, () => "In Progress" as const),
  ...Array.from({ length: 10 }, () => "Overdue" as const),
  ...Array.from({ length: 4 }, () => "Assigned" as const),
  ...Array.from({ length: 3 }, () => "En Route" as const),
  ...Array.from({ length: 2 }, () => "On Site" as const),
  "New",
  "Waiting on Client",
  "Invoiced",
  "Cancelled",
  "Paused",
  "Paused"
];

const priorities: FieldOpsPriority[] = ["Normal", "High", "Urgent", "Low"];
const jobTypes: FieldOpsJobType[] = [
  "installation",
  "repair",
  "maintenance",
  "inspection",
  "callout",
  "emergency service",
  "servicing",
  "follow-up visit"
];

const customerSeeds = [
  ["Cedar Ridge Apartments", "Naomi Adams", "property maintenance", "12 Hillcrest Avenue, Sandton"],
  ["Northline Business Park", "Daniel Smith", "electrical", "88 Rivonia Road, Sandton"],
  ["Willowbrook Medical Centre", "Dr Priya Nair", "HVAC", "42 Oxford Road, Rosebank"],
  ["Parkside Retail Plaza", "Melissa Jacobs", "security", "17 Jan Smuts Avenue, Hyde Park"],
  ["Brookfield Villas", "Chris Mokoena", "plumbing", "5 Republic Road, Randburg"],
  ["Blue Crane Office Park", "Lerato Dube", "general maintenance", "203 Main Road, Bryanston"],
  ["Summit Auto Works", "Andre van Wyk", "electrical", "54 Pretoria Street, Midrand"],
  ["Green Horizon Estate", "Alicia Meyer", "cleaning", "77 William Nicol Drive, Fourways"],
  ["Silverstream Logistics", "Mpho Maseko", "security", "10 Kelvin Drive, Woodmead"],
  ["Oakview Boutique Hotel", "Jessica Daniels", "maintenance", "19 Tyrwhitt Avenue, Rosebank"],
  ["Westbrook School", "Nomsa Ncube", "electrical", "112 Beyers Naude Drive, Northcliff"],
  ["Brightstar Dental Rooms", "Farah Khan", "HVAC", "8 Bolton Road, Rosebank"],
  ["Harbor Court Offices", "Teboho Mthembu", "cleaning", "66 Grayston Drive, Sandton"],
  ["Lakeside Padel Club", "Ryan Foster", "plumbing", "21 Corlett Drive, Illovo"],
  ["Metro Fuel Depot", "Ben Steyn", "inspection", "170 Allandale Road, Midrand"],
  ["Amberfield Townhouses", "Kim Naidoo", "property maintenance", "9 Cedar Street, Bedfordview"],
  ["Atlas Cold Rooms", "Oscar Dlamini", "HVAC", "39 Isando Road, Kempton Park"],
  ["Crestline Studios", "Zinhle Moyo", "security", "29 Fox Street, Maboneng"],
  ["Valley View Mall", "Cameron Peters", "cleaning", "93 Beyers Naude Drive, Randburg"],
  ["Sterling Printworks", "Rachael Lee", "electrical", "14 Forge Lane, Wynberg"],
  ["Beacon House", "Sizwe Khumalo", "maintenance", "6 Katherine Street, Sandton"],
  ["Evergreen Day Spa", "Lydia Botha", "plumbing", "28 Rivonia Boulevard, Rivonia"],
  ["Cityline Storage", "Michael Gasa", "security", "51 Marlboro Drive, Marlboro"],
  ["Falcon Ridge Apartments", "Nadia Peters", "cleaning", "87 Bryanston Drive, Bryanston"],
  ["Orchard Corner Pharmacy", "Jason Wilson", "inspection", "101 Grant Avenue, Norwood"]
] as const;

const technicianSeeds = [
  {
    id: "tech-1",
    profileId: "profile-tech-1",
    name: "Ethan Dlamini",
    avatar: "ED",
    status: "On Job" as const,
    phone: "+27 72 110 2041",
    email: env.demoTechnicianEmail,
    vehicle: "Ford Ranger FOM-301-GP",
    region: "Sandton North",
    availability: "Busy until 14:30",
    certifications: ["Wireman's license", "DB board upgrades"],
    skills: ["Electrical", "Emergency callouts", "Testing"],
    currentLocation: "Rosebank"
  },
  {
    id: "tech-2",
    profileId: "profile-tech-2",
    name: "Melissa Jacobs",
    avatar: "MJ",
    status: "Available" as const,
    phone: "+27 73 118 4412",
    email: "melissa@apexservicegroup.com",
    vehicle: "Toyota Hilux FOM-185-GP",
    region: "Fourways",
    availability: "Available in 25 min",
    certifications: ["HVAC servicing", "Refrigeration"],
    skills: ["HVAC", "Installations", "Maintenance"],
    currentLocation: "Bryanston"
  },
  {
    id: "tech-3",
    profileId: "profile-tech-3",
    name: "Kabelo Maseko",
    avatar: "KM",
    status: "Traveling" as const,
    phone: "+27 71 551 9077",
    email: "kabelo@apexservicegroup.com",
    vehicle: "Isuzu D-Max FOM-224-GP",
    region: "Midrand",
    availability: "ETA 18 min",
    certifications: ["Leak detection", "Pipework repairs"],
    skills: ["Plumbing", "Callouts", "Follow-up visits"],
    currentLocation: "Waterfall"
  },
  {
    id: "tech-4",
    profileId: "profile-tech-4",
    name: "Ayanda Khumalo",
    avatar: "AK",
    status: "On Job" as const,
    phone: "+27 74 281 9031",
    email: "ayanda@apexservicegroup.com",
    vehicle: "Nissan Navara FOM-118-GP",
    region: "Randburg",
    availability: "Busy until 16:10",
    certifications: ["Alarm panels", "Access control"],
    skills: ["Security", "Installations", "Inspection"],
    currentLocation: "Hyde Park"
  },
  {
    id: "tech-5",
    profileId: "profile-tech-5",
    name: "Reece Petersen",
    avatar: "RP",
    status: "Available" as const,
    phone: "+27 78 221 1603",
    email: "reece@apexservicegroup.com",
    vehicle: "Ford Transit FOM-404-GP",
    region: "Rosebank",
    availability: "Open for reassignment",
    certifications: ["Commercial cleaning", "Site handover"],
    skills: ["Cleaning", "Team leads", "QA"],
    currentLocation: "Parktown North"
  },
  {
    id: "tech-6",
    profileId: "profile-tech-6",
    name: "Thando Moyo",
    avatar: "TM",
    status: "Offline" as const,
    phone: "+27 79 320 5502",
    email: "thando@apexservicegroup.com",
    vehicle: "VW Caddy FOM-512-GP",
    region: "East Rand",
    availability: "Off shift",
    certifications: ["Preventative maintenance", "Asset tagging"],
    skills: ["Maintenance", "Servicing", "Inspections"],
    currentLocation: "Kempton Park"
  },
  {
    id: "tech-7",
    profileId: "profile-tech-7",
    name: "Jason van Wyk",
    avatar: "JV",
    status: "Available" as const,
    phone: "+27 82 771 8834",
    email: "jason@apexservicegroup.com",
    vehicle: "Mercedes Sprinter FOM-267-GP",
    region: "South Johannesburg",
    availability: "Available in 40 min",
    certifications: ["High-side maintenance", "Motors"],
    skills: ["Electrical", "Servicing", "Installations"],
    currentLocation: "Johannesburg South"
  },
  {
    id: "tech-8",
    profileId: "profile-tech-8",
    name: "Lebo Ndlovu",
    avatar: "LN",
    status: "Traveling" as const,
    phone: "+27 83 118 4208",
    email: "lebo.tech@apexservicegroup.com",
    vehicle: "Toyota Quantum FOM-611-GP",
    region: "Northcliff",
    availability: "ETA 32 min",
    certifications: ["Site inspections", "Client walk-throughs"],
    skills: ["Inspection", "Reports", "Follow-up visits"],
    currentLocation: "Randpark Ridge"
  }
];

export const fieldOpsCompany: FieldOpsCompany = {
  id: companyId,
  name: env.companyName,
  legalName: "Apex Service Group Pty Ltd",
  appName: env.portalName,
  industry: "Field service and job management",
  location: "Johannesburg, South Africa",
  timezone: "Africa/Johannesburg",
  supportEmail: env.supportEmail,
  supportPhone: "+27 11 555 0182",
  logoPlaceholder: env.logoPlaceholder,
  accentHsl: env.accentHsl,
  businessHours: [
    { day: "Mon - Fri", hours: "07:00 - 18:00" },
    { day: "Saturday", hours: "08:00 - 14:00" },
    { day: "Emergency desk", hours: "24/7 callout cover" }
  ]
};

export const fieldOpsCompanies = [fieldOpsCompany];

export const fieldOpsProfiles: FieldOpsProfile[] = [
  {
    id: "profile-admin",
    companyId,
    fullName: "Olivia Mercer",
    email: env.demoAdminEmail,
    role: "admin",
    title: "Platform Administrator",
    avatar: "OM",
    phone: "+27 82 501 2200",
    team: "Executive",
    region: "Global"
  },
  {
    id: "profile-dispatcher",
    companyId,
    fullName: "Lebo Nkosi",
    email: env.demoDispatcherEmail,
    role: "dispatcher",
    title: "Lead Dispatcher",
    avatar: "LN",
    phone: "+27 72 410 7812",
    team: "Dispatch",
    region: "Johannesburg North"
  },
  {
    id: "profile-manager",
    companyId,
    fullName: "Priya Naidoo",
    email: env.demoManagerEmail,
    role: "manager",
    title: "Operations Manager",
    avatar: "PN",
    phone: "+27 83 722 2005",
    team: "Operations",
    region: "Johannesburg"
  },
  {
    id: "profile-tech-1",
    companyId,
    fullName: "Ethan Dlamini",
    email: env.demoTechnicianEmail,
    role: "technician",
    title: "Senior Field Technician",
    avatar: "ED",
    phone: technicianSeeds[0].phone,
    team: "Electrical Response",
    region: technicianSeeds[0].region,
    technicianId: "tech-1"
  },
  {
    id: "profile-tech-2",
    companyId,
    fullName: "Melissa Jacobs",
    email: technicianSeeds[1].email,
    role: "technician",
    title: "HVAC Technician",
    avatar: "MJ",
    phone: technicianSeeds[1].phone,
    team: "Climate Control",
    region: technicianSeeds[1].region,
    technicianId: "tech-2"
  },
  {
    id: "profile-tech-3",
    companyId,
    fullName: "Kabelo Maseko",
    email: technicianSeeds[2].email,
    role: "technician",
    title: "Plumbing Technician",
    avatar: "KM",
    phone: technicianSeeds[2].phone,
    team: "Reactive Plumbing",
    region: technicianSeeds[2].region,
    technicianId: "tech-3"
  },
  {
    id: "profile-tech-4",
    companyId,
    fullName: "Ayanda Khumalo",
    email: technicianSeeds[3].email,
    role: "technician",
    title: "Security Installer",
    avatar: "AK",
    phone: technicianSeeds[3].phone,
    team: "Security",
    region: technicianSeeds[3].region,
    technicianId: "tech-4"
  },
  {
    id: "profile-tech-5",
    companyId,
    fullName: "Reece Petersen",
    email: technicianSeeds[4].email,
    role: "technician",
    title: "Quality Lead",
    avatar: "RP",
    phone: technicianSeeds[4].phone,
    team: "Cleaning",
    region: technicianSeeds[4].region,
    technicianId: "tech-5"
  },
  {
    id: "profile-tech-6",
    companyId,
    fullName: "Thando Moyo",
    email: technicianSeeds[5].email,
    role: "technician",
    title: "Maintenance Technician",
    avatar: "TM",
    phone: technicianSeeds[5].phone,
    team: "Maintenance",
    region: technicianSeeds[5].region,
    technicianId: "tech-6"
  },
  {
    id: "profile-tech-7",
    companyId,
    fullName: "Jason van Wyk",
    email: technicianSeeds[6].email,
    role: "technician",
    title: "Electrical Installer",
    avatar: "JV",
    phone: technicianSeeds[6].phone,
    team: "Installations",
    region: technicianSeeds[6].region,
    technicianId: "tech-7"
  },
  {
    id: "profile-tech-8",
    companyId,
    fullName: "Lebo Ndlovu",
    email: technicianSeeds[7].email,
    role: "technician",
    title: "Inspection Specialist",
    avatar: "LN",
    phone: technicianSeeds[7].phone,
    team: "Inspection",
    region: technicianSeeds[7].region,
    technicianId: "tech-8"
  }
];

export const fieldOpsTechnicians = technicianSeeds;

export const fieldOpsDemoCredentials = {
  admin: {
    email: env.demoAdminEmail,
    password: env.demoAdminPassword
  },
  dispatcher: {
    email: env.demoDispatcherEmail,
    password: env.demoDispatcherPassword
  },
  technician: {
    email: env.demoTechnicianEmail,
    password: env.demoTechnicianPassword
  },
  manager: {
    email: env.demoManagerEmail,
    password: env.demoManagerPassword
  }
};

function createEmail(companyName: string) {
  return `${companyName.toLowerCase().replace(/[^a-z0-9]+/g, "")}@clientmail.co.za`;
}

function getJobStatusTiming(index: number, status: FieldOpsJobStatus) {
  const startBase = startOfDay(now);

  if (status === "Completed" || status === "Invoiced") {
    const scheduledStart = addHours(subDays(startBase, (index % 7) + 1), 7 + (index % 6));
    const estimatedDurationHours = 1.5 + (index % 3);
    return {
      scheduledStart,
      scheduledEnd: addMinutes(scheduledStart, estimatedDurationHours * 60),
      estimatedDurationHours
    };
  }

  if (status === "Overdue") {
    const scheduledStart = addHours(subDays(startBase, (index % 3) + 1), 8 + (index % 5));
    const estimatedDurationHours = 2 + (index % 4);
    return {
      scheduledStart,
      scheduledEnd: addMinutes(scheduledStart, estimatedDurationHours * 60),
      estimatedDurationHours
    };
  }

  if (status === "In Progress" || status === "Paused" || status === "On Site" || status === "En Route") {
    const scheduledStart = addHours(startBase, 7 + (index % 6));
    const estimatedDurationHours = 1.5 + (index % 4);
    return {
      scheduledStart,
      scheduledEnd: addMinutes(scheduledStart, estimatedDurationHours * 60),
      estimatedDurationHours
    };
  }

  const scheduledStart = addHours(addDays(startBase, index % 4), 8 + (index % 7));
  const estimatedDurationHours = 1 + (index % 3);
  return {
    scheduledStart,
    scheduledEnd: addMinutes(scheduledStart, estimatedDurationHours * 60),
    estimatedDurationHours
  };
}

function getJobTitle(jobType: FieldOpsJobType, industry: string) {
  const labels: Record<FieldOpsJobType, string> = {
    installation: "New install and commissioning",
    repair: "Fault diagnosis and repair",
    maintenance: "Planned preventative maintenance",
    inspection: "Site inspection and compliance check",
    callout: "Urgent reactive callout",
    "emergency service": "Emergency after-hours response",
    servicing: "Routine service visit",
    "follow-up visit": "Follow-up snag list visit"
  };

  return `${labels[jobType]} - ${industry}`;
}

function createTimeline(
  jobCode: string,
  status: FieldOpsJobStatus,
  scheduledStart: Date,
  scheduledEnd: Date,
  technicianName: string,
  dispatcherName: string
) {
  const items: FieldOpsTimelineItem[] = [
    {
      id: `${jobCode}-created`,
      title: "Job created",
      detail: "Office captured the customer request and priority.",
      actor: dispatcherName,
      timestamp: subHours(scheduledStart, 20).toISOString(),
      tone: "info"
    },
    {
      id: `${jobCode}-assigned`,
      title: "Assigned to technician",
      detail: `${technicianName} received the job on mobile.`,
      actor: dispatcherName,
      timestamp: subHours(scheduledStart, 18).toISOString(),
      tone: "accent"
    }
  ];

  if (
    status === "En Route" ||
    status === "On Site" ||
    status === "In Progress" ||
    status === "Paused" ||
    status === "Completed" ||
    status === "Invoiced" ||
    status === "Overdue"
  ) {
    items.push({
      id: `${jobCode}-travel`,
      title: "Technician en route",
      detail: "Travel started from the previous stop with GPS capture enabled.",
      actor: technicianName,
      timestamp: subMinutes(scheduledStart, 40).toISOString(),
      tone: "info"
    });
  }

  if (
    status === "On Site" ||
    status === "In Progress" ||
    status === "Paused" ||
    status === "Completed" ||
    status === "Invoiced" ||
    status === "Overdue"
  ) {
    items.push({
      id: `${jobCode}-onsite`,
      title: "Arrived on site",
      detail: "Technician checked in and confirmed site access.",
      actor: technicianName,
      timestamp: addMinutes(scheduledStart, 8).toISOString(),
      tone: "success"
    });
  }

  if (
    status === "In Progress" ||
    status === "Paused" ||
    status === "Completed" ||
    status === "Invoiced" ||
    status === "Overdue"
  ) {
    items.push({
      id: `${jobCode}-notes`,
      title: "Work notes added",
      detail: "Photos, notes, and used materials were logged from the mobile app.",
      actor: technicianName,
      timestamp: addMinutes(scheduledStart, 46).toISOString(),
      tone: "accent"
    });
  }

  if (status === "Paused") {
    items.push({
      id: `${jobCode}-paused`,
      title: "Job paused",
      detail: "Work paused while waiting for site approval and replacement stock.",
      actor: technicianName,
      timestamp: addMinutes(scheduledStart, 78).toISOString(),
      tone: "warning"
    });
  }

  if (status === "Overdue") {
    items.push({
      id: `${jobCode}-overdue`,
      title: "Marked overdue",
      detail: "Scheduled visit slipped past SLA and escalated to dispatch.",
      actor: dispatcherName,
      timestamp: addMinutes(scheduledEnd, 90).toISOString(),
      tone: "danger"
    });
  }

  if (status === "Completed" || status === "Invoiced") {
    items.push(
      {
        id: `${jobCode}-signature`,
        title: "Client signature captured",
        detail: "Customer signed off the completed work from the technician device.",
        actor: technicianName,
        timestamp: addMinutes(scheduledEnd, 6).toISOString(),
        tone: "success"
      },
      {
        id: `${jobCode}-completed`,
        title: "Job completed",
        detail: "Completion report was sent back to the office instantly.",
        actor: technicianName,
        timestamp: addMinutes(scheduledEnd, 18).toISOString(),
        tone: "success"
      }
    );
  }

  if (status === "Invoiced") {
    items.push({
      id: `${jobCode}-invoiced`,
      title: "Invoice created",
      detail: "Finance generated an invoice from the completed job summary.",
      actor: "Accounts desk",
      timestamp: addMinutes(scheduledEnd, 120).toISOString(),
      tone: "accent"
    });
  }

  return items.sort((left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime());
}

export const fieldOpsCustomers: FieldOpsCustomer[] = customerSeeds.map((seed, index) => ({
  id: `customer-${String(index + 1).padStart(2, "0")}`,
  companyId,
  companyName: seed[0],
  contactName: seed[1],
  industry: seed[2],
  email: createEmail(seed[0]),
  phone: `+27 11 5${String(1000 + index).slice(-3)} ${String(2200 + index).slice(-4)}`,
  address: seed[3],
  suburb: seed[3].split(", ").at(-1) ?? "Johannesburg",
  tags: [seed[2].split(" ")[0], index % 2 === 0 ? "VIP" : "SLA"],
  notes:
    index % 2 === 0
      ? "Prefers WhatsApp updates before technicians arrive on site."
      : "Site access is managed at reception. Office requires attendance timestamps."
}));

export const fieldOpsJobs: FieldOpsJob[] = Array.from({ length: 60 }, (_, index) => {
  const customer = fieldOpsCustomers[index % fieldOpsCustomers.length];
  const technician = fieldOpsTechnicians[index % fieldOpsTechnicians.length];
  const status = jobStatusPool[index];
  const jobType = jobTypes[index % jobTypes.length];
  const priority = priorities[index % priorities.length];
  const dispatcher = fieldOpsProfiles.find((profile) => profile.role === "dispatcher")!;
  const { scheduledStart, scheduledEnd, estimatedDurationHours } = getJobStatusTiming(index, status);
  const timeline = createTimeline(
    `FOM-${String(1001 + index)}`,
    status,
    scheduledStart,
    scheduledEnd,
    technician.name,
    dispatcher.fullName
  );
  const startedTravelAt = timeline.find((item) => item.title === "Technician en route")?.timestamp;
  const checkInAt = timeline.find((item) => item.title === "Arrived on site")?.timestamp;
  const startedWorkAt =
    status === "In Progress" || status === "Paused" || status === "Completed" || status === "Invoiced"
      ? addMinutes(scheduledStart, 20).toISOString()
      : undefined;
  const completedAt = timeline.find((item) => item.title === "Job completed")?.timestamp;
  const checkOutAt =
    completedAt && (status === "Completed" || status === "Invoiced")
      ? addMinutes(new Date(completedAt), 6).toISOString()
      : undefined;
  const updatedAt = timeline.at(-1)?.timestamp ?? scheduledStart.toISOString();

  return {
    id: `job-${String(index + 1).padStart(3, "0")}`,
    companyId,
    jobCode: `FOM-${String(1001 + index)}`,
    customerId: customer.id,
    technicianId: technician.id,
    dispatcherId: dispatcher.id,
    title: getJobTitle(jobType, customer.industry),
    industry: customer.industry,
    jobType,
    priority,
    status,
    customerName: customer.contactName,
    customerCompany: customer.companyName,
    customerPhone: customer.phone,
    customerEmail: customer.email,
    address: customer.address,
    suburb: customer.suburb,
    description: `Complete the ${jobType.replace(/-/g, " ")} work for ${customer.companyName}. Capture photos, log materials used, and update the office with progress milestones from the mobile app.`,
    workSummary:
      jobType === "installation"
        ? "Install and commission the new equipment, test operation, and brief the customer."
        : jobType === "repair"
          ? "Diagnose the reported fault, replace damaged parts, and verify the fix before sign-off."
          : jobType === "inspection"
            ? "Inspect the site condition, flag defects, and capture photos for the office report."
            : "Perform the scheduled work, update notes, and return the job card ready for invoicing.",
    laborNotes:
      status === "Completed" || status === "Invoiced"
        ? "Technician completed all tasks, tested output, and left the site operational."
        : status === "Overdue"
          ? "Access delays and unavailable site contact prevented completion inside the target SLA."
          : "Work is underway with mobile updates syncing back to office in real time.",
    internalNotes:
      index % 3 === 0
        ? "Priority client. Keep dispatcher updated if ETA moves by more than 15 minutes."
        : "Capture before/after proof and confirm materials usage for quoting accuracy.",
    customerInstructions:
      index % 2 === 0
        ? "Call customer 15 minutes before arrival and sign in at reception."
        : "Use the side service entrance and send an update once the job reaches 75% completion.",
    scheduledStart: scheduledStart.toISOString(),
    scheduledEnd: scheduledEnd.toISOString(),
    estimatedDurationHours,
    startedTravelAt,
    checkInAt,
    startedWorkAt,
    completedAt,
    checkOutAt,
    createdAt: subHours(scheduledStart, 24).toISOString(),
    updatedAt,
    gpsStatus:
      status === "Assigned" || status === "New" ? "Pending capture" : status === "Overdue" ? "Delayed" : "Captured on arrival",
    capturedLocation: `${customer.suburb}, Johannesburg`,
    timeline
  };
});

const materialCatalog = [
  ["PVC elbow 22mm", 85],
  ["2.5mm twin cable", 145],
  ["Outdoor PIR detector", 560],
  ["Condensate pump", 1140],
  ["Copper fitting set", 310],
  ["Circuit breaker 20A", 190],
  ["Sealant and consumables", 125],
  ["Filter cartridge", 420],
  ["Cleaning chemical pack", 280],
  ["Wall plug and anchor set", 75]
] as const;

export const fieldOpsJobMaterials: FieldOpsJobMaterial[] = fieldOpsJobs
  .filter((job, index) => index < 36)
  .flatMap((job, index) =>
    Array.from({ length: (index % 3) + 1 }, (_, itemIndex) => {
      const material = materialCatalog[(index + itemIndex) % materialCatalog.length];
      return {
        id: `${job.id}-material-${itemIndex + 1}`,
        jobId: job.id,
        itemName: material[0],
        quantity: (itemIndex % 2) + 1,
        unitCost: material[1],
        notes:
          itemIndex % 2 === 0
            ? "Logged on mobile during site visit."
            : "Collected from van stock before work started."
      };
    })
  );

export const fieldOpsJobNotes: FieldOpsJobNote[] = fieldOpsJobs.flatMap((job, index) => [
  {
    id: `${job.id}-note-1`,
    jobId: job.id,
    author: fieldOpsTechnicians.find((technician) => technician.id === job.technicianId)?.name ?? "Technician",
    body:
      index % 2 === 0
        ? "Access gained after customer call. Started with site safety check and initial photos."
        : "Customer confirmed preferred completion window. Logged status update for office visibility.",
    createdAt: addMinutes(new Date(job.scheduledStart), 32).toISOString()
  },
  {
    id: `${job.id}-note-2`,
    jobId: job.id,
    author: "Lebo Nkosi",
    body:
      job.status === "Overdue"
        ? "Escalated to dispatch for client update and rescheduling plan."
        : "Office update sent to client contact with ETA and technician details.",
    createdAt: addMinutes(new Date(job.scheduledStart), 68).toISOString()
  }
]);

export const fieldOpsJobPhotos: FieldOpsJobPhoto[] = [
  ...fieldOpsJobs.slice(0, 30).flatMap((job, index) => [
    {
      id: `${job.id}-photo-before`,
      jobId: job.id,
      stage: "Before" as const,
      caption: "Arrival condition captured before work started.",
      fileName: `${job.jobCode.toLowerCase()}-before.jpg`,
      uploadedBy: fieldOpsTechnicians.find((technician) => technician.id === job.technicianId)?.name ?? "Technician",
      uploadedAt: addMinutes(new Date(job.scheduledStart), 12).toISOString(),
      tone: index % 2 === 0 ? "from-sky-500 to-cyan-400" : "from-indigo-500 to-blue-400"
    },
    {
      id: `${job.id}-photo-after`,
      jobId: job.id,
      stage: "After" as const,
      caption: "Completion proof captured for office and client sign-off.",
      fileName: `${job.jobCode.toLowerCase()}-after.jpg`,
      uploadedBy: fieldOpsTechnicians.find((technician) => technician.id === job.technicianId)?.name ?? "Technician",
      uploadedAt: addMinutes(new Date(job.scheduledStart), 96).toISOString(),
      tone: index % 2 === 0 ? "from-emerald-500 to-teal-400" : "from-cyan-500 to-blue-500"
    }
  ]),
  ...fieldOpsJobs.slice(30, 50).map((job, index) => ({
    id: `${job.id}-photo-progress`,
    jobId: job.id,
    stage: index % 3 === 0 ? ("Document" as const) : ("Progress" as const),
    caption:
      index % 3 === 0
        ? "Supporting site document attached to the job card."
        : "Progress shot added during active work.",
    fileName: `${job.jobCode.toLowerCase()}-progress-${index + 1}.jpg`,
    uploadedBy: fieldOpsTechnicians.find((technician) => technician.id === job.technicianId)?.name ?? "Technician",
    uploadedAt: addMinutes(new Date(job.scheduledStart), 54).toISOString(),
    tone: index % 2 === 0 ? "from-amber-500 to-orange-400" : "from-fuchsia-500 to-violet-400"
  }))
];

export const fieldOpsJobFiles: FieldOpsJobFile[] = fieldOpsJobs
  .filter((_, index) => index % 3 === 0)
  .map((job, index) => ({
    id: `${job.id}-file-1`,
    jobId: job.id,
    name: index % 2 === 0 ? "site-access-note.pdf" : "equipment-serial-sheet.pdf",
    size: `${(0.8 + (index % 4) * 0.3).toFixed(1)} MB`,
    category: index % 2 === 0 ? "Site document" : "Technical record",
    uploadedBy: "Office Staff",
    uploadedAt: subHours(new Date(job.scheduledStart), 8).toISOString()
  }));

const signableJobs = fieldOpsJobs.filter(
  (job) => job.status === "Completed" || job.status === "Invoiced"
);

export const fieldOpsJobSignatures: FieldOpsJobSignature[] = signableJobs.map((job) => ({
  id: `${job.id}-signature`,
  jobId: job.id,
  customerName: job.customerName,
  note: "Work completed to satisfaction. Site handed back clean and operational.",
  signedAt: addMinutes(new Date(job.completedAt ?? job.scheduledEnd), 5).toISOString()
}));

const quoteStatuses: FieldOpsQuoteStatus[] = [
  "Draft",
  "Sent",
  "Approved",
  "Converted",
  "Sent",
  "Approved",
  "Rejected",
  "Expired",
  "Draft",
  "Sent",
  "Approved",
  "Converted",
  "Sent",
  "Approved",
  "Converted",
  "Sent",
  "Draft",
  "Approved"
];

export const fieldOpsQuotes: FieldOpsQuote[] = fieldOpsJobs.slice(0, 18).map((job, index) => ({
  id: `quote-${String(index + 1).padStart(3, "0")}`,
  quoteNumber: `Q-2026-${String(index + 1).padStart(3, "0")}`,
  jobId: job.id,
  customerId: job.customerId,
  customerName: job.customerCompany,
  status: quoteStatuses[index],
  total: 2800 + index * 540,
  issuedAt: subDays(new Date(job.scheduledStart), 2).toISOString(),
  validUntil: addDays(new Date(job.scheduledStart), 10).toISOString(),
  approvalNote:
    quoteStatuses[index] === "Approved" || quoteStatuses[index] === "Converted"
      ? "Customer approved via email and office converted the quote into a scheduled job."
      : quoteStatuses[index] === "Rejected"
        ? "Customer requested a revised scope and lower-cost alternative."
        : "Awaiting customer confirmation and preferred install date."
}));

const invoiceSourceJobs = fieldOpsJobs.filter(
  (job) => job.status === "Completed" || job.status === "Invoiced"
).slice(0, 22);

const invoiceStatuses: FieldOpsInvoiceStatus[] = [
  "Paid",
  "Unpaid",
  "Paid",
  "Overdue",
  "Partially Paid",
  "Paid",
  "Unpaid",
  "Paid",
  "Paid",
  "Overdue",
  "Paid",
  "Unpaid",
  "Partially Paid",
  "Paid",
  "Paid",
  "Unpaid",
  "Paid",
  "Overdue",
  "Paid",
  "Partially Paid",
  "Unpaid",
  "Paid"
];

export const fieldOpsInvoices: FieldOpsInvoice[] = invoiceSourceJobs.map((job, index) => {
  const issuedAt = addHours(new Date(job.completedAt ?? job.scheduledEnd), 4);
  const dueAt = addDays(issuedAt, 14);
  const status = invoiceStatuses[index];

  return {
    id: `invoice-${String(index + 1).padStart(3, "0")}`,
    invoiceNumber: `INV-2026-${String(index + 1).padStart(3, "0")}`,
    jobId: job.id,
    customerId: job.customerId,
    customerName: job.customerCompany,
    status,
    total: 3450 + index * 620,
    issuedAt: issuedAt.toISOString(),
    dueAt: dueAt.toISOString(),
    paidAt: status === "Paid" ? addDays(issuedAt, 6).toISOString() : undefined,
    summary: "Invoice generated directly from the completed job card, materials, and labor notes."
  };
});

const rawActivity = [
  ...fieldOpsJobs.flatMap((job) =>
    job.timeline.map((entry) => ({
      id: `${job.id}-${entry.id}`,
      jobId: job.id,
      title: entry.title,
      detail: `${job.jobCode} - ${entry.detail}`,
      actor: entry.actor,
      createdAt: entry.timestamp,
      tone: entry.tone
    }))
  ),
  ...fieldOpsQuotes.map((quote) => ({
    id: `${quote.id}-activity`,
    title: `Quote ${quote.quoteNumber} ${quote.status.toLowerCase()}`,
    detail: `${quote.customerName} quote is currently ${quote.status.toLowerCase()}.`,
    actor: "Office Staff",
    createdAt: quote.issuedAt,
    tone: quote.status === "Rejected" || quote.status === "Expired" ? ("warning" as const) : ("accent" as const)
  })),
  ...fieldOpsInvoices.map((invoice) => ({
    id: `${invoice.id}-activity`,
    title: `Invoice ${invoice.invoiceNumber} ${invoice.status.toLowerCase()}`,
    detail: `${invoice.customerName} invoice amount recorded at R${invoice.total.toLocaleString("en-ZA")}.`,
    actor: "Accounts desk",
    createdAt: invoice.issuedAt,
    tone:
      invoice.status === "Overdue"
        ? ("danger" as const)
        : invoice.status === "Paid"
          ? ("success" as const)
          : ("info" as const)
  }))
].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

export const fieldOpsActivityLog: FieldOpsActivityLog[] = rawActivity.slice(0, 120);

export const fieldOpsNotifications: FieldOpsNotification[] = [
  {
    id: "notification-1",
    title: "New urgent job assigned",
    description: "Ethan Dlamini received FOM-1032 with a 35 min SLA response target.",
    createdAt: subMinutes(now, 14).toISOString(),
    unread: true,
    roles: ["admin", "dispatcher", "manager", "technician"],
    href: "/workspace/jobs/job-032"
  },
  {
    id: "notification-2",
    title: "Client waiting on update",
    description: "Northline Business Park asked for ETA on the repair team.",
    createdAt: subMinutes(now, 22).toISOString(),
    unread: true,
    roles: ["admin", "dispatcher", "manager"],
    href: "/workspace/jobs"
  },
  {
    id: "notification-3",
    title: "Quote approved",
    description: "Q-2026-011 was approved and is ready to convert into a scheduled job.",
    createdAt: subHours(now, 1).toISOString(),
    unread: true,
    roles: ["admin", "dispatcher", "manager"],
    href: "/workspace/quotes"
  },
  {
    id: "notification-4",
    title: "Invoice paid",
    description: "INV-2026-008 was marked paid and customer history updated.",
    createdAt: subHours(now, 2).toISOString(),
    unread: false,
    roles: ["admin", "manager"],
    href: "/workspace/invoices"
  },
  {
    id: "notification-5",
    title: "Overdue job escalated",
    description: "FOM-1041 breached SLA and dispatch escalation has been logged.",
    createdAt: subHours(now, 3).toISOString(),
    unread: true,
    roles: ["admin", "dispatcher", "manager"],
    href: "/workspace/jobs/job-041"
  },
  {
    id: "notification-6",
    title: "Technician checked in on site",
    description: "Ayanda Khumalo checked in at Parkside Retail Plaza.",
    createdAt: subHours(now, 4).toISOString(),
    unread: false,
    roles: ["admin", "dispatcher", "manager"],
    href: "/workspace/jobs/job-004"
  },
  {
    id: "notification-7",
    title: "Photo upload received",
    description: "Before-and-after photos were added to FOM-1012.",
    createdAt: subHours(now, 5).toISOString(),
    unread: false,
    roles: ["admin", "dispatcher", "manager", "technician"],
    href: "/workspace/jobs/job-012"
  },
  {
    id: "notification-8",
    title: "Dispatch board updated",
    description: "Kabelo Maseko was reassigned to a same-day plumbing callout.",
    createdAt: subHours(now, 6).toISOString(),
    unread: false,
    roles: ["admin", "dispatcher", "manager"],
    href: "/workspace/dispatch"
  }
];

export const fieldOpsIntegrations: FieldOpsIntegration[] = [
  {
    id: "integration-whatsapp",
    name: "WhatsApp",
    category: "Messaging",
    description: "Send technician ETAs, client updates, and sign-off messages.",
    status: "Connected",
    detail: "Connected through shared company inbox"
  },
  {
    id: "integration-email",
    name: "Email",
    category: "Communication",
    description: "Deliver quotes, invoices, appointment confirmations, and updates.",
    status: "Connected",
    detail: "SMTP relay verified"
  },
  {
    id: "integration-maps",
    name: "Maps / navigation",
    category: "Field mobility",
    description: "Open job sites in navigation and capture arrival context.",
    status: "Connected",
    detail: "Deep links enabled on technician mobile app"
  },
  {
    id: "integration-accounting",
    name: "Accounting",
    category: "Finance",
    description: "Push completed invoices to the accounting platform.",
    status: "Not connected",
    detail: "Waiting on finance API keys"
  },
  {
    id: "integration-crm",
    name: "CRM",
    category: "Sales",
    description: "Sync customers, site notes, service history, and approvals.",
    status: "Connected",
    detail: "Customer records syncing every 15 minutes"
  },
  {
    id: "integration-automation",
    name: "Automation",
    category: "Workflow",
    description: "Trigger reminders, overdue escalations, and client follow-ups.",
    status: "Connected",
    detail: "Rule engine active"
  },
  {
    id: "integration-payments",
    name: "Payment gateway",
    category: "Finance",
    description: "Take card or EFT settlements directly from invoices.",
    status: "Coming soon",
    detail: "Scheduled for next release"
  },
  {
    id: "integration-webhooks",
    name: "Webhooks",
    category: "Platform",
    description: "Send outbound job status, quote, and invoice events to external systems.",
    status: "Not connected",
    detail: "Awaiting endpoint configuration"
  }
];

export const fieldOpsLandingFeatures = [
  {
    title: "Dispatch and field staff stay synced",
    description:
      "Office teams assign work, track technicians, see job progress live, and respond faster when priorities change."
  },
  {
    title: "Technicians complete the job card on mobile",
    description:
      "Capture notes, before-and-after photos, materials, location, and signatures from the same touch-first workflow."
  },
  {
    title: "From quote to invoice in one flow",
    description:
      "Convert approved quotes into jobs, finish the work, and raise invoices directly from completed job data."
  },
  {
    title: "Built for real service businesses",
    description:
      "Electrical, plumbing, security, HVAC, cleaning, repair, and maintenance teams all fit the same operational model."
  },
  {
    title: "White-label ready",
    description:
      "Business name, app name, logo placeholder, support contact, and accent color can all be adapted for client demos."
  },
  {
    title: "Mobile-first and installable",
    description:
      "The technician experience feels like an operational mobile app, complete with install prompts and offline-ready status cues."
  }
];

export const fieldOpsUseCases = [
  "Electrical maintenance teams",
  "Plumbing and leak repair businesses",
  "Security installation companies",
  "Aircon and HVAC contractors",
  "Cleaning and facilities teams",
  "Property maintenance businesses"
];

export const fieldOpsShowcaseCards = [
  {
    title: "Technician mobile dashboard",
    subtitle: "Jobs, travel, check-in, notes, and quick actions on one screen"
  },
  {
    title: "Dispatch board",
    subtitle: "Drag-style scheduling layout for same-day and weekly workload balancing"
  },
  {
    title: "Job detail flow",
    subtitle: "Timeline, photos, materials, signature, and status transitions in one polished view"
  },
  {
    title: "Quotes and invoices",
    subtitle: "Commercial documents linked to completed work, ready for print and export"
  }
];

export const fieldOpsTestimonials = [
  {
    quote:
      "FieldOps Mobile feels exactly like the kind of field service app a real operations team would buy. The technician flow sells itself.",
    name: "Megan Roodt",
    title: "Director, Service Growth Studio"
  },
  {
    quote:
      "The dispatch board, job cards, and invoice handoff make the platform look like a finished SaaS product, not a mock admin panel.",
    name: "Andre Peterson",
    title: "Founder, Apex Demo Labs"
  },
  {
    quote:
      "It gives us a polished white-label base for electricians, plumbers, security installers, and property maintenance businesses.",
    name: "Aisha Khan",
    title: "Solutions Lead, Custom Apps Co"
  }
];

export const fieldOpsFaqs = [
  {
    question: "Can technicians use this like a mobile app?",
    answer:
      "Yes. The experience is built mobile first, includes touch-friendly controls, and is set up with PWA install support so it behaves like operational field software."
  },
  {
    question: "Does it support quotes and invoices too?",
    answer:
      "Yes. The demo includes quote tracking, invoice generation, payment status, and print-friendly document views linked back to jobs."
  },
  {
    question: "Can it be branded for different businesses?",
    answer:
      "Yes. The app name, business name, logo placeholder, accent color, and support contact are all configurable for white-label demos."
  },
  {
    question: "Is the data realistic enough for demos and screenshots?",
    answer:
      "Yes. The seeded system includes customers, technicians, jobs, photos, quotes, invoices, notifications, and activity history that make the platform feel alive."
  }
];

export function getFieldOpsProfileById(id: string) {
  return fieldOpsProfiles.find((profile) => profile.id === id) ?? null;
}

export function getFieldOpsProfileByEmail(email: string) {
  return fieldOpsProfiles.find(
    (profile) => profile.email.toLowerCase() === email.toLowerCase()
  ) ?? null;
}

export function getFieldOpsDefaultProfile(role: FieldOpsRole) {
  return fieldOpsProfiles.find((profile) => profile.role === role) ?? fieldOpsProfiles[0];
}

export function getFieldOpsTechnicianById(id: string) {
  return fieldOpsTechnicians.find((technician) => technician.id === id) ?? null;
}

export function getFieldOpsTechnicianByProfileId(profileId: string) {
  return fieldOpsTechnicians.find((technician) => technician.profileId === profileId) ?? null;
}

export function getRoleLabel(role: FieldOpsRole) {
  switch (role) {
    case "admin":
      return "Admin";
    case "dispatcher":
      return "Dispatcher";
    case "technician":
      return "Field Technician";
    default:
      return "Manager";
  }
}

export function canAccessOfficeTools(role: FieldOpsRole) {
  return role !== "technician";
}

export function canManageSettings(role: FieldOpsRole) {
  return role === "admin" || role === "manager";
}

export function getJobStatusTone(status: FieldOpsJobStatus): FieldOpsStatusTone {
  switch (status) {
    case "Completed":
    case "Invoiced":
      return "success";
    case "Overdue":
    case "Cancelled":
      return "danger";
    case "Paused":
    case "Waiting on Client":
      return "warning";
    case "Assigned":
    case "New":
      return "accent";
    default:
      return "info";
  }
}

export function getPriorityTone(priority: FieldOpsPriority): FieldOpsStatusTone {
  switch (priority) {
    case "Urgent":
      return "danger";
    case "High":
      return "warning";
    case "Normal":
      return "accent";
    default:
      return "neutral";
  }
}

export function getInvoiceStatusTone(status: FieldOpsInvoiceStatus): FieldOpsStatusTone {
  switch (status) {
    case "Paid":
      return "success";
    case "Overdue":
      return "danger";
    case "Partially Paid":
      return "warning";
    default:
      return "info";
  }
}

export function getQuoteStatusTone(status: FieldOpsQuoteStatus): FieldOpsStatusTone {
  switch (status) {
    case "Approved":
    case "Converted":
      return "success";
    case "Rejected":
    case "Expired":
      return "danger";
    case "Sent":
      return "accent";
    default:
      return "neutral";
  }
}

export function getIntegrationStatusTone(status: FieldOpsIntegrationStatus): FieldOpsStatusTone {
  switch (status) {
    case "Connected":
      return "success";
    case "Not connected":
      return "warning";
    default:
      return "accent";
  }
}

export function getJobsForRole(role: FieldOpsRole, technicianId?: string | null) {
  if (role !== "technician" || !technicianId) {
    return fieldOpsJobs;
  }

  return fieldOpsJobs.filter((job) => job.technicianId === technicianId);
}

export function getCustomerById(id: string) {
  return fieldOpsCustomers.find((customer) => customer.id === id) ?? null;
}

export function getJobById(id: string) {
  const job = fieldOpsJobs.find((entry) => entry.id === id);

  if (!job) {
    return null;
  }

  return {
    ...job,
    customer: getCustomerById(job.customerId),
    technician: getFieldOpsTechnicianById(job.technicianId),
    dispatcher: getFieldOpsProfileById(job.dispatcherId),
    notes: fieldOpsJobNotes.filter((note) => note.jobId === id),
    photos: fieldOpsJobPhotos.filter((photo) => photo.jobId === id),
    files: fieldOpsJobFiles.filter((file) => file.jobId === id),
    materials: fieldOpsJobMaterials.filter((material) => material.jobId === id),
    signature: fieldOpsJobSignatures.find((signature) => signature.jobId === id) ?? null,
    quote: fieldOpsQuotes.find((quote) => quote.jobId === id) ?? null,
    invoice: fieldOpsInvoices.find((invoice) => invoice.jobId === id) ?? null
  };
}

export function getCustomerDetail(id: string) {
  const customer = getCustomerById(id);

  if (!customer) {
    return null;
  }

  const jobs = fieldOpsJobs.filter((job) => job.customerId === id);
  const invoices = fieldOpsInvoices.filter((invoice) => invoice.customerId === id);

  return {
    ...customer,
    jobs,
    invoices,
    activeJobs: jobs.filter((job) => !["Completed", "Cancelled", "Invoiced"].includes(job.status)).length,
    jobHistoryCount: jobs.length,
    lifetimeValue: invoices.reduce((total, invoice) => total + invoice.total, 0)
  };
}

export function getSearchItems(role: FieldOpsRole, technicianId?: string | null): FieldOpsSearchItem[] {
  const visibleJobs = getJobsForRole(role, technicianId);

  return [
    {
      id: "search-dispatch",
      label: "Dispatch board",
      type: "Workspace",
      href: "/workspace/dispatch",
      meta: "Scheduling and technician workload"
    },
    ...visibleJobs.slice(0, 22).map((job) => ({
      id: job.id,
      label: job.jobCode,
      type: "Job",
      href: `/workspace/jobs/${job.id}`,
      meta: `${job.customerCompany} • ${job.status}`
    })),
    ...fieldOpsCustomers.slice(0, 12).map((customer) => ({
      id: customer.id,
      label: customer.companyName,
      type: "Customer",
      href: `/workspace/customers/${customer.id}`,
      meta: customer.industry
    })),
    ...fieldOpsQuotes.slice(0, 6).map((quote) => ({
      id: quote.id,
      label: quote.quoteNumber,
      type: "Quote",
      href: "/workspace/quotes",
      meta: quote.customerName
    })),
    ...fieldOpsInvoices.slice(0, 6).map((invoice) => ({
      id: invoice.id,
      label: invoice.invoiceNumber,
      type: "Invoice",
      href: `/workspace/invoices/${invoice.id}`,
      meta: invoice.customerName
    }))
  ];
}

export function getNotificationsForRole(role: FieldOpsRole) {
  return fieldOpsNotifications
    .filter((notification) => notification.roles.includes(role))
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

export function getOfficeDashboardSnapshot() {
  const jobsToday = fieldOpsJobs.filter((job) => isSameDay(new Date(job.scheduledStart), now)).length;
  const openJobs = fieldOpsJobs.filter(
    (job) => !["Completed", "Invoiced", "Cancelled"].includes(job.status)
  ).length;
  const completedJobs = fieldOpsJobs.filter((job) => job.status === "Completed").length;
  const inProgressJobs = fieldOpsJobs.filter((job) => job.status === "In Progress").length;
  const overdueJobs = fieldOpsJobs.filter((job) => job.status === "Overdue").length;
  const activeTechnicians = fieldOpsTechnicians.filter((technician) => technician.status !== "Offline").length;
  const pendingQuotes = fieldOpsQuotes.filter((quote) => ["Draft", "Sent"].includes(quote.status)).length;
  const invoicesRaised = fieldOpsInvoices.length;
  const revenueSummary = fieldOpsInvoices.reduce((total, invoice) => total + invoice.total, 0);

  const statusBreakdown = [
    "New",
    "Assigned",
    "En Route",
    "On Site",
    "In Progress",
    "Paused",
    "Waiting on Client",
    "Completed",
    "Invoiced",
    "Cancelled",
    "Overdue"
  ].map((status) => ({
    label: status,
    value: fieldOpsJobs.filter((job) => job.status === status).length
  }));

  const workload = fieldOpsTechnicians.map((technician) => {
    const assigned = fieldOpsJobs.filter((job) => job.technicianId === technician.id).length;
    const today = fieldOpsJobs.filter(
      (job) => job.technicianId === technician.id && isSameDay(new Date(job.scheduledStart), now)
    ).length;
    return {
      label: technician.name.split(" ")[0],
      assigned,
      today
    };
  });

  const revenueByType = jobTypes.map((type, index) => ({
    label: type.replace(/\b\w/g, (value) => value.toUpperCase()),
    value: 8000 + index * 3200
  }));

  return {
    metrics: [
      { label: "Total jobs today", value: String(jobsToday), change: "Live dispatch schedule", tone: "accent" as const },
      { label: "Open jobs", value: String(openJobs), change: "Across all field teams", tone: "info" as const },
      { label: "Completed jobs", value: String(completedJobs), change: "Ready for job sheets and billing", tone: "success" as const },
      { label: "Jobs in progress", value: String(inProgressJobs), change: "Technicians actively on site", tone: "warning" as const },
      { label: "Overdue jobs", value: String(overdueJobs), change: "Needs office action", tone: "danger" as const },
      { label: "Active technicians", value: String(activeTechnicians), change: "Logged in or on route", tone: "accent" as const },
      { label: "Pending quotes", value: String(pendingQuotes), change: "Awaiting client decisions", tone: "warning" as const },
      { label: "Invoices raised", value: String(invoicesRaised), change: "Generated from completed work", tone: "accent" as const }
    ],
    revenueSummary,
    statusBreakdown,
    workload,
    revenueByType,
    recentActivity: fieldOpsActivityLog.slice(0, 8),
    quickActions: [
      { label: "Create job", href: "/workspace/jobs/new" },
      { label: "Open dispatch", href: "/workspace/dispatch" },
      { label: "Review quotes", href: "/workspace/quotes" },
      { label: "Raise invoices", href: "/workspace/invoices" }
    ]
  };
}

export function getTechnicianDashboardSnapshot(profileId: string) {
  const technician = getFieldOpsTechnicianByProfileId(profileId);
  const jobs = fieldOpsJobs.filter((job) => job.technicianId === technician?.id);
  const todaysJobs = jobs.filter((job) => isSameDay(new Date(job.scheduledStart), now));
  const upcomingJobs = jobs.filter((job) => new Date(job.scheduledStart) > now).slice(0, 4);
  const inProgress = jobs.filter((job) =>
    ["In Progress", "On Site", "En Route", "Paused"].includes(job.status)
  );
  const completed = jobs.filter((job) => job.status === "Completed" || job.status === "Invoiced");
  const checkedIn = jobs.some((job) => ["On Site", "In Progress", "Paused"].includes(job.status));

  return {
    technician,
    todaysJobs,
    upcomingJobs,
    checkedIn,
    inProgress,
    completed,
    notifications: getNotificationsForRole("technician"),
    performance: [
      { label: "First-time fix rate", value: "92%", detail: "Past 30 days" },
      { label: "Average response time", value: "41 min", detail: "Urgent and callout jobs" },
      { label: "Customer sign-offs", value: String(completed.length), detail: "Captured this month" }
    ]
  };
}

export function getDispatchSnapshot() {
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd }).slice(0, 5);

  return {
    dayColumns: fieldOpsTechnicians.map((technician) => ({
      technician,
      jobs: fieldOpsJobs
        .filter((job) => job.technicianId === technician.id && isSameDay(new Date(job.scheduledStart), now))
        .sort((left, right) => new Date(left.scheduledStart).getTime() - new Date(right.scheduledStart).getTime())
    })),
    weekMatrix: days.map((day) => ({
      label: day.toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" }),
      technicians: fieldOpsTechnicians.map((technician) => ({
        technician,
        jobs: fieldOpsJobs.filter(
          (job) =>
            job.technicianId === technician.id && isSameDay(new Date(job.scheduledStart), day)
        )
      }))
    })),
    filters: {
      technicians: fieldOpsTechnicians.map((technician) => technician.name),
      dates: {
        today: startOfDay(now).toISOString(),
        end: endOfDay(addDays(now, 4)).toISOString()
      }
    }
  };
}

export function getReportingSnapshot() {
  const completedThisWeek = fieldOpsJobs.filter(
    (job) => job.completedAt && new Date(job.completedAt) >= subDays(now, 7)
  ).length;
  const completedThisMonth = fieldOpsJobs.filter(
    (job) => job.completedAt && new Date(job.completedAt) >= subDays(now, 30)
  ).length;

  return {
    kpis: [
      { label: "Jobs completed this week", value: String(completedThisWeek), detail: "Across all teams" },
      { label: "Jobs completed this month", value: String(completedThisMonth), detail: "Delivery trend" },
      { label: "Average response time", value: "46 min", detail: "Urgent jobs" },
      { label: "Average completion time", value: "2.8 hrs", detail: "Active field work" },
      { label: "Completion rate", value: "88%", detail: "Scheduled jobs closed inside SLA" },
      { label: "High-priority jobs", value: "19", detail: "This month" }
    ],
    technicianPerformance: fieldOpsTechnicians.map((technician, index) => ({
      label: technician.name,
      completed: 6 + (index % 5),
      response: 34 + index * 4
    })),
    revenueByType: jobTypes.map((type, index) => ({
      label: type.replace(/\b\w/g, (value) => value.toUpperCase()),
      revenue: 12000 + index * 3500
    })),
    weeklyTrend: eachDayOfInterval({
      start: startOfDay(subDays(now, 6)),
      end: endOfDay(now)
    }).map((day, index) => ({
      label: day.toLocaleDateString("en-ZA", { weekday: "short" }),
      completed: 4 + (index % 3),
      highPriority: 1 + (index % 2)
    }))
  };
}

export function getSettingsSnapshot() {
  return {
    branding: {
      portalName: env.portalName,
      companyName: env.companyName,
      logoPlaceholder: env.logoPlaceholder,
      accentHsl: env.accentHsl,
      supportEmail: env.supportEmail
    },
    businessHours: fieldOpsCompany.businessHours,
    defaultPriorities: ["Low", "Normal", "High", "Urgent"],
    technicianRoles: ["Senior Technician", "Technician", "Installer", "Team Lead"],
    notificationPreferences: [
      "Urgent job assigned",
      "Job overdue",
      "Quote approved",
      "Invoice paid",
      "Technician arrived on site"
    ],
    invoiceDefaults: {
      paymentTerms: "14 days",
      quoteValidity: "10 days",
      currency: "ZAR"
    }
  };
}
