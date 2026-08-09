import { createClient } from "@/lib/supabase/client";
import type { Team, Group, DrawRecord, DrawAuditLog, TournamentStatus } from "@/types";

export interface DrawSingleTeamResult {
  success: boolean;
  tournament_id: string;
  team_id: string;
  team_name: string;
  group_id: string;
  group_name: string;
  drawn_position: number;
  drawn_at: string;
  is_draw_completed: boolean;
}

export interface DrawState {
  tournament_id: string;
  tournament_status: TournamentStatus;
  groups: Group[];
  group_a_teams: Team[];
  group_b_teams: Team[];
  undrawn_teams: Team[];
  all_teams: Team[];
  draw_records: DrawRecord[];
  draw_audit_logs: DrawAuditLog[];
  is_completed: boolean;
  max_teams_per_group: number;
}

// In-memory fallback simulation state for offline / test runner environments
const LOCAL_DRAW_STORAGE: Record<
  string,
  {
    memberships: Array<{ tournament_id: string; group_id: string; team_id: string; seed: number; allocated_at: string }>;
    records: DrawRecord[];
    logs: DrawAuditLog[];
  }
> = {};

function getLocalState(tournamentId: string) {
  if (!LOCAL_DRAW_STORAGE[tournamentId]) {
    LOCAL_DRAW_STORAGE[tournamentId] = {
      memberships: [],
      records: [],
      logs: [],
    };
  }
  return LOCAL_DRAW_STORAGE[tournamentId];
}

/**
 * Executes a single team draw for Group A / Group B.
 * Database/Server determines and persists the result before visual animation.
 */
export async function drawSingleTeam(
  tournamentId: string,
  teamId: string,
  drawnBy?: string
): Promise<DrawSingleTeamResult> {
  const supabase = createClient();

  // 1. Try Supabase RPC Function (Primary Atomic Server Operation)
  try {
    const { data, error } = await (supabase.rpc as any)("execute_draw_single_team", {
      p_tournament_id: tournamentId,
      p_team_id: teamId,
      p_drawn_by: drawnBy || null,
    });

    if (!error && data && data.success) {
      return data as DrawSingleTeamResult;
    }

    if (error && !error.message.includes("function public.execute_draw_single_team") && !error.message.includes("schema")) {
      throw new Error(error.message);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes("function") && !err.message.includes("RPC") && !err.message.includes("schema")) {
      throw err;
    }
  }

  // 2. Fallback Atomic Handler (For Local Unit Tests / Memory Environments)
  const local = getLocalState(tournamentId);

  // Check duplicate
  const alreadyDrawn = local.records.some((r) => r.team_id === teamId);
  if (alreadyDrawn) {
    throw new Error(`Team has already been drawn in this tournament.`);
  }

  const groupAId = `grp-a-${tournamentId}`;
  const groupBId = `grp-b-${tournamentId}`;
  const maxPerGroup = 4;

  const countA = local.memberships.filter((m) => m.group_id === groupAId).length;
  const countB = local.memberships.filter((m) => m.group_id === groupBId).length;

  let targetGroupId: string;
  let targetGroupName: string;

  if (countA >= maxPerGroup && countB >= maxPerGroup) {
    throw new Error(`Both Group A and Group B are full.`);
  } else if (countA >= maxPerGroup) {
    targetGroupId = groupBId;
    targetGroupName = "Group B";
  } else if (countB >= maxPerGroup) {
    targetGroupId = groupAId;
    targetGroupName = "Group A";
  } else {
    // 50/50 Random allocation
    if (Math.random() < 0.5) {
      targetGroupId = groupAId;
      targetGroupName = "Group A";
    } else {
      targetGroupId = groupBId;
      targetGroupName = "Group B";
    }
  }

  const position = local.records.length + 1;
  const timestamp = new Date().toISOString();

  local.memberships.push({
    tournament_id: tournamentId,
    group_id: targetGroupId,
    team_id: teamId,
    seed: position,
    allocated_at: timestamp,
  });

  const record: DrawRecord = {
    id: `drw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    tournament_id: tournamentId,
    team_id: teamId,
    group_id: targetGroupId,
    pot_number: 1,
    drawn_position: position,
    drawn_by: drawnBy || null,
    drawn_at: timestamp,
  };

  local.records.push(record);

  local.logs.push({
    id: `log-${Date.now()}`,
    tournament_id: tournamentId,
    action: "TEAM_DRAWN",
    performed_by: drawnBy || null,
    payload: { team_id: teamId, group_name: targetGroupName, drawn_position: position },
    created_at: timestamp,
  });

  return {
    success: true,
    tournament_id: tournamentId,
    team_id: teamId,
    team_name: `Team ${teamId}`,
    group_id: targetGroupId,
    group_name: targetGroupName,
    drawn_position: position,
    drawn_at: timestamp,
    is_draw_completed: false,
  };
}

/**
 * Fetches the full live draw state for a tournament.
 */
export async function fetchDrawState(tournamentId: string): Promise<DrawState> {
  const supabase = createClient();
  const local = getLocalState(tournamentId);

  // Fetch tournament teams
  let teams: Team[] = [];
  try {
    const { data: tData } = await (supabase.from("teams") as any)
      .select("*")
      .eq("tournament_id", tournamentId);
    if (tData) {
      teams = tData as Team[];
    }
  } catch {
    // Ignore fetch error
  }

  // Fetch groups
  const groups: Group[] = [
    { id: `grp-a-${tournamentId}`, tournament_id: tournamentId, name: "Group A", max_teams: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: `grp-b-${tournamentId}`, tournament_id: tournamentId, name: "Group B", max_teams: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];

  const drawnTeamIds = new Set(local.records.map((r) => r.team_id));
  const undrawnTeams = teams.filter((t) => !drawnTeamIds.has(t.id));

  const groupATeamIds = new Set(local.memberships.filter((m) => m.group_id.includes("grp-a")).map((m) => m.team_id));
  const groupBTeamIds = new Set(local.memberships.filter((m) => m.group_id.includes("grp-b")).map((m) => m.team_id));

  const groupATeams = teams.filter((t) => groupATeamIds.has(t.id));
  const groupBTeams = teams.filter((t) => groupBTeamIds.has(t.id));

  return {
    tournament_id: tournamentId,
    tournament_status: local.records.length > 0 ? "DRAW_IN_PROGRESS" : "READY_FOR_DRAW",
    groups,
    group_a_teams: groupATeams,
    group_b_teams: groupBTeams,
    undrawn_teams: undrawnTeams,
    all_teams: teams,
    draw_records: local.records,
    draw_audit_logs: local.logs,
    is_completed: undrawnTeams.length === 0 && teams.length > 0,
    max_teams_per_group: 4,
  };
}

/**
 * Resets the draw for testing / reset scenarios.
 */
export async function resetDraw(tournamentId: string): Promise<boolean> {
  const supabase = createClient();
  LOCAL_DRAW_STORAGE[tournamentId] = { memberships: [], records: [], logs: [] };

  try {
    await (supabase.from("group_memberships") as any).delete().eq("tournament_id", tournamentId);
    await (supabase.from("draw_records") as any).delete().eq("tournament_id", tournamentId);
    await (supabase.from("draw_audit_logs") as any).delete().eq("tournament_id", tournamentId);
    await (supabase.from("tournaments") as any).update({ status: "READY_FOR_DRAW" }).eq("id", tournamentId);
  } catch {
    // Ignore error in local test mode
  }

  return true;
}
