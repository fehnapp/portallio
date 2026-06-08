import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: { success?: string; error_occured?: string; "data.message"?: string };
}) {
  const success = searchParams.success === "true" && searchParams.error_occured !== "true";

  // If success, mark subscription active
  if (success) {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      await supabase
        .from("users")
        .update({ subscription_status: "active" })
        .eq("id", userData.user.id);
    }
    redirect("/dashboard");
  }

  const errorMessage = searchParams["data.message"] || "Your payment was not completed.";

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="mx-auto max-w-md w-full">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold tracking-tight">Payment Failed</h1>
          <p className="mt-2 text-sm text-zinc-500">{errorMessage}</p>
          <p className="mt-4 text-sm text-zinc-400">Please try again with a different card or contact your bank.</p>
          <Link
            href="/pricing"
            className="mt-6 inline-block w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
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
