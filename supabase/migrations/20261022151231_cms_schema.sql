-- TARUN / VISUAL WORKS CMS. Apply in Supabase SQL Editor or via Supabase CLI.
create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function private.is_admin()
returns boolean language sql stable security definer
set search_path = '' as $$
  select exists(select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function private.is_admin() from public, anon;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '', year text, credits jsonb not null default '[]'::jsonb,
  category_id uuid not null references public.categories(id) on delete restrict,
  cover_media_id uuid,
  status text not null default 'draft' check (status in ('draft','published')),
  is_featured boolean not null default false, display_order integer not null default 0,
  published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  media_type text not null check (media_type in ('image','video')),
  storage_path text not null unique, thumbnail_path text,
  alt_text text not null default '', caption text, width integer check (width > 0), height integer check (height > 0),
  duration numeric check (duration >= 0), file_size bigint check (file_size >= 0), mime_type text,
  display_order integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.storage_cleanup_queue (
  id uuid primary key default gen_random_uuid(), storage_paths text[] not null,
  failure_message text not null, created_at timestamptz not null default now(), resolved_at timestamptz
);
alter table public.projects drop constraint if exists projects_cover_media_id_fkey;
alter table public.projects add constraint projects_cover_media_id_fkey foreign key (cover_media_id) references public.project_media(id) on delete set null deferrable initially deferred;
create or replace function private.validate_project_cover() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.cover_media_id is not null and not exists(select 1 from public.project_media m where m.id=new.cover_media_id and m.project_id=new.id) then
    raise exception 'Cover media must belong to this project';
  end if;
  return new;
end $$;
drop trigger if exists projects_cover_belongs_to_project on public.projects;
create trigger projects_cover_belongs_to_project before insert or update of cover_media_id on public.projects for each row execute function private.validate_project_cover();

create index if not exists projects_public_order_idx on public.projects(status, is_featured, display_order, published_at desc);
create index if not exists projects_category_idx on public.projects(category_id, display_order);
create index if not exists project_media_project_order_idx on public.project_media(project_id, display_order);

create or replace function private.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists categories_touch on public.categories;
create trigger categories_touch before update on public.categories for each row execute function private.touch_updated_at();
drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects for each row execute function private.touch_updated_at();

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.storage_cleanup_queue enable row level security;
revoke all on public.admin_users, public.categories, public.projects, public.project_media, public.storage_cleanup_queue from anon, authenticated;
grant select on public.admin_users to authenticated;
grant select on public.categories, public.projects, public.project_media to anon, authenticated;
grant select, insert, update, delete on public.categories, public.projects, public.project_media to authenticated;
create policy "admins manage admin users" on public.admin_users for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "public categories visible" on public.categories for select to anon, authenticated using (
  true
);
create policy "published projects visible" on public.projects for select to anon, authenticated using (status = 'published' or (select private.is_admin()));
create policy "published media visible" on public.project_media for select to anon, authenticated using (
  exists(select 1 from public.projects p where p.id = project_id and p.status = 'published') or (select private.is_admin())
);
create policy "admins manage categories" on public.categories for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins manage projects" on public.projects for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins manage project media" on public.project_media for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
grant select, insert, update, delete on public.storage_cleanup_queue to authenticated;
create policy "admins manage storage cleanup" on public.storage_cleanup_queue for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

insert into public.categories(name,slug,display_order) values ('Stories','stories',3),('Commercials','commercials',2),('Personal','personal',1) on conflict (slug) do nothing;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('portfolio-media','portfolio-media',false,524288000,array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm'])
on conflict (id) do update set public=false, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;
create policy "published or admin portfolio media read" on storage.objects for select to anon, authenticated using (
  bucket_id = 'portfolio-media' and ((select private.is_admin()) or exists(
    select 1 from public.project_media m join public.projects p on p.id=m.project_id
    where p.status='published' and (m.storage_path=name or m.thumbnail_path=name)
  ))
);
create policy "admins upload portfolio media" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-media' and (select private.is_admin()));
create policy "admins update portfolio media" on storage.objects for update to authenticated using (bucket_id = 'portfolio-media' and (select private.is_admin())) with check (bucket_id = 'portfolio-media' and (select private.is_admin()));
create policy "admins delete portfolio media" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-media' and (select private.is_admin()));

