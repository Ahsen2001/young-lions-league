import type {
  Tournament,
  TournamentSettings,
  TournamentStatus,
  TournamentFormat,
} from "@/types";
import { isFormatLocked } from "@/lib/validation/tournament";

export interface TournamentWithSettings extends Tournament {
  settings?: TournamentSettings;
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

// In-memory data store for initial development until Supabase DB tables are seeded
let MOCK_TOURNAMENTS: TournamentWithSettings[] = [
  {
    id: "trn-2025-01",
    name: "Young Lions Super League 2025",
    slug: "young-lions-super-league-2025",
    season: "2025",
    status: "TOURNAMENT_IN_PROGRESS",
    format: "GROUP_QUARTER_SEMI_FINAL",
    start_date: "2025-08-01",
    end_date: "2025-09-15",
    description: "The primary annual Oddamavadi league tournament.",
    created_at: "2025-07-01T10:00:00Z",
    updated_at: "2025-08-01T10:00:00Z",
    settings: {
      id: "set-2025-01",
      tournament_id: "trn-2025-01",
      num_groups: 4,
      teams_per_group: 4,
      max_teams: 16,
      teams_advancing_per_group: 2,
      points_for_win: 3,
      points_for_draw: 1,
      points_for_loss: 0,
      allow_draws_in_group: true,
      created_at: "2025-07-01T10:00:00Z",
      updated_at: "2025-07-01T10:00:00Z",
    },
  },
  {
    id: "trn-2025-02",
    name: "Oddamavadi Youth Cup 2025",
    slug: "oddamavadi-youth-cup-2025",
    season: "2025",
    status: "REGISTRATION_OPEN",
    format: "GROUP_SEMI_FINAL",
    start_date: "2025-10-01",
    end_date: "2025-10-20",
    description: "Knockout youth competition for local clubs.",
    created_at: "2025-07-15T10:00:00Z",
    updated_at: "2025-07-15T10:00:00Z",
    settings: {
      id: "set-2025-02",
      tournament_id: "trn-2025-02",
      num_groups: 2,
      teams_per_group: 4,
      max_teams: 8,
      teams_advancing_per_group: 2,
      points_for_win: 3,
      points_for_draw: 1,
      points_for_loss: 0,
      allow_draws_in_group: true,
      created_at: "2025-07-15T10:00:00Z",
      updated_at: "2025-07-15T10:00:00Z",
    },
  },
  {
    id: "trn-2024-01",
    name: "Young Lions Champions Trophy 2024",
    slug: "young-lions-champions-trophy-2024",
    season: "2024",
    status: "COMPLETED",
    format: "GROUP_FINAL",
    start_date: "2024-08-01",
    end_date: "2024-09-01",
    description: "Previous season tournament.",
    created_at: "2024-07-01T10:00:00Z",
    updated_at: "2024-09-01T10:00:00Z",
    settings: {
      id: "set-2024-01",
      tournament_id: "trn-2024-01",
      num_groups: 2,
      teams_per_group: 4,
      max_teams: 8,
      teams_advancing_per_group: 1,
      points_for_win: 3,
      points_for_draw: 1,
      points_for_loss: 0,
      allow_draws_in_group: true,
      created_at: "2024-07-01T10:00:00Z",
      updated_at: "2024-07-01T10:00:00Z",
    },
  },
];

export async function fetchTournaments(params?: {
  search?: string;
  status?: string;
}): Promise<TournamentWithSettings[]> {
  let list = [...MOCK_TOURNAMENTS];

  if (params?.search?.trim()) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.season.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
    );
  }

  if (params?.status && params.status !== "ALL") {
    list = list.filter((t) => t.status === params.status);
  }

  return list;
}

export async function fetchTournamentById(
  id: string
): Promise<TournamentWithSettings | null> {
  const found = MOCK_TOURNAMENTS.find((t) => t.id === id);
  return found ? { ...found } : null;
}

export async function createTournament(
  dto: CreateTournamentDTO
): Promise<TournamentWithSettings> {
  const id = `trn-${Date.now()}`;
  const slug = dto.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const newTournament: TournamentWithSettings = {
    id,
    name: dto.name,
    slug,
    season: dto.season,
    status: "DRAFT",
    format: dto.format,
    start_date: dto.start_date || null,
    end_date: dto.end_date || null,
    description: dto.description || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    settings: {
      id: `set-${Date.now()}`,
      tournament_id: id,
      num_groups: dto.num_groups,
      teams_per_group: dto.teams_per_group,
      max_teams: dto.max_teams,
      teams_advancing_per_group: dto.teams_advancing_per_group,
      points_for_win: dto.points_for_win,
      points_for_draw: dto.points_for_draw,
      points_for_loss: dto.points_for_loss,
      allow_draws_in_group: dto.allow_draws_in_group,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };

  MOCK_TOURNAMENTS.unshift(newTournament);
  return newTournament;
}

export async function updateTournament(
  id: string,
  dto: Partial<CreateTournamentDTO> & { status?: TournamentStatus }
): Promise<TournamentWithSettings> {
  const index = MOCK_TOURNAMENTS.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Tournament with ID ${id} not found.`);
  }

  const existing = MOCK_TOURNAMENTS[index];

  // Enforce format lock business rule
  if (dto.format && dto.format !== existing.format && isFormatLocked(existing.status)) {
    throw new Error(
      "Tournament format cannot be changed after official competition matches have begun."
    );
  }

  const updated: TournamentWithSettings = {
    ...existing,
    name: dto.name ?? existing.name,
    season: dto.season ?? existing.season,
    description: dto.description !== undefined ? dto.description : existing.description,
    start_date: dto.start_date !== undefined ? dto.start_date : existing.start_date,
    end_date: dto.end_date !== undefined ? dto.end_date : existing.end_date,
    format: dto.format ?? existing.format,
    status: dto.status ?? existing.status,
    updated_at: new Date().toISOString(),
    settings: existing.settings
      ? {
          ...existing.settings,
          num_groups: dto.num_groups ?? existing.settings.num_groups,
          teams_per_group: dto.teams_per_group ?? existing.settings.teams_per_group,
          max_teams: dto.max_teams ?? existing.settings.max_teams,
          teams_advancing_per_group:
            dto.teams_advancing_per_group ?? existing.settings.teams_advancing_per_group,
          points_for_win: dto.points_for_win ?? existing.settings.points_for_win,
          points_for_draw: dto.points_for_draw ?? existing.settings.points_for_draw,
          points_for_loss: dto.points_for_loss ?? existing.settings.points_for_loss,
          allow_draws_in_group:
            dto.allow_draws_in_group !== undefined
              ? dto.allow_draws_in_group
              : existing.settings.allow_draws_in_group,
          updated_at: new Date().toISOString(),
        }
      : undefined,
  };

  MOCK_TOURNAMENTS[index] = updated;
  return updated;
}

export async function deleteTournament(id: string): Promise<boolean> {
  const initialLength = MOCK_TOURNAMENTS.length;
  MOCK_TOURNAMENTS = MOCK_TOURNAMENTS.filter((t) => t.id !== id);
  return MOCK_TOURNAMENTS.length < initialLength;
}
