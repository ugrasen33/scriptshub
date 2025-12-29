import { cookies } from "next/headers";
import { prisma } from "./db";
import crypto from "crypto";

export async function getCurrentUser() {
  const c = await cookies();
  const cookie = c.get("session")?.value;
  if (!cookie) return null;
  const session = await prisma.session.findUnique({ where: { token: cookie }, include: { user: true } });
  return session?.user ?? null;
}

export async function createUser(username: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) throw new Error("exists");
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const user = await prisma.user.create({ data: { username, password: hash } });
  return user;
}

export async function login(username: string, password: string) {
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.password !== hash) throw new Error("invalid");
  const token = crypto.randomBytes(24).toString("hex");
  await prisma.session.create({ data: { token, userId: user.id } });
  const c = await cookies();
  c.set("session", token, { httpOnly: true, sameSite: "lax", path: "/" });
  return user;
}

export async function logout() {
  const c = await cookies();
  const token = c.get("session")?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
    c.set("session", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  }
}
