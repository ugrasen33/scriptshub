'use client';
export default function LoginPage() {
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: fd.get("username"), password: fd.get("password") }),
    });
    if (res.ok) window.location.href = "/browse";
    else alert("Login failed");
  }
  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form className="mt-6 flex flex-col gap-4" onSubmit={submit}>
        <input name="username" placeholder="Username" className="h-10 rounded-md border px-3" />
        <input name="password" placeholder="Password" type="password" className="h-10 rounded-md border px-3" />
        <button type="submit" className="h-10 rounded-md bg-black px-4 text-white dark:bg-white dark:text-black">
          Login
        </button>
        <a href="/register" className="text-sm underline">
          Create account
        </a>
      </form>
    </div>
  );
}
