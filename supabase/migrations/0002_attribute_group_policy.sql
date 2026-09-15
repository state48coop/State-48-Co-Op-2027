-- Global option groups are administrative configuration and must not be public.
create policy "Admins manage attribute groups" on public.attribute_groups
  for all using (public.is_admin()) with check (public.is_admin());
