import Link from "next/link";

import { SiteLogo } from "@/components/shared/site-logo";
import { getBrandingSettings } from "@/lib/branding";

export function MarketingFooter() {
  const branding = getBrandingSettings();

  return (
    <footer className="border-t border-border/70 py-10">
      <div className="container flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <SiteLogo
            name={branding.portalName}
            mark={branding.logoPlaceholder}
            eyebrow="Field Service SaaS"
          />
          <p className="max-w-md text-sm text-muted-foreground">
            Premium mobile-first field service software for businesses that need polished dispatch, job cards, technician workflows, and commercial handoff.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link href="/#platform" className="transition hover:text-foreground">
            Platform
          </Link>
          <Link href="/#mobile" className="transition hover:text-foreground">
            Mobile app
          </Link>
          <Link href="/#faq" className="transition hover:text-foreground">
            FAQ
          </Link>
          <Link href="/login" className="transition hover:text-foreground">
            View demo
          </Link>
          {branding.supportEmail ? <span>{branding.supportEmail}</span> : null}
        </div>
      </div>
    </footer>
  );
}
