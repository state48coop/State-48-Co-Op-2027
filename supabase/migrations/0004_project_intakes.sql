create table if not exists public.project_intakes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  project_type text not null,
  dimensions jsonb not null default '{}'::jsonb,
  materials text,
  asset_urls text[] not null default '{}',
  notes text,
  status text not null default 'open' check (status in ('open', 'reviewing', 'quoted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.project_intakes enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'project_intakes' and policyname = 'Anyone can submit a project intake') then
    create policy "Anyone can submit a project intake" on public.project_intakes for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'project_intakes' and policyname = 'Admins manage project intakes') then
    create policy "Admins manage project intakes" on public.project_intakes for all using (public.is_admin()) with check (public.is_admin());
  end if;
end
$$;

drop trigger if exists project_intakes_set_updated_at on public.project_intakes;
create trigger project_intakes_set_updated_at
before update on public.project_intakes
for each row execute function public.set_updated_at();
