/**
 * Tournament domain types.
 *
 * These are the canonical TypeScript shapes used throughout the app.
 * DB row types will be derived from Database["public"]["Tables"]["..."]["Row"]
 * once the schema is live.
 */

export type TournamentStatus =
  | "draft"
  | "registration"
  | "draw_pending"
  | "group_stage"
  | "knockout"
  | "completed"
  | "cancelled";

export type TournamentFormat =
  | "group_then_knockout"
  | "round_robin"
  | "knockout_only";

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  season: string;
  status: TournamentStatus;
  format: TournamentFormat;
  num_groups: number;
  teams_per_group: number;
  teams_advancing_per_group: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

/** Lightweight reference used in lists and dropdowns */
export interface TournamentRef {
  id: string;
  name: string;
  slug: string;
  status: TournamentStatus;
  season: string;
}
