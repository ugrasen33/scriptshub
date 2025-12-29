import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const value = Number(body.value);
  if (![1, -1].includes(value)) return NextResponse.json({ error: "Invalid value" }, { status: 400 });
  await prisma.vote.upsert({
    where: { userId_scriptId: { userId: user.id, scriptId: Number(ctx.params.id) } },
    update: { value },
    create: { userId: user.id, scriptId: Number(ctx.params.id), value },
  });
  const total = await prisma.vote.aggregate({ where: { scriptId: Number(ctx.params.id) }, _sum: { value: true } });
  return NextResponse.json({ total: total._sum.value ?? 0 });
}
