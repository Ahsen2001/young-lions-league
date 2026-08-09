-- ─── SPRINT 1 TASK 1: Complete Domain Database Schema Migration ─────────────────

-- 1. Create Domain Enums
CREATE TYPE public.tournament_status AS ENUM (
  'DRAFT',
  'REGISTRATION_OPEN',
  'READY_FOR_DRAW',
  'DRAW_IN_PROGRESS',
  'DRAW_COMPLETED',
  'DRAW_LOCKED',
  'FIXTURES_GENERATED',
  'TOURNAMENT_IN_PROGRESS',
  'GROUP_STAGE_COMPLETED',
  'KNOCKOUT_IN_PROGRESS',
  'FINAL_READY',
  'COMPLETED'
);

CREATE TYPE public.tournament_format AS ENUM (
  'GROUP_SEMI_FINAL',
  'GROUP_QUARTER_SEMI_FINAL',
  'GROUP_FINAL'
);

CREATE TYPE public.match_stage AS ENUM (
  'GROUP',
  'QUARTER_FINAL',
  'SEMI_FINAL',
  'FINAL'
);

CREATE TYPE public.match_status AS ENUM (
  'SCHEDULED',
  'LIVE',
  'COMPLETED',
  'POSTPONED',
  'CANCELLED'
);

-- 2. Tournaments Table
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  season TEXT NOT NULL,
  status public.tournament_status NOT NULL DEFAULT 'DRAFT',
  format public.tournament_format NOT NULL DEFAULT 'GROUP_QUARTER_SEMI_FINAL',
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tournament Settings Table
CREATE TABLE IF NOT EXISTS public.tournament_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID UNIQUE NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  num_groups INT NOT NULL DEFAULT 4,
  teams_per_group INT NOT NULL DEFAULT 4,
  max_teams INT NOT NULL DEFAULT 16,
  teams_advancing_per_group INT NOT NULL DEFAULT 2,
  points_for_win INT NOT NULL DEFAULT 3,
  points_for_draw INT NOT NULL DEFAULT 1,
  points_for_loss INT NOT NULL DEFAULT 0,
  allow_draws_in_group BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Venues Table
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  location TEXT,
  capacity INT,
  availability_start TIME,
  availability_end TIME,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  slug TEXT NOT NULL,
  logo_url TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_team_slug_per_tournament UNIQUE(tournament_id, slug),
  CONSTRAINT unique_team_name_per_tournament UNIQUE(tournament_id, name)
);

-- 6. Groups Table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  max_teams INT NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_group_name_per_tournament UNIQUE(tournament_id, name)
);

-- 7. Group Memberships Table
CREATE TABLE IF NOT EXISTS public.group_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  seed INT,
  allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_team_per_tournament_group UNIQUE(tournament_id, team_id),
  CONSTRAINT unique_team_in_group UNIQUE(group_id, team_id)
);

-- 8. Draw Records Table
CREATE TABLE IF NOT EXISTS public.draw_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  pot_number INT,
  drawn_position INT,
  drawn_by UUID REFERENCES public.profiles(id),
  drawn_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_draw_record_per_team UNIQUE(tournament_id, team_id)
);

-- 9. Draw Audit Logs Table
CREATE TABLE IF NOT EXISTS public.draw_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  performed_by UUID REFERENCES auth.users(id),
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  stage public.match_stage NOT NULL,
  status public.match_status NOT NULL DEFAULT 'SCHEDULED',
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  home_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  home_score INT DEFAULT 0,
  away_score INT DEFAULT 0,
  match_day INT,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_different_teams CHECK (home_team_id != away_team_id)
);

-- 11. Result Audit Logs Table
CREATE TABLE IF NOT EXISTS public.result_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  previous_home_score INT,
  previous_away_score INT,
  new_home_score INT,
  new_away_score INT,
  action TEXT NOT NULL,
  submitted_by UUID REFERENCES auth.users(id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Champions Table
CREATE TABLE IF NOT EXISTS public.champions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID UNIQUE NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  winner_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  runner_up_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  third_place_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  crowned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

-- ─── Group Capacity Protection Trigger ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.check_group_capacity()
RETURNS TRIGGER AS $$
DECLARE
  current_count INT;
  max_capacity INT;
BEGIN
  SELECT max_teams INTO max_capacity FROM public.groups WHERE id = NEW.group_id;
  SELECT COUNT(*) INTO current_count FROM public.group_memberships WHERE group_id = NEW.group_id;

  IF current_count >= max_capacity THEN
    RAISE EXCEPTION 'Group capacity limit (%) reached for group ID %', max_capacity, NEW.group_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER enforce_group_capacity
  BEFORE INSERT ON public.group_memberships
  FOR EACH ROW EXECUTE FUNCTION public.check_group_capacity();

-- ─── Database B-Tree Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_teams_tournament ON public.teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_groups_tournament ON public.groups(tournament_id);
CREATE INDEX IF NOT EXISTS idx_group_memberships_group ON public.group_memberships(group_id);
CREATE INDEX IF NOT EXISTS idx_group_memberships_team ON public.group_memberships(team_id);
CREATE INDEX IF NOT EXISTS idx_draw_records_tournament_team ON public.draw_records(tournament_id, team_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON public.matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_stage ON public.matches(stage);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_scheduled ON public.matches(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_matches_teams ON public.matches(home_team_id, away_team_id);

-- ─── Row Level Security (RLS) Baseline Policies ───────────────────────────────
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.champions ENABLE ROW LEVEL SECURITY;

-- Public read policies for all published competition data
CREATE POLICY "Public read tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Public read teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public read groups" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Public read group memberships" ON public.group_memberships FOR SELECT USING (true);
CREATE POLICY "Public read draw records" ON public.draw_records FOR SELECT USING (true);
CREATE POLICY "Public read matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Public read venues" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Public read champions" ON public.champions FOR SELECT USING (true);

-- Admin write policies
CREATE POLICY "Admin write tournaments" ON public.tournaments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Admin write teams" ON public.teams FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Admin write groups" ON public.groups FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Admin write group memberships" ON public.group_memberships FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Admin write draw records" ON public.draw_records FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Admin write matches" ON public.matches FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('ADMIN', 'MATCH_OFFICIAL'))
);
