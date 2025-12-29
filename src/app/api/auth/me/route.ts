import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(user ? { username: user.username, role: user.role, id: user.id } : null);
}
