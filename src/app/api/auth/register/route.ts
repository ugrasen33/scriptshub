import { NextResponse } from "next/server";
import { createUser, login } from "@/app/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.username || !body.password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  try {
    await createUser(body.username, body.password);
    await login(body.username, body.password);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "User exists" }, { status: 400 });
  }
}
