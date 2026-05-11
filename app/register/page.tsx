import Link from "next/link";
import { signup } from "@/app/auth/actions";

export default function RegisterPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-black">Daftar</h1>
        <p className="mt-2 text-sm text-slate-300">Buat akun Free untuk mulai mengakses prompt gratis.</p>

        {searchParams?.error && <p className="mt-4 rounded-2xl bg-red-500/10 p-3 text-sm text-red-200">Registrasi gagal. Cek email dan password.</p>}

        <form className="mt-6 space-y-4" action={signup}>
          <div>
            <label className="text-sm font-medium text-slate-200" htmlFor="email">Email</label>
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" id="email" name="email" type="email" required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-200" htmlFor="password">Password</label>
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" id="password" name="password" type="password" minLength={6} required />
          </div>
          <button className="w-full rounded-full bg-cyan-300 px-5 py-3 font-bold text-slate-950">Buat Akun</button>
        </form>

        <p className="mt-6 text-sm text-slate-300">Sudah punya akun? <Link className="font-bold text-cyan-200" href="/login">Login</Link></p>
      </div>
    </main>
  );
}
