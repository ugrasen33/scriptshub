import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : body.scripts ?? [];
    let created = 0;
    for (const it of items) {
      if (!it.title || !it.game) continue;
      await prisma.script.upsert({
        where: { externalId: String(it._id ?? it.id ?? `${it.title}-${it.game}`) },
        update: {
          title: it.title,
          game: it.game,
          description: it.description ?? it.desc ?? "",
          code: it.code ?? "",
          functionalityCsv: (it.tags ?? []).join(","),
          mobileFriendly: !!it.mobileFriendly,
          keysystem: it.keysystem ?? "",
          imageUrl: it.image ?? it.imageUrl ?? null,
          rawScriptUrl: it.rawScript ?? it.rawScriptUrl ?? null,
          creatorName: it.user?.username ?? it.creator ?? null,
          status: "approved",
        },
        create: {
          externalId: String(it._id ?? it.id ?? `${it.title}-${it.game}`),
          title: it.title,
          game: it.game,
          description: it.description ?? it.desc ?? "",
          code: it.code ?? "",
          functionalityCsv: (it.tags ?? []).join(","),
          mobileFriendly: !!it.mobileFriendly,
          keysystem: it.keysystem ?? "",
          imageUrl: it.image ?? it.imageUrl ?? null,
          rawScriptUrl: it.rawScript ?? it.rawScriptUrl ?? null,
          creatorName: it.user?.username ?? it.creator ?? null,
          status: "approved",
        },
      });
      created++;
    }
    return NextResponse.json({ imported: created });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
