import type {
  TournamentStatus,
  TournamentFormat,
} from "@/types";
import { isFormatLocked } from "@/lib/validation/tournament";
import { createClient } from "@/lib/supabase/client";

export interface TournamentWithSettings {
  id: string;
  name: string;
  slug: string;
  season: string;
  status: TournamentStatus;
  format: TournamentFormat;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
  settings?: {
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
    created_at?: string;
    updated_at?: string;
  };
}

export interface CreateTournamentDTO {
  name: string;
  season: string;
  description?: string;
  logo_url?: string;
  start_date?: string;
  end_date?: string;
  format: TournamentFormat;
  num_groups: number;
  teams_per_group: number;
  max_teams: number;
  teams_advancing_per_group: number;
  points_for_win: number;
  points_for_draw: number;
  points_for_loss: number;
  allow_draws_in_group: boolean;
}

export interface FetchTournamentsParams {
  search?: string;
  status?: string;
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
}

export interface PaginatedTournamentsResult {
  data: TournamentWithSettings[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  from: number;
  to: number;
}

// Initial seed tournaments to populate database on first startup if empty
const INITIAL_SEED_TOURNAMENTS = [
  {
    name: "Young Lions Super League 2025",
    slug: "young-lions-super-league-2025",
    season: "2025",
    status: "TOURNAMENT_IN_PROGRESS",
    format: "GROUP_QUARTER_SEMI_FINAL",
    start_date: "2025-08-01",
    end_date: "2025-09-15",
    description: "The primary annual Oddamavadi league tournament.",
    settings: {
      num_groups: 4,
      teams_per_group: 4,
      max_teams: 16,
      teams_advancing_per_group: 2,
      points_for_win: 3,
      points_for_draw: 1,
      points_for_loss: 0,
      allow_draws_in_group: true,
    },
  },
  {
    name: "Oddamavadi Youth Cup 2025",
    slug: "oddamavadi-youth-cup-2025",
    season: "2025",
    status: "REGISTRATION_OPEN",
    format: "GROUP_SEMI_FINAL",
    start_date: "2025-10-01",
    end_date: "2025-10-20",
    description: "Knockout youth competition for local clubs.",
    settings: {
      num_groups: 2,
      teams_per_group: 4,
      max_teams: 8,
      teams_advancing_per_group: 2,
      points_for_win: 3,
      points_for_draw: 1,
      points_for_loss: 0,
      allow_draws_in_group: true,
    },
  },
  {
    name: "Young Lions Champions Trophy 2024",
    slug: "young-lions-champions-trophy-2024",
    season: "2024",
    status: "COMPLETED",
    format: "GROUP_FINAL",
    start_date: "2024-08-01",
    end_date: "2024-09-01",
    description: "Previous season tournament.",
    settings: {
      num_groups: 2,
      teams_per_group: 4,
      max_teams: 8,
      teams_advancing_per_group: 1,
      points_for_win: 3,
      points_for_draw: 1,
      points_for_loss: 0,
      allow_draws_in_group: true,
    },
  },
];

function formatTournamentRow(row: any): TournamentWithSettings {
  const settingsObj = Array.isArray(row.tournament_settings)
    ? row.tournament_settings[0]
    : row.tournament_settings || row.settings;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    season: row.season,
    status: row.status,
    format: row.format,
    start_date: row.start_date,
    end_date: row.end_date,
    description: row.description,
    logo_url: row.logo_url || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    settings: settingsObj
      ? {
          id: settingsObj.id,
          tournament_id: settingsObj.tournament_id,
          num_groups: settingsObj.num_groups,
          teams_per_group: settingsObj.teams_per_group,
          max_teams: settingsObj.max_teams,
          teams_advancing_per_group: settingsObj.teams_advancing_per_group,
          points_for_win: settingsObj.points_for_win,
          points_for_draw: settingsObj.points_for_draw,
          points_for_loss: settingsObj.points_for_loss,
          allow_draws_in_group: settingsObj.allow_draws_in_group,
          created_at: settingsObj.created_at,
          updated_at: settingsObj.updated_at,
        }
      : undefined,
  };
}

async function seedInitialTournamentsIfEmpty(supabase: any) {
  try {
    const { count } = await (supabase.from("tournaments") as any)
      .select("id", { count: "exact", head: true });

    if (count === 0) {
      for (const t of INITIAL_SEED_TOURNAMENTS) {
        const { data: newT, error: tErr } = await (supabase
          .from("tournaments") as any)
          .insert({
            name: t.name,
            slug: t.slug,
            season: t.season,
            status: t.status,
            format: t.format,
            start_date: t.start_date,
            end_date: t.end_date,
            description: t.description,
          })
          .select()
          .single();

        if (newT && !tErr) {
          await (supabase.from("tournament_settings") as any).insert({
            tournament_id: newT.id,
            ...t.settings,
          });
        }
      }
    }
  } catch (err) {
    console.warn("Auto-seeding check skipped:", err);
  }
}

/**
 * Database-backed paginated tournament query using Supabase.
 */
