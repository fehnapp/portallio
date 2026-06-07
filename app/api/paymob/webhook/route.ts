import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

// Paymob sends a POST with transaction data and an HMAC signature.
// We verify the signature then mark the user's subscription as active.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
    if (!hmacSecret) {
      console.error("PAYMOB_HMAC_SECRET is not set — skipping HMAC verification");
    } else {
      // Verify HMAC signature from Paymob
      // Paymob concatenates specific fields in a fixed order to build the string to hash.
      const obj = body.obj || {};
      const hmacString = [
        obj.amount_cents,
        obj.created_at,
        obj.currency,
        obj.error_occured,
        obj.has_parent_transaction,
        obj.id,
        obj.integration_id,
        obj.is_3d_secure,
        obj.is_auth,
        obj.is_capture,
        obj.is_refunded,
        obj.is_standalone_payment,
        obj.is_voided,
        obj.order?.id,
        obj.owner,
        obj.pending,
        obj.source_data?.pan,
        obj.source_data?.sub_type,
        obj.source_data?.type,
        obj.success,
      ]
        .map((v) => String(v ?? ""))
        .join("");

      const expectedHmac = crypto.createHmac("sha512", hmacSecret).update(hmacString).digest("hex");
      const receivedHmac = body.hmac;

      if (expectedHmac !== receivedHmac) {
        console.error("HMAC mismatch — rejecting webhook");
        return NextResponse.json({ error: "Invalid HMAC" }, { status: 400 });
      }
    }

    const obj = body.obj || {};

    // Only act on successful transactions
    if (obj.success !== true) {
      return NextResponse.json({ received: true, action: "ignored — not successful" });
    }

    // Extract the user ID from merchant_order_id (format: "{userId}-{timestamp}")
    const merchantOrderId: string = obj.order?.merchant_order_id || "";
    const userId = merchantOrderId.split("-")[0];

    if (!userId) {
      console.error("Could not extract userId from merchant_order_id:", merchantOrderId);
      return NextResponse.json({ error: "Unknown user" }, { status: 400 });
    }

    // Mark user subscription as active
    const supabase = createServiceClient();
    const { error } = await supabase
      .from("users")
      .update({
        subscription_status: "active",
        subscription_updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true, action: "subscription activated" });
  } catch (e: any) {
    console.error("Webhook error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
