import { prisma } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

export default async function ModerationPage() {
  const user = await getCurrentUser();
  const adminCount = await prisma.user.count({ where: { role: "admin" } });
  if (!user || user.role !== "admin") {
    if (user && adminCount === 0) {
      async function makeAdmin() {
        "use server";
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/admin/bootstrap`, { method: "POST" });
      }
      return (
        <div className="mx-auto max-w-5xl p-6">
          <div className="text-sm">No admin exists. Promote current user.</div>
          <form action={makeAdmin}>
            <button className="mt-3 h-9 rounded-md bg-black px-4 text-white dark:bg-white dark:text-black">Promote me</button>
          </form>
        </div>
      );
    }
    return <div className="mx-auto max-w-5xl p-6 text-sm text-zinc-500">Unauthorized</div>;
  }
  const pending = await prisma.script.findMany({ where: { status: "pending" }, orderBy: { createdAt: "asc" } });
  async function act(id: number, action: "approve" | "reject") {
    "use server";
    if (action === "approve") await prisma.script.update({ where: { id }, data: { status: "approved" } });
    else await prisma.script.update({ where: { id }, data: { status: "rejected" } });
  }
  async function importAction(formData: FormData) {
    "use server";
    const limitPages = Number(formData.get("limitPages") || 1);
    const username = String(formData.get("username") || "");
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/import/rscripts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limitPages, username: username || undefined }),
    });
  }
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">Moderation</h1>
      <div className="mt-4 rounded-md border p-3">
        <form action={importAction} className="flex items-center gap-2">
          <input name="limitPages" placeholder="Pages" defaultValue="1" className="h-9 w-24 rounded-md border px-3" />
          <input name="username" placeholder="Username (optional)" className="h-9 rounded-md border px-3" />
          <button className="h-9 rounded-md bg-black px-4 text-white dark:bg-white dark:text-black">Import</button>
        </form>
      </div>
      <div className="mt-4 space-y-3">
        {pending.length === 0 && <div className="text-sm text-zinc-500">No pending items</div>}
        {pending.map((p: { id: number; title: string; game: string }) => (
          <div key={p.id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-zinc-500">{p.game}</div>
            </div>
            <div className="flex gap-2">
              <form action={async () => act(p.id, "approve")}>
                <button className="h-8 rounded-md bg-emerald-600 px-3 text-white">Approve</button>
              </form>
              <form action={async () => act(p.id, "reject")}>
                <button className="h-8 rounded-md bg-red-600 px-3 text-white">Reject</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