export async function fetchTournaments(
  params?: FetchTournamentsParams
): Promise<PaginatedTournamentsResult> {
  const supabase = createClient();

  // Ensure initial seed exists if DB is completely fresh
  await seedInitialTournamentsIfEmpty(supabase);

  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const sort = params?.sort || "newest";

  let query: any = (supabase.from("tournaments") as any)
    .select("*, tournament_settings(*)", { count: "exact" });

  // 1. Search filter
  if (params?.search?.trim()) {
    const q = `%${params.search.trim().toLowerCase()}%`;
    query = query.or(`name.ilike.${q},season.ilike.${q},description.ilike.${q}`);
  }

  // 2. Status filter
  if (params?.status && params.status !== "ALL") {
    query = query.eq("status", params.status);
  }

  // 3. Database sorting
  query = query.order("created_at", { ascending: sort === "oldest" });

  // 4. Server/Database range slicing
  const fromIndex = (page - 1) * pageSize;
  const toIndex = fromIndex + pageSize - 1;
  query = query.range(fromIndex, toIndex);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching tournaments from Supabase:", error);
    throw new Error(error.message || "Failed to fetch tournaments.");
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const validPage = Math.min(page, totalPages);
  const formattedData = (data || []).map(formatTournamentRow);

  return {
    data: formattedData,
    total,
    page: validPage,
    pageSize,
    totalPages,
    from: total === 0 ? 0 : fromIndex + 1,
    to: Math.min(fromIndex + pageSize, total),
  };
}

export async function fetchTournamentById(
  id: string
): Promise<TournamentWithSettings | null> {
  const supabase = createClient();
  const { data, error } = await (supabase.from("tournaments") as any)
    .select("*, tournament_settings(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return formatTournamentRow(data);
}

export async function createTournament(
  dto: CreateTournamentDTO
): Promise<TournamentWithSettings> {
  const supabase = createClient();
  const slug = dto.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // 1. Insert tournament row
  const { data: tournamentData, error: tErr } = await (supabase
    .from("tournaments") as any)
    .insert({
      name: dto.name,
      slug,
      season: dto.season,
      status: "DRAFT",
      format: dto.format,
      start_date: dto.start_date || null,
      end_date: dto.end_date || null,
      description: dto.description || null,
    })
    .select()
    .single();

  if (tErr || !tournamentData) {
    console.error("Error creating tournament:", tErr);
    throw new Error(tErr?.message || "Failed to create tournament.");
  }

  // 2. Insert settings row
  const { data: settingsData, error: sErr } = await (supabase
    .from("tournament_settings") as any)
    .insert({
      tournament_id: tournamentData.id,
      num_groups: dto.num_groups,
      teams_per_group: dto.teams_per_group,
      max_teams: dto.max_teams,
      teams_advancing_per_group: dto.teams_advancing_per_group,
      points_for_win: dto.points_for_win,
      points_for_draw: dto.points_for_draw,
      points_for_loss: dto.points_for_loss,
      allow_draws_in_group: dto.allow_draws_in_group,
    })
    .select()
    .single();

  if (sErr) {
    console.warn("Warning inserting settings:", sErr);
  }

  return formatTournamentRow({
    ...tournamentData,
    tournament_settings: settingsData,
  });
}

export async function updateTournament(
  id: string,
  dto: Partial<CreateTournamentDTO> & { status?: TournamentStatus }
): Promise<TournamentWithSettings> {
  const supabase = createClient();

  // Check format lock
  const existing = await fetchTournamentById(id);
  if (!existing) {
    throw new Error(`Tournament with ID ${id} not found.`);
  }

  if (dto.format && dto.format !== existing.format && isFormatLocked(existing.status)) {
    throw new Error(
      "Tournament format cannot be changed after official competition matches have begun."
    );
  }

  // Update tournament main fields
  const tUpdate: any = { updated_at: new Date().toISOString() };
  if (dto.name !== undefined) {
    tUpdate.name = dto.name;
    tUpdate.slug = dto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  if (dto.season !== undefined) tUpdate.season = dto.season;
  if (dto.description !== undefined) tUpdate.description = dto.description;
  if (dto.start_date !== undefined) tUpdate.start_date = dto.start_date;
  if (dto.end_date !== undefined) tUpdate.end_date = dto.end_date;
  if (dto.format !== undefined) tUpdate.format = dto.format;
  if (dto.status !== undefined) tUpdate.status = dto.status;

  const { data: updatedT, error: tErr } = await (supabase
    .from("tournaments") as any)
    .update(tUpdate)
    .eq("id", id)
    .select()
    .single();

  if (tErr) {
    console.error("Error updating tournament:", tErr);
    throw new Error(tErr.message || "Failed to update tournament.");
  }

  // Update settings fields if present
  let updatedSettings = existing.settings;
  const sUpdate: any = { updated_at: new Date().toISOString() };
  if (dto.num_groups !== undefined) sUpdate.num_groups = dto.num_groups;
  if (dto.teams_per_group !== undefined) sUpdate.teams_per_group = dto.teams_per_group;
  if (dto.max_teams !== undefined) sUpdate.max_teams = dto.max_teams;
  if (dto.teams_advancing_per_group !== undefined)
    sUpdate.teams_advancing_per_group = dto.teams_advancing_per_group;
  if (dto.points_for_win !== undefined) sUpdate.points_for_win = dto.points_for_win;
  if (dto.points_for_draw !== undefined) sUpdate.points_for_draw = dto.points_for_draw;
  if (dto.points_for_loss !== undefined) sUpdate.points_for_loss = dto.points_for_loss;
  if (dto.allow_draws_in_group !== undefined)
    sUpdate.allow_draws_in_group = dto.allow_draws_in_group;

  if (Object.keys(sUpdate).length > 1) {
    const { data: sData } = await (supabase
      .from("tournament_settings") as any)
      .update(sUpdate)
      .eq("tournament_id", id)
      .select()
      .single();

    if (sData) updatedSettings = sData;
  }

  return formatTournamentRow({
    ...updatedT,
    tournament_settings: updatedSettings,
  });
}

export async function deleteTournament(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await (supabase.from("tournaments") as any).delete().eq("id", id);
  if (error) {
    console.error("Error deleting tournament:", error);
    return false;
  }
  return true;
}
