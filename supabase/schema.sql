-- Preflight MVP schema
-- NOTE: These RLS policies allow anonymous access. Tighten before production.

create table if not exists preflight_checks (
  id uuid primary key default gen_random_uuid(),
  title text,
  raw_idea text not null,
  target_user_hint text,
  context text,
  clarification_answers jsonb default '{}'::jsonb,
  result jsonb,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_preflight_checks_updated_at on preflight_checks;

create trigger update_preflight_checks_updated_at
before update on preflight_checks
for each row
execute function update_updated_at_column();

-- MVP-only: allow anonymous insert/select/update.
-- IMPORTANT: These policies are for hackathon/demo use only.
-- Tighten or replace them before any production deployment.
alter table preflight_checks enable row level security;

-- Drop first so this script is safe to re-run
drop policy if exists "anon insert" on preflight_checks;
drop policy if exists "anon select" on preflight_checks;
drop policy if exists "anon update" on preflight_checks;

create policy "anon insert" on preflight_checks
  for insert to anon with check (true);

create policy "anon select" on preflight_checks
  for select to anon using (true);

-- Allows anyone to update any row — demo/hackathon only, not production-safe
create policy "anon update" on preflight_checks
  for update to anon using (true) with check (true);
