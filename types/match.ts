/**
 * Match, Venue, Audit Log and Champions Domain Types
 */
import type { TeamRef } from "./team";

export type MatchStage = "GROUP" | "QUARTER_FINAL" | "SEMI_FINAL" | "FINAL";

export type MatchStatus =
  | "SCHEDULED"
  | "LIVE"
  | "COMPLETED"
  | "POSTPONED"
  | "CANCELLED";

export interface Venue {
  id: string;
  name: string;
  short_name: string;
  location: string | null;
  capacity: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  tournament_id: string;
  stage: MatchStage;
  status: MatchStatus;
  group_id: string | null;
  venue_id: string | null;
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
  match_day: number | null;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;

  // Resolved relation references
  home_team?: TeamRef;
  away_team?: TeamRef;
  venue?: Venue;
}

export interface ResultAuditLog {
  id: string;
  match_id: string;
  tournament_id: string;
  previous_home_score: number | null;
  previous_away_score: number | null;
  new_home_score: number | null;
  new_away_score: number | null;
  action: string;
  submitted_by: string | null;
  reason: string | null;
  created_at: string;
}

export interface Champion {
  id: string;
  tournament_id: string;
  winner_team_id: string;
  runner_up_team_id: string;
  third_place_team_id: string | null;
  crowned_at: string;
  notes: string | null;
  winner_team?: TeamRef;
  runner_up_team?: TeamRef;
  third_place_team?: TeamRef;
}
