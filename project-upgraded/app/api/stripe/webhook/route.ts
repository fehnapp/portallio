import { headers } from "next/headers";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Payment completed → activate subscription
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    if (userId) {
      await supabase
        .from("users")
        .update({
          stripe_customer_id: String(session.customer || ""),
          stripe_subscription_status: "active"
        })
        .eq("id", userId);
    }
  }

  // Subscription cancelled or paused → revoke access
  if (
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.paused"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    await supabase
      .from("users")
      .update({ stripe_subscription_status: "canceled" })
      .eq("stripe_customer_id", String(subscription.customer));
  }

  // Subscription updated (e.g. reactivated after pause, plan change)
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const status =
      subscription.status === "active" || subscription.status === "trialing"
        ? "active"
        : subscription.status === "canceled" || subscription.status === "unpaid"
          ? "canceled"
          : null;

    if (status) {
      await supabase
        .from("users")
        .update({ stripe_subscription_status: status })
        .eq("stripe_customer_id", String(subscription.customer));
    }
  }

  // Payment failed → mark as canceled so paywall kicks in
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    // Only cancel on final failure (attempt_count >= 3), not first failure
    if ((invoice.attempt_count ?? 0) >= 3) {
      await supabase
        .from("users")
        .update({ stripe_subscription_status: "canceled" })
        .eq("stripe_customer_id", String(invoice.customer));
    }
  }

  return Response.json({ received: true });
}
