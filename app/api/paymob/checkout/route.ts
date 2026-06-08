import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { data: profile } = await supabase
      .from("users")
      .select("subscription_status, email")
      .eq("id", user.id)
      .single();

    if (profile?.subscription_status === "active") {
      return NextResponse.json({ error: "You already have an active subscription." }, { status: 400 });
    }

    const apiKey = process.env.PAYMOB_API_KEY;
    const integrationId = process.env.PAYMOB_INTEGRATION_ID;
    const iframeId = process.env.PAYMOB_IFRAME_ID;

    if (!apiKey || !integrationId || !iframeId) {
      return NextResponse.json({ error: "Paymob not configured — missing env vars" }, { status: 500 });
    }

    const AMOUNT_CENTS = parseInt(process.env.PAYMOB_AMOUNT_CENTS || "90000");
    const CURRENCY = process.env.PAYMOB_CURRENCY || "EGP";
    const email = profile?.email || user.email || "user@example.com";

    // Step 1: Auth token
    const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey }),
    });
    const authData = await authRes.json();
    if (!authData.token) {
      return NextResponse.json({ error: "Paymob auth failed: " + JSON.stringify(authData) }, { status: 500 });
    }

    // Step 2: Register order
    // IMPORTANT: use "|" as separator so we can extract the full UUID later in the webhook
    const merchantOrderId = `${user.id}|${Date.now()}`;
    const orderRes = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authData.token,
        delivery_needed: false,
        amount_cents: AMOUNT_CENTS,
        currency: CURRENCY,
        merchant_order_id: merchantOrderId,
        items: [{ name: "Portalio Pro", amount_cents: AMOUNT_CENTS, description: "One-time purchase — lifetime access", quantity: 1 }],
      }),
    });
    const orderData = await orderRes.json();
    if (!orderData.id) {
      return NextResponse.json({ error: "Paymob order failed: " + JSON.stringify(orderData) }, { status: 500 });
    }

    await createServiceClient()
      .from("users")
      .update({ paymob_order_id: String(orderData.id) })
      .eq("id", user.id);

    // Step 3: Payment key
    const payKeyRes = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authData.token,
        amount_cents: AMOUNT_CENTS,
        expiration: 3600,
        order_id: orderData.id,
        billing_data: {
          email,
          first_name: "Portalio", last_name: "User",
          phone_number: "N/A", apartment: "N/A", floor: "N/A",
          street: "N/A", building: "N/A", shipping_method: "N/A",
          postal_code: "N/A", city: "N/A", country: "N/A", state: "N/A",
        },
        currency: CURRENCY,
        integration_id: parseInt(integrationId),
        lock_order_when_paid: true,
      }),
    });
    const payKeyData = await payKeyRes.json();
    if (!payKeyData.token) {
      return NextResponse.json({ error: "Paymob payment key failed: " + JSON.stringify(payKeyData) }, { status: 500 });
    }

    const url = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${payKeyData.token}`;
    const response = NextResponse.json({ url });
    response.cookies.set("portalio_pending_payment_user", user.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });
    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
