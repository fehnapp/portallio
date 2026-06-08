import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { activatePaidAccess } from "@/lib/subscription";

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  const paymobOrderId = String(body.paymob_order_id || "").trim();
  if (paymobOrderId) {
    const { data: orderUser } = await createServiceClient()
      .from("users")
      .select("id")
      .eq("paymob_order_id", paymobOrderId)
      .maybeSingle();

    if (orderUser?.id) {
      const { error } = await activatePaidAccess(orderUser.id);
      if (!error) {
        const response = NextResponse.json({ ok: true, source: "paymob_order_id" });
        response.cookies.set("portalio_pending_payment_user", "", { path: "/", maxAge: 0 });
        return response;
      }
    }
  }

  const merchantOrderId = String(body.merchant_order_id || "").trim();
  const userIdFromOrder = merchantOrderId.split("|")[0];
  if (userIdFromOrder && userIdFromOrder.length > 10) {
    const { error } = await activatePaidAccess(userIdFromOrder);
    if (!error) {
      const response = NextResponse.json({ ok: true, source: "merchant_order_id" });
      response.cookies.set("portalio_pending_payment_user", "", { path: "/", maxAge: 0 });
      return response;
    }
  }

  if (userData?.user) {
    const { error } = await activatePaidAccess(userData.user.id, userData.user.email ?? undefined);
    if (!error) {
      const response = NextResponse.json({ ok: true, source: "session" });
      response.cookies.set("portalio_pending_payment_user", "", { path: "/", maxAge: 0 });
      return response;
    }
  }

  const pendingUserId = cookies().get("portalio_pending_payment_user")?.value;
  if (pendingUserId && pendingUserId.length > 10) {
    const { error } = await activatePaidAccess(pendingUserId);
    if (!error) {
      const response = NextResponse.json({ ok: true, source: "cookie" });
      response.cookies.set("portalio_pending_payment_user", "", { path: "/", maxAge: 0 });
      return response;
    }
  }

  return NextResponse.json({ ok: false }, { status: 400 });
}
