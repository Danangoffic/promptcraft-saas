import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("plans")
    .select("id,name,slug,price,interval,description,features")
    .eq("is_active", true)
    .order("price", { ascending: true });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-black">Pilih paket PromptCraft</h1>
      <p className="mt-3 max-w-2xl text-slate-300">Free untuk mulai belajar, Premium untuk konten advanced, Enthusiast untuk prompt system dan eksperimen mendalam.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {(plans || []).map((plan) => (
          <div key={plan.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">{plan.name}</h2>
            <p className="mt-2 text-slate-300">{plan.description}</p>
            <p className="mt-6 text-3xl font-black">Rp{Number(plan.price).toLocaleString("id-ID")}</p>
            <p className="text-sm text-slate-400">/{plan.interval}</p>
            <ul className="mt-6 space-y-2 text-sm text-slate-300">
              {(Array.isArray(plan.features) ? plan.features : []).map((feature: string) => <li key={feature}>• {feature}</li>)}
            </ul>
            {plan.price === 0 ? (
              <Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-white px-4 py-2 font-bold text-slate-950">Mulai Gratis</Link>
            ) : (
              <form action="/api/midtrans/create-transaction" method="post" className="mt-6">
                <input type="hidden" name="planId" value={plan.id} />
                <button className="rounded-full bg-cyan-300 px-4 py-2 font-bold text-slate-950">Upgrade</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
