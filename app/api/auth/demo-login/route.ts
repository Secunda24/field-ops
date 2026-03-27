import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createFieldOpsSessionValue,
  fieldOpsAuthCookieName,
  getFieldOpsDemoProfile,
  getFieldOpsHome
} from "@/lib/fieldops-auth";
import { getSessionCookieOptions } from "@/lib/cookie-options";

const schema = z.object({
  role: z.enum(["admin", "dispatcher", "technician", "manager"])
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid demo role." }, { status: 400 });
  }

  const profile = getFieldOpsDemoProfile(parsed.data.role);
  const response = NextResponse.json({
    redirectTo: getFieldOpsHome()
  });

  response.cookies.set(
    fieldOpsAuthCookieName,
    createFieldOpsSessionValue(profile),
    getSessionCookieOptions()
  );

  return response;
}
