"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Portal } from "@/lib/types";

type PaymentMethod = "url" | "instapay" | "vodafone";

function getDefaultPaymentMethod(portal?: Portal): PaymentMethod {
  if (portal?.instapay_number) return "instapay";
  if (portal?.vodafone_cash_number) return "vodafone";
  return "url";
}

export function PortalForm({
  action,
  portal,
  submitLabel
}: {
  action: (formData: FormData) => void | Promise<void>;
  portal?: Portal;
  submitLabel: string;
}) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    getDefaultPaymentMethod(portal)
  );
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await action(formData);
      if (portal) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    });
  }

  const inputClass = "h-10 rounded-lg border-zinc-200 bg-white text-sm focus:border-emerald-400 focus:ring-emerald-400/20";
  const labelClass = "text-sm font-medium text-zinc-700";

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* Client + Project */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="client_name" className={labelClass}>Client name</Label>
          <Input id="client_name" name="client_name" defaultValue={portal?.client_name} required className={inputClass} placeholder="Acme Co." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="project_title" className={labelClass}>Project title</Label>
          <Input id="project_title" name="project_title" defaultValue={portal?.project_title} required className={inputClass} placeholder="Brand Identity Package" />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-1.5">
        <Label htmlFor="status_text" className={labelClass}>Status</Label>
        <Input
          id="status_text"
          name="status_text"
          placeholder="In progress"
          defaultValue={portal?.status_text || "In progress"}
          required
          className={inputClass}
        />
      </div>

      {/* Invoice amount + due date */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="invoice_amount" className={labelClass}>Invoice amount (EGP)</Label>
          <Input
            id="invoice_amount"
            name="invoice_amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            defaultValue={portal?.invoice_amount ?? ""}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="invoice_due_date" className={labelClass}>Due date</Label>
          <Input
            id="invoice_due_date"
            name="invoice_due_date"
            type="date"
            defaultValue={portal?.invoice_due_date ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      {/* Payment method */}
      <div className="space-y-3">
        <Label className={labelClass}>Payment method</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "url", label: "Payment URL" },
            { id: "instapay", label: "InstaPay" },
            { id: "vodafone", label: "Vodafone Cash" }
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPaymentMethod(id as PaymentMethod)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                paymentMethod === id
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {paymentMethod === "url" && (
          <div className="space-y-1.5">
            <input type="hidden" name="instapay_number" value="" />
            <input type="hidden" name="vodafone_cash_number" value="" />
            <Input
              name="invoice_payment_url"
              type="url"
              placeholder="https://paypal.me/yourname"
              defaultValue={portal?.invoice_payment_url ?? ""}
              className={inputClass}
            />
            <p className="text-xs text-zinc-400">PayPal, Stripe, Wise, any payment link</p>
          </div>
        )}

        {paymentMethod === "instapay" && (
          <div className="space-y-1.5">
            <input type="hidden" name="invoice_payment_url" value="" />
            <input type="hidden" name="vodafone_cash_number" value="" />
            <Input
              name="instapay_number"
              placeholder="Your InstaPay number or username"
              defaultValue={portal?.instapay_number ?? ""}
              className={inputClass}
            />
            <p className="text-xs text-zinc-400">Client will see your InstaPay number to send payment</p>
          </div>
        )}

        {paymentMethod === "vodafone" && (
          <div className="space-y-1.5">
            <input type="hidden" name="invoice_payment_url" value="" />
            <input type="hidden" name="instapay_number" value="" />
            <Input
              name="vodafone_cash_number"
              placeholder="01xxxxxxxxx"
              defaultValue={portal?.vodafone_cash_number ?? ""}
              className={inputClass}
            />
            <p className="text-xs text-zinc-400">Client will see your Vodafone Cash number to send payment</p>
          </div>
        )}
      </div>

      {/* Files — only on create */}
      {!portal ? (
        <div className="space-y-1.5">
          <Label htmlFor="files" className={labelClass}>Files <span className="font-normal text-zinc-400">(optional)</span></Label>
          <Input id="files" name="files" type="file" multiple className="h-auto cursor-pointer rounded-lg border-zinc-200 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100" />
        </div>
      ) : null}

      {/* Submit */}
      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" disabled={isPending} className="rounded-xl">
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving…
            </>
          ) : saved ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Saved!
            </>
          ) : (
            submitLabel
          )}
        </Button>
        {saved && (
          <p className="text-sm text-emerald-600">Changes saved successfully.</p>
        )}
      </div>
    </form>
  );
}
