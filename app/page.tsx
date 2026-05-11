import Link from "next/link";

const features = [
  "Prompt library untuk Free, Premium, dan Enthusiast",
  "Grok-powered draft generation untuk prompt harian atau mingguan",
  "Prompt awareness, breakdown, variasi, dan evaluation score",
  "Midtrans-ready billing flow untuk subscription"
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Prompt Engineering SaaS</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Premium prompt library yang terus tumbuh otomatis.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            PromptCraft membantu kreator belajar, mengevaluasi, dan memakai prompt berkualitas untuk image generation, social media, AI video, dan workflow konten.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full bg-cyan-300 px-5 py-3 font-bold text-slate-950">Masuk Dashboard</Link>
            <Link href="/pricing" className="rounded-full border border-white/20 px-5 py-3 font-bold text-white">Lihat Paket</Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <p className="text-sm text-cyan-200">Prompt of the week</p>
          <h2 className="mt-3 text-2xl font-bold">Cinematic Product Photography</h2>
          <p className="mt-4 text-slate-300">Create a cinematic product photo with dramatic softbox lighting, premium material detail, clean composition, and high-end advertising mood.</p>
          <div className="mt-6 rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
            Awareness: prompt yang stabil biasanya menyebut subject, lighting, camera angle, material detail, dan negative prompt.
          </div>
        </div>
      </section>
      <section className="mt-20 grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">{feature}</div>
        ))}
      </section>
    </main>
  );
}
