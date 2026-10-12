-- Run once in the Supabase SQL Editor.
create table if not exists public.products (
  id text primary key,
  data jsonb not null,
  deleted boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
-- No anon policies are required: only the server-side Vercel API uses service-role access.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images','product-images',true,4194304,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=4194304,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
