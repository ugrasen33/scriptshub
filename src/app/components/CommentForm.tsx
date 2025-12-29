'use client';
export default function CommentForm({ scriptId }: { scriptId: number }) {
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/scripts/${scriptId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: fd.get("content") }),
    });
    if (res.ok) window.location.reload();
    else alert("Failed to comment");
  }
  return (
    <form className="flex items-center gap-2" onSubmit={submit}>
      <input name="content" placeholder="Add a comment" className="h-9 flex-1 rounded-md border px-3" />
      <button type="submit" className="h-9 rounded-md bg-black px-4 text-white dark:bg-white dark:text-black">
        Post
      </button>
    </form>
  );
}
