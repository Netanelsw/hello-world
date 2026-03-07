-- TrustMap MVP Schema

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  username text unique not null,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null
);

-- Connections (follow system)
create table if not exists public.connections (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(follower_id, following_id),
  check (follower_id != following_id)
);

-- Recommendations
create table if not exists public.recommendations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  place_id text not null,
  place_name text not null,
  comment text,
  category text check (category in ('restaurant', 'cafe', 'doctor', 'service', 'store', 'other')) not null,
  created_at timestamptz default now() not null
);

-- Requests (ask for recommendation)
create table if not exists public.requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  created_at timestamptz default now() not null
);

-- Responses (answers to requests)
create table if not exists public.responses (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references public.requests(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  place_id text not null,
  place_name text not null,
  comment text,
  created_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_connections_follower on public.connections(follower_id);
create index if not exists idx_connections_following on public.connections(following_id);
create index if not exists idx_recommendations_user on public.recommendations(user_id);
create index if not exists idx_recommendations_place on public.recommendations(place_id);
create index if not exists idx_requests_user on public.requests(user_id);
create index if not exists idx_responses_request on public.responses(request_id);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.connections enable row level security;
alter table public.recommendations enable row level security;
alter table public.requests enable row level security;
alter table public.responses enable row level security;

-- Profiles: anyone authenticated can read, users can update their own
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Connections: anyone can read, users manage their own follows
create policy "Connections are viewable by everyone" on public.connections
  for select using (true);

create policy "Users can follow others" on public.connections
  for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow" on public.connections
  for delete using (auth.uid() = follower_id);

-- Recommendations: anyone can read, users manage their own
create policy "Recommendations are viewable by everyone" on public.recommendations
  for select using (true);

create policy "Users can add recommendations" on public.recommendations
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own recommendations" on public.recommendations
  for delete using (auth.uid() = user_id);

-- Requests: anyone can read, users manage their own
create policy "Requests are viewable by everyone" on public.requests
  for select using (true);

create policy "Users can create requests" on public.requests
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own requests" on public.requests
  for delete using (auth.uid() = user_id);

-- Responses: anyone can read, users manage their own
create policy "Responses are viewable by everyone" on public.responses
  for select using (true);

create policy "Users can add responses" on public.responses
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own responses" on public.responses
  for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    coalesce(new.raw_user_meta_data->>'preferred_username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
