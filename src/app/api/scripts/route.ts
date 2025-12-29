import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth";
import { Script } from "@/app/lib/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const includeAll = url.searchParams.get("all") === "1";
  const where = includeAll ? {} : { status: "approved" as const };
  const rows = await prisma.script.findMany({ where, orderBy: { createdAt: "desc" } });
  if (rows.length === 0) {
    await prisma.script.create({
      data: {
        title: "Universal Autofarm",
        game: "Blox Fruits",
        description: "Fast leveling with safe routes and boss cycles.",
        code: "-- Lua autofarm example\nprint(\"Autofarm running\")",
        functionalityCsv: ["autofarm", "combat"].join(","),
        mobileFriendly: true,
        keysystem: "linkvertise",
      },
    });
    await prisma.script.create({
      data: {
        title: "ESP and Teleport",
        game: "Arsenal",
        description: "Visual overlays and quick teleports to objectives.",
        code: "-- Lua ESP example\nprint(\"ESP active\")",
        functionalityCsv: ["esp", "teleport"].join(","),
        mobileFriendly: false,
        keysystem: "none",
      },
    });
  }
  const all: Array<{
    id: number;
    title: string;
    game: string;
    description: string;
    code: string;
    functionalityCsv: string | null;
    mobileFriendly: boolean;
    keysystem: string;
    createdAt: Date;
  }> = await prisma.script.findMany({ where, orderBy: { createdAt: "desc" } });
  const mapped = all.map((r) => ({
    id: String(r.id),
    title: r.title,
    game: r.game,
    description: r.description,
    code: r.code,
    functionality: r.functionalityCsv ? r.functionalityCsv.split(",").filter(Boolean) : [],
    mobileFriendly: r.mobileFriendly,
    keysystem: r.keysystem,
    createdAt: r.createdAt.toISOString(),
  }));
  return NextResponse.json(mapped);
}

export async function POST(req: Request) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await req.json()) as Partial<Script>;
    if (!body.title || !body.game || !body.description || !body.code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const createdRow = await prisma.script.create({
      data: {
        title: body.title!,
        game: body.game!,
        description: body.description!,
        code: body.code!,
        functionalityCsv: (body.functionality ?? []).join(","),
        keysystem: body.keysystem ?? "",
        mobileFriendly: !!body.mobileFriendly,
        status: "pending",
        userId: me.id,
      },
    });
    const created = {
      id: String(createdRow.id),
      title: createdRow.title,
      game: createdRow.game,
      description: createdRow.description,
      code: createdRow.code,
      functionality: createdRow.functionalityCsv ? createdRow.functionalityCsv.split(",").filter(Boolean) : [],
      mobileFriendly: createdRow.mobileFriendly,
      keysystem: createdRow.keysystem,
      createdAt: createdRow.createdAt.toISOString(),
    };
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
