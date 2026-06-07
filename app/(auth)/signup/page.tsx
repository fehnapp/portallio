import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-5 py-3.5">
        <Link href="/" className="text-xl font-bold text-emerald-600">portalio</Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-zinc-500">First portal free. No credit card required.</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-7" style={{boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
            <AuthForm mode="signup" />
          </div>
        </div>
      </div>
    </main>
  );
}
