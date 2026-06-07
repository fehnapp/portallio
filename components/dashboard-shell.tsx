import Link from "next/link";
import { signOut } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/dashboard" className="text-xl font-bold text-emerald-600 hover:opacity-80 transition-opacity">
            portalio
          </Link>
          <nav className="flex items-center gap-1.5">
            <Button asChild variant="ghost" size="sm" className="text-zinc-500">
              <Link href="/pricing">Pricing</Link>
            </Button>
            <form action={signOut}>
              <Button variant="outline" size="sm">Sign out</Button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8 md:py-10">{children}</div>
    </main>
  );
}
