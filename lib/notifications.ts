import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/server";
import type { Portal } from "@/lib/types";
import { publicPortalUrl } from "@/lib/utils";

const fromEmail = "Portalio <notifications@portalio.app>";

async function getFreelancerEmail(userId: string) {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("users")
    .select("email")
    .eq("id", userId)
    .single();

  return data?.email;
}

async function sendEmail(to: string, subject: string, text: string) {
  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    text
  });
}

export async function notifyFirstPortalView(portal: Portal) {
  const email = await getFreelancerEmail(portal.user_id);
  if (!email) return;

  await sendEmail(
    email,
    `${portal.client_name} viewed their portal`,
    `${portal.client_name} opened the portal for ${portal.project_title}.\n\n${publicPortalUrl(portal.slug)}`
  );
}

export async function notifyClientMessage(portal: Portal, content: string) {
  const email = await getFreelancerEmail(portal.user_id);
  if (!email) return;

  await sendEmail(
    email,
    `New message from ${portal.client_name}`,
    `${portal.client_name} sent a message about ${portal.project_title}:\n\n${content}\n\nReply here: ${publicPortalUrl(portal.slug)}`
  );
}
