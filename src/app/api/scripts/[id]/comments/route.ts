import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const list: Array<{ id: number; content: string; createdAt: Date; user: { username: string } }> = await prisma.comment.findMany({
    where: { scriptId: Number(ctx.params.id) },
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
  return NextResponse.json(
    list.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
      author: c.user.username,
    }))
  );
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.content) return NextResponse.json({ error: "Missing content" }, { status: 400 });
  const c = await prisma.comment.create({
    data: { content: body.content, scriptId: Number(ctx.params.id), userId: user.id },
    include: { user: true },
  });
  return NextResponse.json({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    author: c.user.username,
  });
}
