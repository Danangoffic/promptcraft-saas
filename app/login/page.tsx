import Link from "next/link";
import { login } from "@/app/auth/actions";

export default function LoginPage({ searchParams }: { searchParams?: { error?: string; message?: string } }) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-black">Login</h1>
        <p className="mt-2 text-sm text-slate-300">Masuk untuk mengakses dashboard PromptCraft.</p>

        {searchParams?.error && <p className="mt-4 rounded-2xl bg-red-500/10 p-3 text-sm text-red-200">Email, password, atau OAuth tidak valid.</p>}
        {searchParams?.message && <p className="mt-4 rounded-2xl bg-cyan-500/10 p-3 text-sm text-cyan-200">Silakan cek email untuk konfirmasi akun.</p>}

        <a href="/auth/google?next=/dashboard" className="mt-6 flex w-full items-center justify-center rounded-full bg-white px-5 py-3 font-bold text-slate-950">
          Continue with Google
        </a>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form className="space-y-4" action={login}>
          <div>
            <label className="text-sm font-medium text-slate-200" htmlFor="email">Email</label>
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" id="email" name="email" type="email" required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-200" htmlFor="password">Password</label>
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" id="password" name="password" type="password" minLength={6} required />
          </div>
          <button className="w-full rounded-full bg-cyan-300 px-5 py-3 font-bold text-slate-950">Login</button>
        </form>

        <p className="mt-6 text-sm text-slate-300">Belum punya akun? <Link className="font-bold text-cyan-200" href="/register">Daftar</Link></p>
      </div>
    </main>
  );
}
