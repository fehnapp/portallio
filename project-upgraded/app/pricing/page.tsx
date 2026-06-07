import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import { createCheckoutSession } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default function PricingPage({
  searchParams
}: {
  searchParams: { limit?: string };
}) {
  return (
    <main className="min-h-screen bg-[#f8f8f7] px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/dashboard" className="font-display text-xl italic text-emerald-700">
            portalio
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-dialog">
          {searchParams.limit ? (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              You've used your free portal. Upgrade to create unlimited portals.
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/50">
              One plan
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Portalio Pro</h1>
          <p className="mt-2 text-[0.9375rem] text-zinc-500 leading-relaxed">
            Unlimited client portals with files, invoices, project status, and chat.
          </p>

          <div className="mt-6 flex items-end gap-2">
            <span className="text-5xl font-semibold tracking-tight">$29</span>
            <span className="pb-2 text-sm text-zinc-400">/month</span>
          </div>

          <ul className="mt-6 space-y-2.5">
            {[
              "Unlimited portals",
              "Public client links",
              "File sharing & storage",
              "Email notifications",
              "InstaPay & Vodafone Cash support",
              "No client account required"
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-700">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200/60 shrink-0">
                  <Check className="h-3 w-3 text-emerald-700" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <form action={createCheckoutSession} className="mt-8">
            <Button className="w-full rounded-xl shadow-md shadow-emerald-900/10" size="lg">
              Start subscription
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-zinc-400">
            Cancel any time. No long-term commitment.
          </p>
        </div>
      </div>
    </main>
  );
}
