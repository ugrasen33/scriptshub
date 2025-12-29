'use client';
export default function Votes({ scriptId }: { scriptId: number }) {
  async function act(value: number) {
    await fetch(`/api/scripts/${scriptId}/vote`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value }) });
    window.location.reload();
  }
  return (
    <div className="mt-4 flex items-center gap-2">
      <button className="h-8 rounded-md border px-3" onClick={() => act(1)}>
        Upvote
      </button>
      <button className="h-8 rounded-md border px-3" onClick={() => act(-1)}>
        Downvote
      </button>
    </div>
  );
}
