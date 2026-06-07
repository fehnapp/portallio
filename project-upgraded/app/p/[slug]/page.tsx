import { CalendarDays, FileDown, MessageCircle, Smartphone } from "lucide-react";
import { notFound } from "next/navigation";
import { recordPortalView, sendClientMessage } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortalChat } from "@/components/portal-chat";
import { createServiceClient } from "@/lib/supabase/server";
import type { Message, Portal, PortalFile } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function PublicPortalPage({ params }: { params: { slug: string } }) {
  const supabase = createServiceClient();
  const { data: portal } = await supabase
    .from("portals")
    .select("*")
    .eq("slug", params.slug)
    .single<Portal>();

  if (!portal) notFound();

  await recordPortalView(portal);

  const [{ data: files }, { data: messages }] = await Promise.all([
    supabase
      .from("files")
      .select("*")
      .eq("portal_id", portal.id)
      .order("uploaded_at", { ascending: false }),
    supabase
      .from("messages")
      .select("*")
      .eq("portal_id", portal.id)
      .order("created_at", { ascending: true })
  ]);

  const messageAction = sendClientMessage.bind(null, portal.id);

  const hasPaymentUrl = portal.invoice_payment_url;
  const hasInstapay = portal.instapay_number;
  const hasVodafone = portal.vodafone_cash_number;
  const hasInvoice = portal.invoice_amount || portal.invoice_due_date || hasPaymentUrl || hasInstapay || hasVodafone;

  return (
    <main className="min-h-screen bg-[#f8f8f7]">
      {/* Header */}
      <section className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-8 sm:py-10">
          <p className="font-display text-base italic text-emerald-700">portalio</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {portal.project_title}
              </h1>
              <p className="mt-2 text-[0.9375rem] text-zinc-500">Prepared for {portal.client_name}</p>
            </div>
            <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/60">
              {portal.status_text}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-2xl gap-4 px-5 py-5 sm:gap-5 sm:py-8">

        {/* Files */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold tracking-tight">Files</h2>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
              {(files as PortalFile[] | null)?.length || 0} shared
            </span>
          </div>
          <div className="space-y-1.5">
            {(files as PortalFile[] | null)?.length ? (
              (files as PortalFile[]).map((file) => (
                <a
                  key={file.id}
                  href={file.file_url}
                  target="_blank"
                  className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-2.5 text-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <span className="truncate font-medium text-zinc-800">{file.file_name}</span>
                  <FileDown className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
                </a>
              ))
            ) : (
              <p className="rounded-xl bg-zinc-50 px-4 py-4 text-sm text-zinc-400 border border-zinc-100">
                Files will appear here when they are shared.
              </p>
            )}
          </div>
        </section>

        {/* Invoice */}
        {hasInvoice && (
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-card sm:p-6">
            <h2 className="font-semibold tracking-tight">Invoice</h2>
            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-3xl font-semibold tracking-tight">
                  {formatCurrency(portal.invoice_amount)}
                </p>
                {portal.invoice_due_date && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500">
                    <CalendarDays className="h-4 w-4 text-zinc-400" />
                    Due {formatDate(portal.invoice_due_date)}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:items-end">
                {hasPaymentUrl && (
                  <Button asChild className="w-full rounded-xl sm:w-auto" size="lg">
                    <a href={portal.invoice_payment_url!} target="_blank">
                      Pay Now →
                    </a>
                  </Button>
                )}

                {hasInstapay && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm sm:text-right">
                    <p className="flex items-center gap-1.5 font-semibold text-emerald-800 sm:justify-end">
                      <Smartphone className="h-4 w-4" />
                      Pay via InstaPay
                    </p>
                    <p className="mt-1.5 text-xl font-semibold text-emerald-900">
                      {portal.instapay_number}
                    </p>
                    <p className="mt-1 text-xs text-emerald-600">
                      Send to this InstaPay number or username
                    </p>
                  </div>
                )}

                {hasVodafone && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm sm:text-right">
                    <p className="flex items-center gap-1.5 font-semibold text-red-800 sm:justify-end">
                      <Smartphone className="h-4 w-4" />
                      Pay via Vodafone Cash
                    </p>
                    <p className="mt-1.5 text-xl font-semibold text-red-900">
                      {portal.vodafone_cash_number}
                    </p>
                    <p className="mt-1 text-xs text-red-600">
                      Send to this Vodafone Cash number
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Chat */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <MessageCircle className="h-4.5 w-4.5 text-emerald-600" />
            <h2 className="font-semibold tracking-tight">Chat</h2>
          </div>
          <PortalChat
            messages={(messages as Message[]) || []}
            action={messageAction}
          />
        </section>

        {/* Powered by */}
        <p className="text-center text-xs text-zinc-400 pb-2">
          Powered by{" "}
          <a href="/" className="font-display italic text-emerald-600 hover:underline underline-offset-2">
            portalio
          </a>
        </p>
      </div>
    </main>
  );
}
