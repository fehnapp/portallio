import { createServiceClient } from "@/lib/supabase/server";

export async function activatePaidAccess(userId: string, email?: string) {
  const supabase = createServiceClient();

  const { error } = await supabase.from("users").upsert(
    {
      id: userId,
      email: email ?? null,
      subscription_status: "active",
      stripe_subscription_status: "active",
      subscription_updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  return { error };
}
