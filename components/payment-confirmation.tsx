"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type Props = {
  paymobOrderId?: string;
  merchantOrderId?: string;
  success?: string;
  errorOccured?: string;
};

export function PaymentConfirmation({ paymobOrderId, merchantOrderId, success, errorOccured }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "done" | "error">("checking");

  useEffect(() => {
    let alive = true;

    async function confirm() {
      try {
        const currentUrl = typeof window !== "undefined" ? new URL(window.location.href) : null;
        const urlPaymobOrderId = currentUrl?.searchParams.get("id") || "";
        const urlMerchantOrderId = currentUrl?.searchParams.get("merchant_order_id") || "";

        const res = await fetch("/api/paymob/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymob_order_id: paymobOrderId || urlPaymobOrderId,
            merchant_order_id: merchantOrderId || urlMerchantOrderId,
            success,
            error_occured: errorOccured,
          }),
        });
        if (!alive) return;

        if (res.ok) {
          setStatus("done");
          router.replace("/dashboard?payment=success");
          router.refresh();
          return;
        }

        setStatus("error");
      } catch {
        if (alive) setStatus("error");
      }
    }

    confirm();

    return () => {
      alive = false;
    };
  }, [router, paymobOrderId, merchantOrderId, success, errorOccured]);

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="mx-auto max-w-md w-full">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          {status === "checking" && (
            <>
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-emerald-600" />
              <h1 className="text-2xl font-bold tracking-tight">Payment received</h1>
              <p className="mt-2 text-sm text-zinc-500">Turning on your paid access now.</p>
            </>
          )}

          {status === "done" && (
            <>
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
              <h1 className="text-2xl font-bold tracking-tight">Done</h1>
              <p className="mt-2 text-sm text-zinc-500">Your account is active. Sending you to the dashboard.</p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h1 className="text-2xl font-bold tracking-tight">Payment received</h1>
              <p className="mt-2 text-sm text-zinc-500">Payment went through, but the account did not flip active yet.</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
