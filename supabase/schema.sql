create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  subscription_status text not null default 'free' check (subscription_status in ('free', 'active', 'canceled')),
  subscription_updated_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_status text not null default 'free' check (stripe_subscription_status in ('free', 'active', 'canceled')),
  created_at timestamptz not null default now()
);

create table if not exists public.portals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  slug text not null unique,
  client_name text not null,
  project_title text not null,
  status_text text not null default 'In progress',
  invoice_amount numeric(10, 2),
  invoice_due_date date,
  invoice_payment_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  portal_id uuid not null references public.portals(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  uploaded_at timestamptz not null default now()
);

create type public.message_sender as enum ('freelancer', 'client');

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  portal_id uuid not null references public.portals(id) on delete cascade,
  sender public.message_sender not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.portal_views (
  id uuid primary key default gen_random_uuid(),
  portal_id uuid not null references public.portals(id) on delete cascade,
  viewed_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.portals enable row level security;
alter table public.files enable row level security;
alter table public.messages enable row level security;
alter table public.portal_views enable row level security;

create policy "users can read self" on public.users
  for select using (auth.uid() = id);

create policy "users can update self" on public.users
  for update using (auth.uid() = id);

create policy "users can read own portals" on public.portals
  for select using (auth.uid() = user_id);

create policy "users can insert own portals" on public.portals
  for insert with check (auth.uid() = user_id);

create policy "users can update own portals" on public.portals
  for update using (auth.uid() = user_id);

create policy "users can read files for own portals" on public.files
  for select using (
    exists (select 1 from public.portals where portals.id = files.portal_id and portals.user_id = auth.uid())
  );

create policy "users can insert files for own portals" on public.files
  for insert with check (
    exists (select 1 from public.portals where portals.id = files.portal_id and portals.user_id = auth.uid())
  );

create policy "users can read messages for own portals" on public.messages
  for select using (
    exists (select 1 from public.portals where portals.id = messages.portal_id and portals.user_id = auth.uid())
  );

create policy "users can insert freelancer messages" on public.messages
  for insert with check (
    sender = 'freelancer' and exists (
      select 1 from public.portals where portals.id = messages.portal_id and portals.user_id = auth.uid()
    )
  );

create policy "users can read views for own portals" on public.portal_views
  for select using (
    exists (select 1 from public.portals where portals.id = portal_views.portal_id and portals.user_id = auth.uid())
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('portal-files', 'portal-files', true)
on conflict (id) do nothing;
