import { prisma } from "@/app/lib/db";

export default async function CommentList({ scriptId }: { scriptId: number }) {
  const list: Array<{ id: number; content: string; createdAt: Date; user: { username: string } }> = await prisma.comment.findMany({
    where: { scriptId },
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
  return (
    <div className="mt-4 space-y-3">
      {list.length === 0 && <div className="text-sm text-zinc-500">No comments yet</div>}
      {list.map((c) => (
        <div key={c.id} className="rounded-md border p-3">
          <div className="text-sm">{c.content}</div>
          <div className="text-xs text-zinc-500">{c.user.username}</div>
        </div>
      ))}
    </div>
  );
}
