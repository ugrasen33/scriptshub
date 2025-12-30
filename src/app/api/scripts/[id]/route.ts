import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function GET(_: Request, ctx: unknown) {
  const { params } = ctx as { params: { id: string } };
  const row = await prisma.script.findUnique({ where: { id: Number(params.id) } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const s = {
    id: String(row.id),
    title: row.title,
    game: row.game,
    description: row.description,
    code: row.code,
    functionality: row.functionalityCsv ? row.functionalityCsv.split(",").filter(Boolean) : [],
    mobileFriendly: row.mobileFriendly,
    keysystem: row.keysystem,
    createdAt: row.createdAt.toISOString(),
  };
  return NextResponse.json(s);
}
