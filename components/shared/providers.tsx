"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { PwaRegister } from "@/components/shared/pwa-register";
import { ThemeProvider } from "@/components/shared/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
      <PwaRegister />
      <Toaster richColors closeButton position="top-right" />
    </ThemeProvider>
  );
}
