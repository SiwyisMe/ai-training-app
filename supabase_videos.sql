-- Create a table to map exercise names to video URLs (Supabase Storage paths)
create table if not exists public.exercise_videos (
  id uuid default gen_random_uuid() primary key,
  exercise_name text not null unique,
  video_path text not null, -- Path in Supabase Storage
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.exercise_videos enable row level security;

-- Policy: Everyone can read videos
create policy "Everyone can read exercise videos"
  on public.exercise_videos for select
  using (true);

-- Policy: Authenticated users can insert (for caching generated videos)
create policy "Authenticated users can insert exercise videos"
  on public.exercise_videos for insert
  with check (auth.role() = 'authenticated');

-- Storage Bucket Configuration (if not exists)
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

-- Storage Policy: Everyone can read
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'videos' );

-- Storage Policy: Authenticated users can upload
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check ( bucket_id = 'videos' and auth.role() = 'authenticated' );
