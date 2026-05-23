create table if not exists profiles (
  id uuid primary key,
  email text,
  created_at timestamp default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text,
  file_url text,
  created_at timestamp default now()
);

create table if not exists study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  document_id uuid,
  title text,
  created_at timestamp default now()
);
