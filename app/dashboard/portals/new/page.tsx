import { redirect } from "next/navigation";
import { createPortal } from "@/app/actions";
import { PortalForm } from "@/components/portal-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function NewPortalPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const [{ data: portals }, { data: profile }] = await Promise.all([
    supabase
      .from("portals")
      .select("id")
      .eq("user_id", userData.user.id),
    supabase
      .from("users")
      .select("subscription_status")
      .eq("id", userData.user.id)
      .single()
  ]);

  if ((portals?.length || 0) >= 1 && profile?.subscription_status !== "active") {
    redirect("/pricing?limit=1");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create portal</h1>
        <p className="mt-1.5 text-sm text-zinc-500">Add project details, files, invoice info, and a client chat in one link.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portal details</CardTitle>
        </CardHeader>
        <CardContent>
          <PortalForm action={createPortal} submitLabel="Create portal" />
        </CardContent>
      </Card>
    </div>
  );
}
