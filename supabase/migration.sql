-- Run this in Supabase SQL editor to make sure the Paymob fields exist

alter table public.users
  add column if not exists subscription_status text not null default 'free'
    check (subscription_status in ('free', 'active', 'canceled')),
  add column if not exists subscription_updated_at timestamptz,
  add column if not exists paymob_order_id text;

alter table public.portals
  add column if not exists instapay_number text,
  add column if not exists vodafone_cash_number text;
