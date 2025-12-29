import Image from "next/image";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">ScriptHub</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Discover and share Roblox scripts.</p>
        </div>
        <Image className="dark:invert" src="/next.svg" alt="logo" width={80} height={16} priority />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a href="/browse" className="rounded-lg border p-6">
          <div className="text-xl font-semibold">Browse Library</div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Search by game, functionality, and compatibility.</div>
        </a>
        <a href="/upload" className="rounded-lg border p-6">
          <div className="text-xl font-semibold">Upload Script</div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Share your scripts with the community.</div>
        </a>
      </div>
    </div>
  );
}
