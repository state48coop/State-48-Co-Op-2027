alter table public.products
  add column if not exists short_description text not null default '',
  add column if not exists collection text not null default 'Workshop Releases',
  add column if not exists product_type text not null default 'Ready-to-order',
  add column if not exists archived boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public can view product images') then
    create policy "Public can view product images" on storage.objects for select using (bucket_id = 'product-images');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins upload product images') then
    create policy "Admins upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins update product images') then
    create policy "Admins update product images" on storage.objects for update using (bucket_id = 'product-images' and public.is_admin()) with check (bucket_id = 'product-images' and public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins delete product images') then
    create policy "Admins delete product images" on storage.objects for delete using (bucket_id = 'product-images' and public.is_admin());
  end if;
end
$$;
