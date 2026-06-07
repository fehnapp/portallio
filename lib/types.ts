export type Portal = {
  id: string;
  user_id: string;
  slug: string;
  client_name: string;
  project_title: string;
  status_text: string;
  invoice_amount: number | null;
  invoice_due_date: string | null;
  invoice_payment_url: string | null;
  instapay_number: string | null;
  vodafone_cash_number: string | null;
  created_at: string;
};

export type PortalFile = {
  id: string;
  portal_id: string;
  file_name: string;
  file_url: string;
  uploaded_at: string;
};

export type Message = {
  id: string;
  portal_id: string;
  sender: "freelancer" | "client";
  content: string;
  created_at: string;
};
