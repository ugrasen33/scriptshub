import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admins = await prisma.user.count({ where: { role: "admin" } });
  if (admins > 0) return NextResponse.json({ error: "Admin exists" }, { status: 400 });
  await prisma.user.update({ where: { id: me.id }, data: { role: "admin" } });
  return NextResponse.json({ ok: true });
}
