import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import {
  fieldOpsCompany,
  getFieldOpsDefaultProfile,
  getFieldOpsProfileByEmail,
  getFieldOpsProfileById,
  getFieldOpsTechnicianByProfileId,
  type FieldOpsProfile,
  type FieldOpsRole
} from "@/lib/fieldops-data";

export const fieldOpsAuthCookieName = "fieldops-session";

export interface FieldOpsSession {
  profileId: string;
  role: FieldOpsRole;
}

export interface FieldOpsViewer {
  session: FieldOpsSession;
  profile: FieldOpsProfile;
  company: typeof fieldOpsCompany;
  technician: ReturnType<typeof getFieldOpsTechnicianByProfileId>;
}

export function createFieldOpsSessionValue(profile: FieldOpsProfile) {
  return JSON.stringify({
    profileId: profile.id,
    role: profile.role
  } satisfies FieldOpsSession);
}

export function parseFieldOpsSessionValue(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as FieldOpsSession;

    if (!parsed.profileId || !parsed.role) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getFieldOpsSessionFromRequest(request: NextRequest) {
  return parseFieldOpsSessionValue(request.cookies.get(fieldOpsAuthCookieName)?.value);
}

export function getFieldOpsViewer() {
  const cookieStore = cookies();
  const session = parseFieldOpsSessionValue(cookieStore.get(fieldOpsAuthCookieName)?.value);

  if (!session) {
    return null;
  }

  const profile = getFieldOpsProfileById(session.profileId);

  if (!profile) {
    return null;
  }

  return {
    session,
    profile,
    company: fieldOpsCompany,
    technician: getFieldOpsTechnicianByProfileId(profile.id)
  } satisfies FieldOpsViewer;
}

export function requireFieldOpsViewer() {
  const viewer = getFieldOpsViewer();

  if (!viewer) {
    redirect("/login");
  }

  return viewer;
}

export function requireFieldOpsRoles(roles: FieldOpsRole[]) {
  const viewer = requireFieldOpsViewer();

  if (!roles.includes(viewer.profile.role)) {
    redirect("/workspace");
  }

  return viewer;
}

export function getFieldOpsHome() {
  return "/workspace";
}

export function getFieldOpsDemoProfile(role: FieldOpsRole) {
  return getFieldOpsDefaultProfile(role);
}

export function getFieldOpsProfileForLogin(email: string) {
  return getFieldOpsProfileByEmail(email);
}
