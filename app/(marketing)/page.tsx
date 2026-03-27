import Link from "next/link";
import { ArrowRight, BadgeCheck, Bolt, BriefcaseBusiness, FileSignature, Smartphone, Truck, Users } from "lucide-react";

import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fieldOpsFaqs,
  fieldOpsLandingFeatures,
  fieldOpsShowcaseCards,
  fieldOpsTestimonials,
  fieldOpsUseCases
} from "@/lib/fieldops-data";

export default function MarketingHomePage() {
  return (
    <main>
      <section className="container py-12 sm:py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <FadeIn className="space-y-8">
            <span className="eyebrow">Mobile-first field service platform</span>
            <div className="space-y-5">
              <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Run Your Field Team From One Smart Mobile System
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Dispatch jobs, track technicians, capture photos and signatures, update work in real time, and move from quote to invoice without losing office-to-field visibility.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-12 rounded-full px-6">
                <Link href="/login">
                  View Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-6">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["60 live jobs", "Seeded operational data"],
                ["8 technicians", "Realistic dispatch coverage"],
                ["Quotes to invoices", "Commercial flow included"]
              ].map(([title, detail]) => (
                <div key={title} className="rounded-3xl border border-border/70 bg-background/60 p-5">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative rounded-[2rem] border border-white/50 bg-white/80 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
              <div className="absolute -left-6 -top-6 hidden rounded-3xl border border-border/70 bg-background/90 p-4 shadow-xl lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Dispatch live</p>
                <p className="mt-2 text-2xl font-semibold">14 field updates</p>
                <p className="text-sm text-muted-foreground">Last sync 18 seconds ago</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <Card className="overflow-hidden">
                  <CardHeader className="border-b border-border/70 bg-background/70">
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-brand" />
                      Technician mobile dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-5">
                    <div className="rounded-3xl bg-brand p-4 text-brand-foreground">
                      <p className="text-xs uppercase tracking-[0.2em] text-brand-foreground/80">Next stop</p>
                      <p className="mt-2 text-2xl font-semibold">Northline Business Park</p>
                      <p className="text-sm text-brand-foreground/80">Repair • Urgent • ETA 18 min</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        ["Today’s jobs", "5"],
                        ["Checked in", "2"],
                        ["In progress", "3"],
                        ["Completed", "9"]
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-3xl border border-border/70 bg-background/60 p-4">
                          <p className="text-sm text-muted-foreground">{label}</p>
                          <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="space-y-2">
                      <CardTitle className="text-base">Job card actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      {[
                        ["Start travel", TruckIcon],
                        ["Upload photos", CameraIcon],
                        ["Capture signature", SignatureIcon],
                        ["Complete job", CheckIcon]
                      ].map(([label, Icon]) => (
                        <div key={label} className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-brand" />
                            <span className="text-sm font-medium">{label}</span>
                          </div>
                          <BadgeCheck className="h-4 w-4 text-emerald-500" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="space-y-2">
                      <CardTitle className="text-base">Office overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        ["Jobs today", "18"],
                        ["Overdue", "10"],
                        ["Pending quotes", "6"],
                        ["Invoices raised", "22"]
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3">
                          <span className="text-sm text-muted-foreground">{label}</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="platform" className="container py-12 sm:py-16">
        <FadeIn className="space-y-4 text-center">
          <span className="eyebrow">Platform highlights</span>
          <h2 className="section-title">The standout screens built to sell the product</h2>
          <p className="mx-auto max-w-3xl text-muted-foreground">
            These are the surfaces prospects notice immediately in screenshots, walkthroughs, and live demos.
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {fieldOpsShowcaseCards.map((card, index) => (
            <FadeIn key={card.title} delay={index * 0.05}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{card.subtitle}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="mobile" className="container py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-brand" />
                Mobile-first technician experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Bottom navigation for fast thumb reach",
                "Sticky action buttons for check-in and completion",
                "Touch-friendly cards, forms, uploads, and signature capture",
                "Offline-ready sync indicators and install prompt support"
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-3xl border border-border/70 bg-background/60 p-4">
                  <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5 text-brand" />
                Office control center
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {fieldOpsLandingFeatures.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-border/70 bg-background/60 p-4">
                  <p className="font-semibold">{feature.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="industries" className="container py-12 sm:py-16">
        <div className="rounded-[2rem] border border-border/70 bg-background/70 p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="eyebrow">Target industries</span>
              <h2 className="section-title">A believable fit for real service businesses</h2>
            </div>
            <p className="max-w-2xl text-muted-foreground">
              Built to demo well for electricians, plumbers, security installers, maintenance teams, cleaning companies, HVAC contractors, repair crews, and inspection businesses.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {fieldOpsUseCases.map((item, index) => (
              <FadeIn key={item} delay={index * 0.05}>
                <div className="flex items-center gap-3 rounded-3xl border border-border/70 bg-card px-5 py-4">
                  <Users className="h-5 w-5 text-brand" />
                  <span className="font-medium">{item}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-12 sm:py-16">
        <div className="grid gap-4 lg:grid-cols-3">
          {fieldOpsTestimonials.map((item, index) => (
            <FadeIn key={item.name} delay={index * 0.05}>
              <Card className="h-full">
                <CardContent className="space-y-4 p-6">
                  <p className="text-base leading-7 text-muted-foreground">"{item.quote}"</p>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="faq" className="container py-12 sm:py-16">
        <FadeIn className="space-y-4">
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title">Questions teams ask before they buy</h2>
        </FadeIn>
        <div className="mt-8 grid gap-4">
          {fieldOpsFaqs.map((item, index) => (
            <FadeIn key={item.question} delay={index * 0.04}>
              <Card>
                <CardContent className="space-y-3 p-6">
                  <p className="font-semibold">{item.question}</p>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
    </main>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return <Truck className={className} />;
}

function CameraIcon({ className }: { className?: string }) {
  return <Bolt className={className} />;
}

function SignatureIcon({ className }: { className?: string }) {
  return <FileSignature className={className} />;
}

function CheckIcon({ className }: { className?: string }) {
  return <BadgeCheck className={className} />;
}
