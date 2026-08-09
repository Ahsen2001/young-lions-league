/**
 * Tournament Domain & Schema Types
 */

export type TournamentStatus =
  | "DRAFT"
  | "REGISTRATION_OPEN"
  | "READY_FOR_DRAW"
  | "DRAW_IN_PROGRESS"
  | "DRAW_COMPLETED"
  | "DRAW_LOCKED"
  | "FIXTURES_GENERATED"
  | "TOURNAMENT_IN_PROGRESS"
  | "GROUP_STAGE_COMPLETED"
  | "KNOCKOUT_IN_PROGRESS"
  | "FINAL_READY"
  | "COMPLETED";

export type TournamentFormat =
  | "GROUP_SEMI_FINAL"
  | "GROUP_QUARTER_SEMI_FINAL"
  | "GROUP_FINAL";

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  season: string;
  status: TournamentStatus;
  format: TournamentFormat;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface TournamentSettings {
  id: string;
  tournament_id: string;
  num_groups: number;
  teams_per_group: number;
  max_teams: number;
  teams_advancing_per_group: number;
  points_for_win: number;
  points_for_draw: number;
  points_for_loss: number;
  allow_draws_in_group: boolean;
  created_at: string;
  updated_at: string;
}

/** Lightweight reference used in UI dropdowns and headers */
export interface TournamentRef {
  id: string;
  name: string;
  slug: string;
  status: TournamentStatus;
  season: string;
}
