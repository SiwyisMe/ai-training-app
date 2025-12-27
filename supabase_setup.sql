-- Run this in the Supabase SQL Editor

create table if not exists body_measurements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  measurement_date timestamptz not null default now(),
  weight numeric not null,
  body_fat_percentage numeric,
  created_at timestamptz default now()
);

alter table body_measurements enable row level security;

create policy "Users can insert their own measurements"
  on body_measurements for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own measurements"
  on body_measurements for select
  using (auth.uid() = user_id);
