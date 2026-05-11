import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PromptCraft SaaS",
  description: "Prompt engineering subscription platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <header className="border-b border-white/10 bg-slate-950">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-bold">PromptCraft</Link>
            <div className="flex gap-4 text-sm text-slate-300">
              <Link href="/pricing">Pricing</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
