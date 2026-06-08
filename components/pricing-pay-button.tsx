"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingPayButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setLoading(true);
    setError("");
    try {
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
    <>
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <Button className="mt-6 w-full" size="lg" onClick={handlePay} disabled={loading}>
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
        ) : (
          <><CreditCard className="h-4 w-4" /> Pay $29 — Lifetime Access</>
        )}
      </Button>
    </>
  );
}
