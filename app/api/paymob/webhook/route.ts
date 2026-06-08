import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;

    if (hmacSecret) {
      const obj = body.obj || {};
      const hmacString = [
        obj.amount_cents, obj.created_at, obj.currency, obj.error_occured,
        obj.has_parent_transaction, obj.id, obj.integration_id, obj.is_3d_secure,
        obj.is_auth, obj.is_capture, obj.is_refunded, obj.is_standalone_payment,
        obj.is_voided, obj.order?.id, obj.owner, obj.pending,
        obj.source_data?.pan, obj.source_data?.sub_type, obj.source_data?.type, obj.success,
      ].map((v) => String(v ?? "")).join("");

      const expectedHmac = crypto.createHmac("sha512", hmacSecret).update(hmacString).digest("hex");
      if (expectedHmac !== body.hmac) {
        return NextResponse.json({ error: "Invalid HMAC" }, { status: 400 });
      }
    }

    const obj = body.obj || {};
    if (obj.success !== true) {
      return NextResponse.json({ received: true, action: "ignored" });
    }

    const merchantOrderId: string = obj.order?.merchant_order_id || "";
    const userId = merchantOrderId.split("-")[0];
    if (!userId) {
      return NextResponse.json({ error: "Unknown user" }, { status: 400 });
    }

    const supabase = createServiceClient();
    await supabase
      .from("users")
      .update({ subscription_status: "active", subscription_updated_at: new Date().toISOString() })
      .eq("id", userId);

    return NextResponse.json({ received: true, action: "subscription activated" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
