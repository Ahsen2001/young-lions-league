/**
 * Database type definitions matching Supabase PostgreSQL schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "ADMIN" | "MATCH_OFFICIAL";

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

export type MatchStage = "GROUP" | "QUARTER_FINAL" | "SEMI_FINAL" | "FINAL";

export type MatchStatus =
  | "SCHEDULED"
  | "LIVE"
  | "COMPLETED"
  | "POSTPONED"
  | "CANCELLED";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      tournaments: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          season: string;
          status?: TournamentStatus;
          format?: TournamentFormat;
          start_date?: string | null;
          end_date?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          season?: string;
          status?: TournamentStatus;
          format?: TournamentFormat;
          start_date?: string | null;
          end_date?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tournament_settings: {
        Row: {
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
        };
        Insert: {
          id?: string;
          tournament_id: string;
          num_groups?: number;
          teams_per_group?: number;
          max_teams?: number;
          teams_advancing_per_group?: number;
          points_for_win?: number;
          points_for_draw?: number;
          points_for_loss?: number;
          allow_draws_in_group?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          num_groups?: number;
          teams_per_group?: number;
          max_teams?: number;
          teams_advancing_per_group?: number;
          points_for_win?: number;
          points_for_draw?: number;
          points_for_loss?: number;
          allow_draws_in_group?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      venues: {
        Row: {
          id: string;
          name: string;
          short_name: string;
          location: string | null;
          capacity: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          short_name: string;
          location?: string | null;
          capacity?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          short_name?: string;
          location?: string | null;
          capacity?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          tournament_id: string;
          name: string;
          short_name: string;
          slug: string;
          logo_url: string | null;
          contact_name: string | null;
          contact_phone: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          name: string;
          short_name: string;
          slug: string;
          logo_url?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          name?: string;
          short_name?: string;
          slug?: string;
          logo_url?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      groups: {
        Row: {
          id: string;
          tournament_id: string;
          name: string;
          max_teams: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          name: string;
          max_teams?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          name?: string;
          max_teams?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      group_memberships: {
        Row: {
          id: string;
          tournament_id: string;
          group_id: string;
          team_id: string;
          seed: number | null;
          allocated_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          group_id: string;
          team_id: string;
          seed?: number | null;
          allocated_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          group_id?: string;
          team_id?: string;
          seed?: number | null;
          allocated_at?: string;
        };
      };
      draw_records: {
        Row: {
          id: string;
          tournament_id: string;
          team_id: string;
          group_id: string;
          pot_number: number | null;
          drawn_position: number | null;
          drawn_by: string | null;
          drawn_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          team_id: string;
          group_id: string;
          pot_number?: number | null;
          drawn_position?: number | null;
          drawn_by?: string | null;
          drawn_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          team_id?: string;
          group_id?: string;
          pot_number?: number | null;
          drawn_position?: number | null;
          drawn_by?: string | null;
          drawn_at?: string;
        };
      };
      draw_audit_logs: {
        Row: {
          id: string;
          tournament_id: string;
          action: string;
          performed_by: string | null;
          payload: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          action: string;
          performed_by?: string | null;
          payload?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          action?: string;
          performed_by?: string | null;
          payload?: Json | null;
          created_at?: string;
        };
      };
      matches: {
        Row: {
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
        };
        Insert: {
          id?: string;
          tournament_id: string;
          stage: MatchStage;
          status?: MatchStatus;
          group_id?: string | null;
          venue_id?: string | null;
          home_team_id: string;
          away_team_id: string;
          home_score?: number;
          away_score?: number;
          match_day?: number | null;
          scheduled_at?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          stage?: MatchStage;
          status?: MatchStatus;
          group_id?: string | null;
          venue_id?: string | null;
          home_team_id?: string;
          away_team_id?: string;
          home_score?: number;
          away_score?: number;
          match_day?: number | null;
          scheduled_at?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      result_audit_logs: {
        Row: {
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
        };
        Insert: {
          id?: string;
          match_id: string;
          tournament_id: string;
          previous_home_score?: number | null;
          previous_away_score?: number | null;
          new_home_score?: number | null;
          new_away_score?: number | null;
          action: string;
          submitted_by?: string | null;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          tournament_id?: string;
          previous_home_score?: number | null;
          previous_away_score?: number | null;
          new_home_score?: number | null;
          new_away_score?: number | null;
          action?: string;
          submitted_by?: string | null;
          reason?: string | null;
          created_at?: string;
        };
      };
      champions: {
        Row: {
          id: string;
          tournament_id: string;
          winner_team_id: string;
          runner_up_team_id: string;
          third_place_team_id: string | null;
          crowned_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          winner_team_id: string;
          runner_up_team_id: string;
          third_place_team_id?: string | null;
          crowned_at?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          winner_team_id?: string;
          runner_up_team_id?: string;
          third_place_team_id?: string | null;
          crowned_at?: string;
          notes?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      tournament_status: TournamentStatus;
      tournament_format: TournamentFormat;
      match_stage: MatchStage;
      match_status: MatchStatus;
    };
  };
}
