import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { activatePaidAccess } from "@/lib/subscription";

export async function POST() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

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
