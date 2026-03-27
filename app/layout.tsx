import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { Providers } from "@/components/shared/providers";
import { getBrandingSettings } from "@/lib/branding";

import "./globals.css";

const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

export async function generateMetadata(): Promise<Metadata> {
  const branding = getBrandingSettings();
  return {
    title: `${branding.portalName} | Field Service SaaS Demo`,
    description:
      "A premium field service and job card management platform demo for dispatch, technicians, quotes, invoices, photos, signatures, and real-time updates.",
    manifest: "/manifest.webmanifest",
    themeColor: "#2563eb"
  };
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const branding = getBrandingSettings();
  const style = {
    "--brand": branding.accentHsl
  } as CSSProperties;

  return (
    <html lang="en" suppressHydrationWarning style={style}>
      <body className={`${fontSans.variable} ${fontDisplay.variable} min-h-screen font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
