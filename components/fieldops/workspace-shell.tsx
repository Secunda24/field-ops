"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  CalendarRange,
  CreditCard,
  FolderClock,
  Home,
  Link2,
  LogOut,
  Menu,
  Search,
  Settings2,
  Users,
  Wrench
} from "lucide-react";

import { ModeToggle } from "@/components/layout/mode-toggle";
import { SiteLogo } from "@/components/shared/site-logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { BrandingSettings } from "@/lib/types";
import type { FieldOpsViewer } from "@/lib/fieldops-auth";
import type { FieldOpsNavIcon, FieldOpsNavItem } from "@/lib/fieldops-navigation";
import type { FieldOpsNotification, FieldOpsSearchItem } from "@/lib/fieldops-data";
import { cn, formatRelativeDate } from "@/lib/utils";

const navIcons: Record<FieldOpsNavIcon, typeof Home> = {
  activity: FolderClock,
  bell: Bell,
  calendar: CalendarRange,
  chart: BarChart3,
  "credit-card": CreditCard,
  home: Home,
  link: Link2,
  settings: Settings2,
  users: Users,
  "user-cog": Users,
  wrench: Wrench
};

function NavContent({
  items,
  branding
}: {
  items: FieldOpsNavItem[];
  branding: BrandingSettings;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6">
      <SiteLogo
        name={branding.portalName}
        mark={branding.logoPlaceholder}
        eyebrow="Field Service SaaS"
      />
      <div className="space-y-2">
        {items.map((item) => {
          const Icon = navIcons[item.icon];
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-brand text-brand-foreground shadow-lg shadow-brand/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="mt-auto rounded-3xl border border-border/70 bg-background/60 p-4">
        <p className="text-sm font-semibold">Sync health</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Mobile jobs are syncing. Last office refresh landed 42 seconds ago.
        </p>
      </div>
    </div>
  );
}

function SearchBox({ items }: { items: FieldOpsSearchItem[] }) {
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? items
        .filter((item) =>
          `${item.label} ${item.type} ${item.meta ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  return (
    <div className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search jobs, customers, quotes, invoices..."
        className="h-11 rounded-2xl border-border/70 bg-background/70 pl-10"
      />
      {results.length ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 rounded-3xl border border-border/70 bg-background/95 p-2 shadow-xl backdrop-blur">
          {results.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block rounded-2xl px-3 py-3 transition hover:bg-muted"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{item.label}</p>
                <span className="text-xs uppercase tracking-[0.18em] text-brand">
                  {item.type}
                </span>
              </div>
              {item.meta ? <p className="mt-1 text-sm text-muted-foreground">{item.meta}</p> : null}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function NotificationMenu({ notifications }: { notifications: FieldOpsNotification[] }) {
  const unread = notifications.filter((item) => item.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-4 w-4" />
          {unread ? <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand" /> : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] rounded-3xl">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((item) => (
          <DropdownMenuItem key={item.id} asChild>
            <Link href={item.href} className="block space-y-1 py-3">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">{item.title}</p>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeDate(item.createdAt)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function FieldOpsWorkspaceShell({
  viewer,
  branding,
  navItems,
  mobileNavItems,
  searchItems,
  notifications,
  children
}: {
  viewer: FieldOpsViewer;
  branding: BrandingSettings;
  navItems: FieldOpsNavItem[];
  mobileNavItems: FieldOpsNavItem[];
  searchItems: FieldOpsSearchItem[];
  notifications: FieldOpsNotification[];
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="surface hidden h-[calc(100vh-2rem)] rounded-[2rem] p-6 lg:block">
          <NavContent items={navItems} branding={branding} />
        </aside>
        <div className="space-y-6">
          <div className="surface sticky top-4 z-30 rounded-[2rem] p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-2xl lg:hidden">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="left-0 top-0 h-full max-w-sm translate-x-0 translate-y-0 rounded-none border-r p-6 sm:max-w-sm">
                    <NavContent items={navItems} branding={branding} />
                  </DialogContent>
                </Dialog>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    {viewer.profile.role === "technician" ? "Technician workspace" : "Operations workspace"}
                  </p>
                  <h2 className="font-display text-2xl font-semibold tracking-tight">
                    {branding.companyName}
                  </h2>
                </div>
              </div>
              <SearchBox items={searchItems} />
              <div className="flex items-center justify-between gap-2 xl:justify-end">
                <div className="flex items-center gap-2">
                  <NotificationMenu notifications={notifications} />
                  <ModeToggle />
                </div>
                <div className="hidden items-center gap-3 rounded-full border border-border/70 bg-background/70 px-3 py-2 sm:flex">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{viewer.profile.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-semibold">{viewer.profile.fullName}</p>
                    <p className="text-xs text-muted-foreground">{viewer.profile.title}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                  <Link href="/api/auth/logout">
                    <LogOut className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <main className="space-y-6">{children}</main>
        </div>
      </div>

      {viewer.profile.role === "technician" ? (
        <div className="fixed inset-x-4 bottom-4 z-30 lg:hidden">
          <div className="surface flex items-center justify-between rounded-[2rem] px-3 py-2 shadow-2xl">
            {mobileNavItems.map((item) => {
              const Icon = navIcons[item.icon];
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition",
                    active ? "bg-brand text-brand-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
