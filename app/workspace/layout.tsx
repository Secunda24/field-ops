import type { ReactNode } from "react";

import { FieldOpsWorkspaceShell } from "@/components/fieldops/workspace-shell";
import { getBrandingSettings } from "@/lib/branding";
import { requireFieldOpsViewer } from "@/lib/fieldops-auth";
import { getNotificationsForRole, getSearchItems } from "@/lib/fieldops-data";
import { getTechnicianBottomNav, getWorkspaceNav } from "@/lib/fieldops-navigation";

export default function WorkspaceLayout({
  children
}: {
  children: ReactNode;
}) {
  const viewer = requireFieldOpsViewer();

  return (
    <FieldOpsWorkspaceShell
      viewer={viewer}
      branding={getBrandingSettings()}
      navItems={getWorkspaceNav(viewer.profile.role)}
      mobileNavItems={getTechnicianBottomNav()}
      searchItems={getSearchItems(viewer.profile.role, viewer.technician?.id)}
      notifications={getNotificationsForRole(viewer.profile.role)}
    >
      {children}
    </FieldOpsWorkspaceShell>
  );
}
