/**
 * Team domain types.
 */

export interface Team {
  id: string;
  name: string;
  slug: string;
  short_name: string;
  logo_url: string | null;
  primary_color: string | null;
  home_venue: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Lightweight reference used in fixtures, draws, standings */
export interface TeamRef {
  id: string;
  name: string;
  short_name: string;
  logo_url: string | null;
}

export interface TournamentTeam {
  tournament_id: string;
  team_id: string;
  group_id: string | null;
  seed: number | null;
  registered_at: string;
  team: TeamRef;
}
