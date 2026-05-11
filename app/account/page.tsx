import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Account</p>
        <h1 className="mt-3 text-3xl font-black">{user.email}</h1>
        <div className="mt-6 grid gap-4 text-sm text-slate-300">
          <p>User ID: <span className="font-mono text-slate-100">{user.id}</span></p>
          <p>Role: <span className="font-bold text-slate-100">{profile?.role || "user"}</span></p>
          <p>JWT auth: <span className="font-bold text-cyan-200">Active via Supabase session cookies</span></p>
        </div>
        <form action="/auth/signout" method="post" className="mt-8">
          <button className="rounded-full bg-white px-5 py-3 font-bold text-slate-950">Sign out</button>
        </form>
      </div>
    </main>
  );
}
