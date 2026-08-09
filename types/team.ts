/**
 * Team, Group, and Draw Domain Types
 */

export interface Team {
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
}

export interface TeamRef {
  id: string;
  name: string;
  short_name: string;
  logo_url: string | null;
}

export interface Group {
  id: string;
  tournament_id: string;
  name: string;
  max_teams: number;
  created_at: string;
  updated_at: string;
}

export interface GroupMembership {
  id: string;
  tournament_id: string;
  group_id: string;
  team_id: string;
  seed: number | null;
  allocated_at: string;
  team?: TeamRef;
}

export interface DrawRecord {
  id: string;
  tournament_id: string;
  team_id: string;
  group_id: string;
  pot_number: number | null;
  drawn_position: number | null;
  drawn_by: string | null;
  drawn_at: string;
  team?: TeamRef;
  group?: Group;
}

export interface DrawAuditLog {
  id: string;
  tournament_id: string;
  action: string;
  performed_by: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
}
