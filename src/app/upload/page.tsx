'use client';
export default function UploadPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Upload Script</h1>
      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget as HTMLFormElement);
          const payload = {
            title: String(fd.get("title") || ""),
            game: String(fd.get("game") || ""),
            functionality: String(fd.get("functionality") || "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
            keysystem: String(fd.get("keysystem") || ""),
            mobileFriendly: fd.get("mobile") === "on",
            description: String(fd.get("description") || ""),
            code: String(fd.get("code") || ""),
          };
          const res = await fetch("/api/scripts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const created = await res.json();
            window.location.href = `/script/${created.id}`;
          } else {
            alert("Upload failed");
          }
        }}
      >
        <input name="title" placeholder="Title" className="h-10 rounded-md border px-3" />
        <input name="game" placeholder="Game" className="h-10 rounded-md border px-3" />
        <input name="functionality" placeholder="Functionality tags comma-separated" className="h-10 rounded-md border px-3" />
        <select name="keysystem" className="h-10 rounded-md border px-3">
          <option value="">Keysystem</option>
          <option value="none">None</option>
          <option value="linkvertise">Linkvertise</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input name="mobile" type="checkbox" />
          Mobile-friendly
        </label>
        <textarea name="description" placeholder="Description" className="h-24 rounded-md border px-3 py-2" />
        <textarea name="code" placeholder="Code" className="h-40 rounded-md border px-3 py-2 font-mono" />
        <button type="submit" className="h-10 rounded-md bg-black px-4 text-white dark:bg-white dark:text-black">
          Submit
        </button>
      </form>
    </div>
  );
}
