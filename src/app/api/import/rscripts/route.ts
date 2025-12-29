import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";

async function fetchPage(page: number, username?: string) {
  const url = `https://rscripts.net/api/v2/scripts?page=${page}&orderBy=date&sort=desc`;
  const res = await fetch(url, {
    headers: username ? { Username: username } : undefined,
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error("fetch failed");
  return res.json();
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const limitPages = Number(body.limitPages ?? 3);
  const username = body.username as string | undefined;
  let imported = 0;
  let maxPages = limitPages;
  for (let page = 1; page <= limitPages; page++) {
    try {
      const data = await fetchPage(page, username);
      if (page === 1 && typeof data?.info?.maxPages === "number") {
        maxPages = Math.min(data.info.maxPages, limitPages);
      }
      const scripts = data?.scripts ?? [];
      for (const it of scripts) {
        await prisma.script.upsert({
          where: { externalId: String(it._id) },
          update: {
            title: it.title ?? "",
            game: it.game?.title ?? it.game ?? "",
            description: it.desc ?? it.description ?? "",
            code: "",
            functionalityCsv: Array.isArray(it.tags) ? it.tags.join(",") : "",
            mobileFriendly: !!it.mobile,
            keysystem: it.key?.name ?? it.keysystem ?? "",
            imageUrl: it.image ?? null,
            rawScriptUrl: it.rawScript ?? null,
            creatorName: it.user?.username ?? null,
            status: "approved",
          },
          create: {
            externalId: String(it._id),
            title: it.title ?? "",
            game: it.game?.title ?? it.game ?? "",
            description: it.desc ?? it.description ?? "",
            code: "",
            functionalityCsv: Array.isArray(it.tags) ? it.tags.join(",") : "",
            mobileFriendly: !!it.mobile,
            keysystem: it.key?.name ?? it.keysystem ?? "",
            imageUrl: it.image ?? null,
            rawScriptUrl: it.rawScript ?? null,
            creatorName: it.user?.username ?? null,
            status: "approved",
          },
        });
        imported++;
      }
    } catch {
      break;
    }
  }
  return NextResponse.json({ imported, pages: maxPages });
}
