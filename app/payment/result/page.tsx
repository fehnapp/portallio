import Link from "next/link";
import { XCircle } from "lucide-react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { activatePaidAccess } from "@/lib/subscription";

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: { success?: string; error_occured?: string; "data.message"?: string; merchant_order_id?: string };
}) {
  const success = searchParams.success === "true" && searchParams.error_occured !== "true";

  if (success) {
    // Try session first
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (userData?.user) {
      const { error } = await activatePaidAccess(userData.user.id, userData.user.email ?? undefined);
      if (!error) redirect("/dashboard?payment=success");
    }

    const pendingUserId = cookies().get("portalio_pending_payment_user")?.value;
    if (pendingUserId && pendingUserId.length > 10) {
      const { error } = await activatePaidAccess(pendingUserId);
      if (!error) redirect("/dashboard?payment=success");
    }

    // Fallback: use merchant_order_id from URL (format: userId|timestamp)
    const merchantOrderId = searchParams.merchant_order_id || "";
    const userId = merchantOrderId.split("|")[0];
    if (userId && userId.length > 10) {
      const { error } = await activatePaidAccess(userId);
      if (!error) redirect("/dashboard?payment=success");
    }

    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="mx-auto max-w-md w-full">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <h1 className="text-2xl font-bold tracking-tight">Payment received</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Your payment went through. We are still turning on your paid access. Wait a minute, then refresh dashboard.
            </p>
            <Link href="/dashboard" className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
              Go to dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const errorMessage = searchParams["data.message"] || "Your payment was not completed.";

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="mx-auto max-w-md w-full">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold tracking-tight">Payment Failed</h1>
          <p className="mt-2 text-sm text-zinc-500 capitalize">{errorMessage.toLowerCase()}</p>
          <p className="mt-4 text-sm text-zinc-400">
            Please try again with a different card, or contact your bank if the issue persists.
          </p>
          <Link href="/pricing" className="mt-6 flex items-center justify-center w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
            Try Again
          </Link>
          <Link href="/dashboard" className="mt-3 inline-block text-sm text-zinc-400 hover:text-zinc-600">
            Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
