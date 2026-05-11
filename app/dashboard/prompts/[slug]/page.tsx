import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PromptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: prompt } = await supabase
    .from("prompts")
    .select("*, prompt_categories(name), prompt_variations(title,content,notes)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!prompt) notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase text-cyan-200">{prompt.access_level}</span>
      <h1 className="mt-5 text-4xl font-black">{prompt.title}</h1>
      <p className="mt-3 text-slate-300">{prompt.excerpt}</p>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-bold">Prompt</h2>
        <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-200">{prompt.content}</pre>
      </section>

      {prompt.negative_prompt && (
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold">Negative Prompt</h2>
          <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-200">{prompt.negative_prompt}</pre>
        </section>
      )}

      {prompt.awareness_lesson && (
        <section className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-6">
          <h2 className="text-xl font-bold">Prompt Awareness</h2>
          <p className="mt-3 text-slate-200">{prompt.awareness_lesson}</p>
        </section>
      )}
    </main>
  );
}
