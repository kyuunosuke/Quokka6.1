import { NextResponse } from "next/server";

export async function GET() {
  // Check if pre-configured admin credentials are set
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const preConfigured = !!(adminEmail && adminPassword);

  return NextResponse.json({ preConfigured });
}
