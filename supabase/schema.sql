-- Pokémon Champions & Sleep Toolkit — esquema de base de datos (Supabase / PostgreSQL)
-- Ejecutar esto en el SQL Editor de tu proyecto Supabase. Seguro de correr
-- completo más de una vez (tablas, columnas y políticas usan "if not
-- exists"/"drop if exists" antes de crear).

-- =========================================================================
-- Tablas de referencia compartidas (mismo contenido para todos los usuarios,
-- no llevan user_id): catálogo de especies de Sleep y caché del Meta de
-- Champions. Se leen con la anon key; solo se escriben con la service_role
-- key (seed manual o el futuro crawler de la Fase 9), nunca desde el cliente.
-- =========================================================================

create table if not exists sleep_pokemon_species (
  id serial primary key,
  name varchar(50) not null unique,
  specialty varchar(20) not null check (specialty in ('Berries', 'Ingredients', 'Skills')),
  berry_type varchar(30) not null,
  main_skill varchar(50) not null,
  base_carry_limit int not null,
  base_frequency_seconds int not null,
  -- Añadidos para el cálculo real de RP (Fase 7): % base de ingrediente y de
  -- activación de skill, y posición en la línea evolutiva (necesaria porque
  -- el carry limit y la frecuencia reales dependen de cuántas evoluciones
  -- tiene detrás/por delante, no solo de la especie en sí).
  ingredient_percentage numeric(5,2),
  skill_percentage numeric(5,2),
  previous_evolutions int not null default 0,
  remaining_evolutions int not null default 0
);

alter table sleep_pokemon_species add column if not exists ingredient_percentage numeric(5,2);
alter table sleep_pokemon_species add column if not exists skill_percentage numeric(5,2);
alter table sleep_pokemon_species add column if not exists previous_evolutions int not null default 0;
alter table sleep_pokemon_species add column if not exists remaining_evolutions int not null default 0;

alter table sleep_pokemon_species enable row level security;

drop policy if exists "select_species_public" on sleep_pokemon_species;
create policy "select_species_public"
  on sleep_pokemon_species for select
  using (true);

create table if not exists champions_meta_cache (
  id serial primary key,
  updated_at timestamptz not null default now(),
  rank_position int not null,
  pokemon_name varchar(50) not null,
  common_moves jsonb,
  common_items jsonb,
  usage_percentage numeric(5,2)
);

alter table champions_meta_cache enable row level security;

drop policy if exists "select_meta_public" on champions_meta_cache;
create policy "select_meta_public"
  on champions_meta_cache for select
  using (true);

-- =========================================================================
-- Tablas del box de cada usuario: llevan user_id y RLS para que cada quien
-- solo vea y edite lo suyo (mismo patrón que ProyectoTablaPokedex).
-- =========================================================================

create table if not exists user_sleep_box (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  species_id int references sleep_pokemon_species(id),
  nickname varchar(50),
  level int not null default 1,
  current_rp int,
  ingredient_a varchar(50),
  ingredient_b varchar(50),
  ingredient_c varchar(50),
  subskill_10 varchar(50),
  subskill_25 varchar(50),
  subskill_50 varchar(50),
  -- Nombrados por el nivel real de desbloqueo desde el parche 3.6.0
  -- (75->70, 100->80). Ver nota en src/data/sleepData.js.
  subskill_70 varchar(50),
  subskill_80 varchar(50),
  nature varchar(30),
  evaluation_score numeric(5,2),
  is_trained boolean not null default false,
  created_at timestamptz not null default now(),
  -- Añadidos para el cálculo real de Carry Limit y RP (Fase 7): nivel de
  -- Ribbon (cinta de amistad, 0-4, otorga carry limit extra y en Pokémon no
  -- evolucionados también más velocidad de ayuda) y nivel del Main Skill
  -- (independiente del nivel del Pokémon, sube con Skill Candy).
  ribbon_level int not null default 0 check (ribbon_level between 0 and 4),
  skill_level int not null default 1
);

alter table user_sleep_box add column if not exists ribbon_level int not null default 0;
alter table user_sleep_box add column if not exists skill_level int not null default 1;

-- Si la tabla ya existía de antes del parche 3.6.0, todavía tiene las
-- columnas viejas subskill_75/subskill_100 (create table if not exists no
-- las toca) — se renombran para no perder datos ya cargados.
do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'user_sleep_box' and column_name = 'subskill_75') then
    alter table user_sleep_box rename column subskill_75 to subskill_70;
  end if;
  if exists (select 1 from information_schema.columns where table_name = 'user_sleep_box' and column_name = 'subskill_100') then
    alter table user_sleep_box rename column subskill_100 to subskill_80;
  end if;
end $$;

alter table user_sleep_box add column if not exists subskill_70 varchar(50);
alter table user_sleep_box add column if not exists subskill_80 varchar(50);

alter table user_sleep_box enable row level security;

drop policy if exists "select_own_sleep_box" on user_sleep_box;
create policy "select_own_sleep_box"
  on user_sleep_box for select
  using (auth.uid() = user_id);

drop policy if exists "insert_own_sleep_box" on user_sleep_box;
create policy "insert_own_sleep_box"
  on user_sleep_box for insert
  with check (auth.uid() = user_id);

drop policy if exists "update_own_sleep_box" on user_sleep_box;
create policy "update_own_sleep_box"
  on user_sleep_box for update
  using (auth.uid() = user_id);

drop policy if exists "delete_own_sleep_box" on user_sleep_box;
create policy "delete_own_sleep_box"
  on user_sleep_box for delete
  using (auth.uid() = user_id);

create index if not exists idx_sleep_box_user on user_sleep_box (user_id);

-- user_champions_box: se agregan `format` y `user_id`, que el spec funcional
-- de la sección 2.1 pide pero el modelo de datos original no incluía.
create table if not exists user_champions_box (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  species varchar(50) not null,
  format varchar(50),
  nickname varchar(50),
  nature varchar(30),
  ability varchar(50),
  held_item varchar(50),
  tera_type varchar(30),
  move_1 varchar(50),
  move_2 varchar(50),
  move_3 varchar(50),
  move_4 varchar(50),
  ev_spread jsonb,
  iv_spread jsonb,
  created_at timestamptz not null default now()
);

alter table user_champions_box enable row level security;

drop policy if exists "select_own_champions_box" on user_champions_box;
create policy "select_own_champions_box"
  on user_champions_box for select
  using (auth.uid() = user_id);

drop policy if exists "insert_own_champions_box" on user_champions_box;
create policy "insert_own_champions_box"
  on user_champions_box for insert
  with check (auth.uid() = user_id);

drop policy if exists "update_own_champions_box" on user_champions_box;
create policy "update_own_champions_box"
  on user_champions_box for update
  using (auth.uid() = user_id);

drop policy if exists "delete_own_champions_box" on user_champions_box;
create policy "delete_own_champions_box"
  on user_champions_box for delete
  using (auth.uid() = user_id);

create index if not exists idx_champions_box_user on user_champions_box (user_id);
