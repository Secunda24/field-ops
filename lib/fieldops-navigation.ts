import type { FieldOpsRole } from "@/lib/fieldops-data";

export type FieldOpsNavIcon =
  | "activity"
  | "bell"
  | "calendar"
  | "chart"
  | "credit-card"
  | "home"
  | "link"
  | "settings"
  | "users"
  | "user-cog"
  | "wrench";

export interface FieldOpsNavItem {
  label: string;
  href: string;
  icon: FieldOpsNavIcon;
  roles?: FieldOpsRole[];
}

const workspaceItems: FieldOpsNavItem[] = [
  {
    label: "Dashboard",
    href: "/workspace",
    icon: "home"
  },
  {
    label: "Jobs",
    href: "/workspace/jobs",
    icon: "wrench"
  },
  {
    label: "Dispatch",
    href: "/workspace/dispatch",
    icon: "calendar",
    roles: ["admin", "dispatcher", "manager"]
  },
  {
    label: "Customers",
    href: "/workspace/customers",
    icon: "users"
  },
  {
    label: "Technicians",
    href: "/workspace/technicians",
    icon: "user-cog",
    roles: ["admin", "dispatcher", "manager"]
  },
  {
    label: "Quotes",
    href: "/workspace/quotes",
    icon: "credit-card",
    roles: ["admin", "dispatcher", "manager"]
  },
  {
    label: "Invoices",
    href: "/workspace/invoices",
    icon: "credit-card",
    roles: ["admin", "dispatcher", "manager"]
  },
  {
    label: "Reporting",
    href: "/workspace/reporting",
    icon: "chart",
    roles: ["admin", "dispatcher", "manager"]
  },
  {
    label: "Notifications",
    href: "/workspace/notifications",
    icon: "bell"
  },
  {
    label: "Activity",
    href: "/workspace/activity",
    icon: "activity",
    roles: ["admin", "dispatcher", "manager"]
  },
  {
    label: "Integrations",
    href: "/workspace/integrations",
    icon: "link",
    roles: ["admin", "dispatcher", "manager"]
  },
  {
    label: "Settings",
    href: "/workspace/settings",
    icon: "settings",
    roles: ["admin", "manager"]
  }
];

export function getWorkspaceNav(role: FieldOpsRole) {
  return workspaceItems.filter((item) => !item.roles || item.roles.includes(role));
}

export function getTechnicianBottomNav() {
  return [
    workspaceItems[0],
    workspaceItems[1],
    workspaceItems[3],
    workspaceItems[8]
  ];
}

export const fieldOpsMarketingNav = [
  { label: "Platform", href: "/#platform" },
  { label: "Mobile", href: "/#mobile" },
  { label: "Industries", href: "/#industries" },
  { label: "FAQ", href: "/#faq" }
];
