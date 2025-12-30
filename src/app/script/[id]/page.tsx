import { prisma } from "@/app/lib/db";
import Link from "next/link";
import Votes from "@/app/components/Votes";
import CommentList from "@/app/components/CommentList";
import CommentForm from "@/app/components/CommentForm";

export default async function ScriptDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await prisma.script.findUnique({ where: { id: Number(id) } });
  if (!row) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="text-sm text-zinc-500">Not found</div>
        <Link href="/browse" className="mt-4 inline-block rounded-md border px-3 py-2">
          Back to Browse
        </Link>
      </div>
    );
  }
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
  const votes = await prisma.vote.aggregate({ where: { scriptId: Number(id) }, _sum: { value: true } });
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{s.title}</h1>
        <span className="text-xs">{s.game}</span>
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{s.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {s.functionality.map((t: string) => (
          <span key={t} className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800">
            {t}
          </span>
        ))}
        {s.mobileFriendly && <span className="rounded bg-emerald-100 px-2 py-1 text-xs dark:bg-emerald-900">Mobile</span>}
        {s.keysystem && <span className="rounded bg-indigo-100 px-2 py-1 text-xs dark:bg-indigo-900">{s.keysystem}</span>}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="text-sm">Score: {votes._sum.value ?? 0}</div>
        <Votes scriptId={Number(id)} />
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className="h-10 rounded-md bg-black px-4 text-white dark:bg-white dark:text-black"
          onClick={async () => {
            await navigator.clipboard.writeText(s.code);
          }}
        >
          Copy Code
        </button>
        <Link href="/browse" className="h-10 rounded-md border px-4 py-2">
          Back
        </Link>
      </div>
      <div className="mt-6 rounded-lg border bg-zinc-50 p-4 dark:bg-zinc-900">
        <pre className="overflow-auto text-sm">
          <code>{s.code}</code>
        </pre>
      </div>
      <div className="mt-8">
        <CommentForm scriptId={Number(id)} />
        <CommentList scriptId={Number(id)} />
      </div>
    </div>
  );
}
