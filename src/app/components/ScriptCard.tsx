import type { Script } from "@/app/lib/types";

export default function ScriptCard({ s }: { s: Script }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{s.title}</h3>
        <span className="text-xs">{s.game}</span>
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{s.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {s.functionality.map((t) => (
          <span key={t} className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800">
            {t}
          </span>
        ))}
        {s.mobileFriendly && <span className="rounded bg-emerald-100 px-2 py-1 text-xs dark:bg-emerald-900">Mobile</span>}
        {s.keysystem && <span className="rounded bg-indigo-100 px-2 py-1 text-xs dark:bg-indigo-900">{s.keysystem}</span>}
      </div>
      <div className="mt-4 flex gap-2">
        <a href={`/script/${s.id}`} className="h-9 rounded-md bg-black px-4 text-white dark:bg-white dark:text-black">View</a>
      </div>
    </div>
  );
}
