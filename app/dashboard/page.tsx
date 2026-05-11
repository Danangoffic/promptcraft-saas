import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptionStatus } from "@/lib/subscription";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { isPremium } = await getSubscriptionStatus();
  const { data: prompts } = await supabase
    .from("prompts")
    .select("id,title,slug,excerpt,access_level,model_target,awareness_lesson,prompt_categories(name)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Dashboard</p>
          <h1 className="mt-3 text-4xl font-black">Prompt library</h1>
          <p className="mt-2 text-slate-300">Status akun: {isPremium ? "Premium aktif" : "Free"}</p>
        </div>
        {!isPremium && <Link href="/pricing" className="rounded-full bg-cyan-300 px-4 py-2 font-bold text-slate-950">Upgrade</Link>}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {(prompts || []).map((prompt) => (
          <Link key={prompt.id} href={`/dashboard/prompts/${prompt.slug}`} className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase text-cyan-200">{prompt.access_level}</span>
              <span className="text-xs text-slate-400">{prompt.model_target}</span>
            </div>
            <h2 className="text-xl font-bold">{prompt.title}</h2>
            <p className="mt-3 text-sm text-slate-300">{prompt.excerpt}</p>
            {prompt.awareness_lesson && <p className="mt-4 text-xs text-slate-400">Awareness: {prompt.awareness_lesson}</p>}
          </Link>
        ))}
      </div>
    </main>
  );
}
