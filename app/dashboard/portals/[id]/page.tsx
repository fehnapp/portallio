import { notFound } from "next/navigation";
import {
  sendFreelancerMessage,
  updatePortal,
  uploadPortalFiles
} from "@/app/actions";
import { PortalDetailClient } from "@/components/portal-detail-client";
import { createClient } from "@/lib/supabase/server";
import type { Message, Portal, PortalFile } from "@/lib/types";
import { publicPortalUrl } from "@/lib/utils";

export default async function PortalDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user!;

  const { data: portal } = await supabase
    .from("portals")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single<Portal>();

  if (!portal) notFound();

  const [{ data: files }, { data: messages }] = await Promise.all([
    supabase
      .from("files")
      .select("*")
      .eq("portal_id", portal.id)
      .order("uploaded_at", { ascending: false }),
    supabase
      .from("messages")
      .select("*")
      .eq("portal_id", portal.id)
      .order("created_at", { ascending: true })
  ]);

  const updateAction = updatePortal.bind(null, portal.id);
  const uploadAction = uploadPortalFiles.bind(null, portal.id);
  const replyAction = sendFreelancerMessage.bind(null, portal.id);
  const link = publicPortalUrl(portal.slug);

  return (
    <PortalDetailClient
      portal={portal}
      files={(files as PortalFile[]) || []}
      messages={(messages as Message[]) || []}
      link={link}
      updateAction={updateAction}
      uploadAction={uploadAction}
      replyAction={replyAction}
    />
  );
}
