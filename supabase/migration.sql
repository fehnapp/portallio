-- Run this in Supabase SQL editor to upgrade from Stripe to Paymob

-- Add new columns to users table
alter table public.users
  add column if not exists subscription_status text not null default 'free'
    check (subscription_status in ('free', 'active', 'canceled')),
  add column if not exists paymob_order_id text;

-- Copy existing stripe status over
update public.users
  set subscription_status = stripe_subscription_status
  where stripe_subscription_status is not null;

-- Add payment fields to portals if missing
alter table public.portals
  add column if not exists instapay_number text,
  add column if not exists vodafone_cash_number text;
