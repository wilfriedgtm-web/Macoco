-- ═══════════════════════════════════════════
-- MA'COCO — Schéma Supabase
-- ═══════════════════════════════════════════
create extension if not exists "uuid-ossp";

-- ── SALONS ──
create table salons (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid references auth.users(id) on delete cascade,
  nom           text not null,
  slug          text unique not null,
  tel           text,
  ville         text,
  adresse       text,
  description   text,
  couleur       text default '#6B1A2A',
  logo_url      text,
  cover_url     text,
  vitrine_active boolean default true,
  heures        text default '8h – 19h · Lun–Sam',
  insta         text,
  langue        text default 'fr' check (langue in ('fr','en')),
  created_at    timestamptz default now()
);
alter table salons enable row level security;
create policy "vitrine_pub" on salons for select using (vitrine_active = true);
create policy "owner_all"   on salons for all   using (owner_id = auth.uid());

-- ── COIFFEUSES / STAFF ──
create table coiffeuses (
  id          uuid primary key default uuid_generate_v4(),
  salon_id    uuid references salons(id) on delete cascade,
  nom         text not null,
  tel         text,
  role        text default 'coiffeuse',
  actif       boolean default true,
  created_at  timestamptz default now()
);
alter table coiffeuses enable row level security;
create policy "coif_owner" on coiffeuses for all using (
  salon_id in (select id from salons where owner_id = auth.uid())
);
create policy "coif_pub" on coiffeuses for select using (
  salon_id in (select id from salons where vitrine_active = true)
);

-- ── PRESTATIONS ──
create table prestations (
  id          uuid primary key default uuid_generate_v4(),
  salon_id    uuid references salons(id) on delete cascade,
  nom         text not null,
  description text,
  prix        integer not null default 0,
  duree       text,
  icon        text default '✂️',
  actif       boolean default true,
  ordre       integer default 0,
  created_at  timestamptz default now()
);
alter table prestations enable row level security;
create policy "presta_pub" on prestations for select using (
  actif = true and
  salon_id in (select id from salons where vitrine_active = true)
);
create policy "presta_owner" on prestations for all using (
  salon_id in (select id from salons where owner_id = auth.uid())
);

-- ── PHOTOS PRESTATIONS ──
create table presta_photos (
  id            uuid primary key default uuid_generate_v4(),
  prestation_id uuid references prestations(id) on delete cascade,
  url           text not null,
  ordre         integer default 0,
  created_at    timestamptz default now()
);
alter table presta_photos enable row level security;
create policy "photo_pub" on presta_photos for select using (
  prestation_id in (
    select p.id from prestations p
    join salons s on s.id = p.salon_id
    where p.actif = true and s.vitrine_active = true
  )
);
create policy "photo_owner" on presta_photos for all using (
  prestation_id in (
    select p.id from prestations p
    join salons s on s.id = p.salon_id
    where s.owner_id = auth.uid()
  )
);

-- ── RENDEZ-VOUS ──
create table rendez_vous (
  id              uuid primary key default uuid_generate_v4(),
  salon_id        uuid references salons(id) on delete cascade,
  prestation_id   uuid references prestations(id) on delete set null,
  coiffeuse_id    uuid references coiffeuses(id) on delete set null,
  -- Cliente
  client_nom      text not null,
  client_tel      text not null,
  -- Détails
  date            date not null,
  heure           text not null,
  nb_personnes    integer default 1,
  message         text,
  -- Statut
  statut          text default 'en_attente'
    check (statut in ('en_attente','confirme','en_cours','fait','annule')),
  -- File d'attente
  queue_pos       integer,
  prevenu_at      timestamptz,
  -- Financier
  montant         integer default 0,
  encaisse        boolean default false,
  -- Source
  source          text default 'direct',
  -- Timestamps
  confirme_at     timestamptz,
  fait_at         timestamptz,
  created_at      timestamptz default now()
);
alter table rendez_vous enable row level security;
-- Insertion publique (vitrine)
create policy "rdv_insert_pub" on rendez_vous for insert with check (
  salon_id in (select id from salons where vitrine_active = true)
);
-- Owner voit tout
create policy "rdv_owner" on rendez_vous for all using (
  salon_id in (select id from salons where owner_id = auth.uid())
);

-- ── AVIS ──
create table avis (
  id            uuid primary key default uuid_generate_v4(),
  salon_id      uuid references salons(id) on delete cascade,
  rdv_id        uuid references rendez_vous(id) on delete set null,
  client_nom    text,
  note          integer check (note between 1 and 5),
  texte         text,
  visible       boolean default true,
  created_at    timestamptz default now()
);
alter table avis enable row level security;
create policy "avis_pub" on avis for select using (
  visible = true and
  salon_id in (select id from salons where vitrine_active = true)
);
create policy "avis_owner" on avis for all using (
  salon_id in (select id from salons where owner_id = auth.uid())
);

-- ── INDEXES ──
create index on salons(slug);
create index on prestations(salon_id);
create index on rendez_vous(salon_id);
create index on rendez_vous(statut);
create index on rendez_vous(date);
create index on coiffeuses(salon_id);

-- ── STORAGE ──
-- Créer manuellement dans Supabase Dashboard :
-- Bucket "presta-photos"  → public = true
-- Bucket "salon-covers"   → public = true
-- Bucket "salon-logos"    → public = true
