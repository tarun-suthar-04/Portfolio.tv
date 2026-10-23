create index if not exists projects_cover_media_idx on public.projects(cover_media_id);

drop policy if exists "admins manage categories" on public.categories;
create policy "admins insert categories" on public.categories for insert to authenticated with check ((select private.is_admin()));
create policy "admins update categories" on public.categories for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete categories" on public.categories for delete to authenticated using ((select private.is_admin()));

drop policy if exists "admins manage projects" on public.projects;
create policy "admins insert projects" on public.projects for insert to authenticated with check ((select private.is_admin()));
create policy "admins update projects" on public.projects for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete projects" on public.projects for delete to authenticated using ((select private.is_admin()));

drop policy if exists "admins manage project media" on public.project_media;
create policy "admins insert project media" on public.project_media for insert to authenticated with check ((select private.is_admin()));
create policy "admins update project media" on public.project_media for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete project media" on public.project_media for delete to authenticated using ((select private.is_admin()));
