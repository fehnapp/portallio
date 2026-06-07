import Link from "next/link";
import { ExternalLink, Plus, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user!;

  const [{ data: portals }, { data: profile }] = await Promise.all([
    supabase
      .from("portals")
      .select("*, portal_views(id)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("users")
      .select("stripe_subscription_status")
      .eq("id", user.id)
      .single()
  ]);

  const isFreeLimit =
    (portals?.length || 0) >= 1 && profile?.stripe_subscription_status !== "active";

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Client portals</h1>
          <p className="mt-1.5 text-[0.9375rem] text-zinc-500">
            Create polished project pages for each client.
          </p>
        </div>
        <Button asChild className="shrink-0 shadow-sm rounded-xl" size="sm">
          <Link href={isFreeLimit ? "/pricing?limit=1" : "/dashboard/portals/new"}>
            <Plus className="h-4 w-4" />
            New portal
          </Link>
        </Button>
      </div>

      {isFreeLimit ? (
        <div className="flex flex-col gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800 sm:flex-row sm:items-center sm:justify-between">
          <p>You've used your free portal. Upgrade to create unlimited client portals.</p>
          <Button asChild size="sm" className="shrink-0 rounded-lg">
            <Link href="/pricing">Upgrade plan</Link>
          </Button>
        </div>
      ) : null}

      <div className="grid gap-3">
        {portals?.length ? (
          portals.map((portal: any) => (
            <div
              key={portal.id}
              className="group flex flex-col justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-card transition-all duration-150 hover:shadow-card-hover md:flex-row md:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-semibold tracking-tight">{portal.client_name}</h2>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200/60">
                    {portal.status_text}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">{portal.project_title}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
                  {portal.portal_views?.length ? (
                    <><Eye className="h-3.5 w-3.5 text-emerald-500" /> Viewed by client</>
                  ) : (
                    <><EyeOff className="h-3.5 w-3.5" /> Not viewed yet</>
                  )}
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="shrink-0 rounded-lg">
                <Link href={`/dashboard/portals/${portal.id}`}>
                  Manage
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-200/60 mb-4">
              <Plus className="h-5 w-5 text-emerald-700" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight">Create your first portal</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 leading-relaxed">
              Add project details, files, invoice info, and a client chat in one shareable link.
            </p>
            <Button asChild className="mt-6 rounded-xl" size="sm">
              <Link href="/dashboard/portals/new">
                <Plus className="h-4 w-4" />
                Create New Portal
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
