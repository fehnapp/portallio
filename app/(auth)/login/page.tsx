import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f8f8f7]">
      <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md px-5 py-3.5">
        <Link href="/" className="font-display text-xl italic text-emerald-700">
          portalio
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-zinc-500">Sign in to manage your client portals</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-dialog">
            <AuthForm mode="login" />
          </div>
        </div>
      </div>
    </main>
  );
}
