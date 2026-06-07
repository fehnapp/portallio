"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage({ searchParams }: { searchParams: { limit?: string } }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setLoading(true);
    setError("");
    try {
      // Fixed: was "/api/paymob/checkout" which didn't exist — now points to the correct route
      const res = await fetch("/api/paymob/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Payment failed. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (e: any) {
      setError("Something went wrong: " + e.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-600">portalio</span>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          {searchParams.limit && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              You've used your free portal. Upgrade to create unlimited portals.
            </div>
          )}

          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">One plan</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Portalio Pro</h1>
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
            Unlimited client portals with files, invoices, project status, and chat.
          </p>

          <div className="mt-6 flex items-end gap-2">
            <span className="text-5xl font-bold tracking-tight">$29</span>
            <span className="pb-2 text-sm text-zinc-400">/month</span>
          </div>

          <ul className="mt-6 space-y-2.5">
            {[
              "Unlimited portals",
              "File sharing & storage",
              "Invoice + payment link",
              "Client chat with email alerts",
              "Project status updates",
              "No client account required",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-700">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 shrink-0">
                  <Check className="h-3 w-3 text-emerald-700" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
            <p className="mb-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Accepted payment methods</p>
            <div className="flex flex-wrap gap-2">
              {["Visa", "Mastercard", "Apple Pay", "Meeza"].map((m) => (
                <span key={m} className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700">
                  <CreditCard className="h-3 w-3 text-zinc-400" />
                  {m}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-zinc-400">Secure payment powered by Paymob · EGP</p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button className="mt-6 w-full" size="lg" onClick={handlePay} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing…
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" /> Pay with card
              </>
            )}
          </Button>

          <p className="mt-4 text-center text-xs text-zinc-400">Cancel any time. No long-term commitment.</p>
        </div>
      </div>
    </main>
  );
}
