import { NextRequest, NextResponse } from "next/server";
import { activatePaidAccess } from "@/lib/subscription";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const obj = body.obj || {};

    console.log("Webhook received:", JSON.stringify({
      success: obj.success,
      merchant_order_id: obj.order?.merchant_order_id,
      error_occured: obj.error_occured,
      amount: obj.amount_cents,
    }));

    if (obj.success !== true) {
      console.log("Webhook ignored — success is not true");
      return NextResponse.json({ received: true, action: "ignored" });
    }

    const merchantOrderId: string = obj.order?.merchant_order_id || "";
    const userId = merchantOrderId.split("|")[0];

    console.log("Activating userId:", userId);

    if (!userId || userId.length < 10) {
      console.log("Invalid userId extracted:", userId);
      return NextResponse.json({ error: "Unknown user" }, { status: 400 });
    }

    const { error } = await activatePaidAccess(userId);

    if (error) {
      console.log("Supabase error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    console.log("Subscription activated for:", userId);
    return NextResponse.json({ received: true, action: "subscription activated" });
  } catch (e: any) {
    console.log("Webhook error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
