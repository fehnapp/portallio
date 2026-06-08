"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { notifyClientMessage, notifyFirstPortalView } from "@/lib/notifications";
import type { Portal } from "@/lib/types";

const portalSchema = z.object({
  client_name: z.string().min(1),
  project_title: z.string().min(1),
  status_text: z.string().min(1).default("In progress"),
  invoice_amount: z.coerce.number().nonnegative().optional().nullable(),
  invoice_due_date: z.string().optional().nullable(),
  invoice_payment_url: z.string().url().optional().or(z.literal("")).nullable(),
  instapay_number: z.string().optional().nullable(),
  vodafone_cash_number: z.string().optional().nullable()
});

function slug() {
  return randomUUID().replaceAll("-", "").slice(0, 12);
}

async function requireUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  return { supabase, user: data.user };
}

async function uploadFiles(portalId: string, files: File[]) {
  if (files.length === 0) return;
  const supabase = createServiceClient();
  const fileRows = [];

  for (const file of files) {
    if (!file.name || file.size === 0) continue;
    const path = `${portalId}/${randomUUID()}-${file.name}`;
    const { error } = await supabase.storage
      .from("portal-files")
      .upload(path, file, { upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from("portal-files").getPublicUrl(path);
    fileRows.push({ portal_id: portalId, file_name: file.name, file_url: data.publicUrl });
  }

  if (fileRows.length > 0) {
    const { error } = await supabase.from("files").insert(fileRows);
    if (error) throw error;
  }
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createPortal(formData: FormData) {
  const { supabase, user } = await requireUser();
  const parsed = portalSchema.parse(Object.fromEntries(formData));

  const [{ count }, { data: profile }] = await Promise.all([
    supabase.from("portals").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("users").select("subscription_status").eq("id", user.id).single()
  ]);

  if ((count || 0) >= 1 && profile?.subscription_status !== "active") {
    redirect("/pricing?limit=1");
  }

  const { data: portal, error } = await supabase
    .from("portals")
    .insert({
      ...parsed,
      invoice_amount: parsed.invoice_amount || null,
      invoice_due_date: parsed.invoice_due_date || null,
      invoice_payment_url: parsed.invoice_payment_url || null,
      instapay_number: parsed.instapay_number || null,
      vodafone_cash_number: parsed.vodafone_cash_number || null,
      user_id: user.id,
      slug: slug()
    })
    .select("id")
    .single();

  if (error) throw error;

  const files = formData.getAll("files").filter(Boolean) as File[];
  await uploadFiles(portal.id, files);
  redirect(`/dashboard/portals/${portal.id}`);
}

export async function updatePortal(portalId: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  const parsed = portalSchema.parse(Object.fromEntries(formData));

  const { error } = await supabase
    .from("portals")
    .update({
      ...parsed,
      invoice_amount: parsed.invoice_amount || null,
      invoice_due_date: parsed.invoice_due_date || null,
      invoice_payment_url: parsed.invoice_payment_url || null,
      instapay_number: parsed.instapay_number || null,
      vodafone_cash_number: parsed.vodafone_cash_number || null
    })
    .eq("id", portalId)
    .eq("user_id", user.id);

  if (error) throw error;

  const { data: portal } = await supabase.from("portals").select("slug").eq("id", portalId).single();
  revalidatePath(`/dashboard/portals/${portalId}`);
  if (portal?.slug) revalidatePath(`/p/${portal.slug}`);
}

export async function uploadPortalFiles(portalId: string, formData: FormData) {
  await requireUser();
  const files = formData.getAll("files").filter(Boolean) as File[];
  await uploadFiles(portalId, files);
  revalidatePath(`/dashboard/portals/${portalId}`);
}

export async function sendFreelancerMessage(portalId: string, formData: FormData) {
  const { supabase } = await requireUser();
  const content = String(formData.get("content") || "").trim();
  if (!content) return;
  const { error } = await supabase.from("messages").insert({ portal_id: portalId, sender: "freelancer", content });
  if (error) throw error;
  revalidatePath(`/dashboard/portals/${portalId}`);
}

export async function recordPortalView(portal: Portal) {
  const supabase = createServiceClient();
  const { count } = await supabase
    .from("portal_views")
    .select("id", { count: "exact", head: true })
    .eq("portal_id", portal.id);

  if ((count || 0) > 0) return;

  await supabase.from("portal_views").insert({ portal_id: portal.id });
  await notifyFirstPortalView(portal);
}

export async function sendClientMessage(portalId: string, formData: FormData) {
  const supabase = createServiceClient();
  const content = String(formData.get("content") || "").trim();
  if (!content) return;

  const { data: portal, error: portalError } = await supabase
    .from("portals").select("*").eq("id", portalId).single<Portal>();
  if (portalError) throw portalError;

  const { error } = await supabase.from("messages").insert({ portal_id: portalId, sender: "client", content });
  if (error) throw error;

  await notifyClientMessage(portal, content);
  revalidatePath(`/p/${portal.slug}`);
}

// ─── Paymob Subscription ──────────────────────────────────────────────────────

export async function createPaymobCheckout() {
  const { supabase, user } = await requireUser();

  const apiKey = process.env.PAYMOB_API_KEY;
  const integrationId = process.env.PAYMOB_INTEGRATION_ID;

  if (!apiKey || !integrationId) {
    throw new Error("Paymob credentials not configured. Add PAYMOB_API_KEY and PAYMOB_INTEGRATION_ID to .env.local");
  }

  // Step 1: Auth token
  const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey })
  });
  const authData = await authRes.json();
  const token = authData.token;

  // Step 2: Register order
  const { data: profile } = await supabase.from("users").select("email").eq("id", user.id).single();
  const orderRes = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: token,
      delivery_needed: false,
      amount_cents: 2900 * 100, // $29 in cents — change to EGP if billing in EGP
      currency: "USD",
      merchant_order_id: `${user.id}-${Date.now()}`,
      items: [{ name: "Portalio Pro", amount_cents: 2900 * 100, description: "Monthly subscription", quantity: 1 }]
    })
  });
  const orderData = await orderRes.json();

  // Step 3: Payment key
  const payKeyRes = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: token,
      amount_cents: 2900 * 100,
      expiration: 3600,
      order_id: orderData.id,
      billing_data: {
        email: profile?.email || user.email || "guest@example.com",
        first_name: "Portalio",
        last_name: "User",
        phone_number: "N/A",
        apartment: "N/A", floor: "N/A", street: "N/A",
        building: "N/A", shipping_method: "N/A",
        postal_code: "N/A", city: "N/A", country: "N/A", state: "N/A"
      },
      currency: "USD",
      integration_id: integrationId,
      lock_order_when_paid: true
    })
  });
  const payKeyData = await payKeyRes.json();

  // Redirect to Paymob hosted payment page
  redirect(`https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${payKeyData.token}`);
}
