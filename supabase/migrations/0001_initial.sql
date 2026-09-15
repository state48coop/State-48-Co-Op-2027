create extension if not exists "uuid-ossp";

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(), title text not null, slug text unique not null,
  category text not null check (category in ('Commercial', 'Event Activations', 'Heritage Furniture')),
  blueprint_url text, final_img_url text, challenge text, execution text, tags text[] not null default '{}',
  is_published boolean not null default false, created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(), name text not null, slug text unique not null,
  description text not null, base_price numeric(12,2) not null check (base_price >= 0), sku text unique not null,
  images text[] not null default '{}', category text not null, allow_engrave boolean not null default false,
  engrave_cost numeric(12,2) not null default 0 check (engrave_cost >= 0), is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.attribute_groups (
  id uuid primary key default uuid_generate_v4(), name text unique not null,
  values text[] not null default '{}', sort_order integer not null default 0, created_at timestamptz not null default now()
);

create table if not exists public.product_attributes (
  id uuid primary key default uuid_generate_v4(), product_id uuid not null references public.products(id) on delete cascade,
  name text not null, values text[] not null default '{}', unique(product_id, name)
);

create table if not exists public.product_variants (
  id uuid primary key default uuid_generate_v4(), product_id uuid not null references public.products(id) on delete cascade,
  combination jsonb not null, price_modifier numeric(12,2) not null default 0, stock integer not null default 0 check (stock >= 0),
  variant_image text, sku text unique not null, unique(product_id, combination)
);

create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(), title text not null, event_date timestamptz not null,
  description text, location text not null default 'The Barn at State 48 Co-Op', is_published boolean not null default false
);

create table if not exists public.ui_config (
  id uuid primary key default uuid_generate_v4(), key text unique not null, value jsonb not null default '{}'::jsonb
);

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.products enable row level security;
alter table public.attribute_groups enable row level security;
alter table public.product_attributes enable row level security;
alter table public.product_variants enable row level security;
alter table public.events enable row level security;
alter table public.ui_config enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create policy "Public can read published projects" on public.projects for select using (is_published = true or public.is_admin());
create policy "Admins manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read published products" on public.products for select using (is_published = true or public.is_admin());
create policy "Admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read attributes for published products" on public.product_attributes for select using (exists (select 1 from public.products where products.id = product_id and products.is_published = true) or public.is_admin());
create policy "Admins manage product attributes" on public.product_attributes for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read variants for published products" on public.product_variants for select using (exists (select 1 from public.products where products.id = product_id and products.is_published = true) or public.is_admin());
create policy "Admins manage product variants" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read published events" on public.events for select using (is_published = true or public.is_admin());
create policy "Admins manage events" on public.events for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can read UI config" on public.ui_config for select using (true);
create policy "Admins manage UI config" on public.ui_config for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can read admin roster" on public.admin_users for select using (public.is_admin());
create policy "Users can verify their own admin membership" on public.admin_users for select using (auth.uid() = user_id);
