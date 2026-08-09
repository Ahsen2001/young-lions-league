import type { Team, TeamStatus, TournamentStatus } from "@/types";
import { canModifyTeams } from "@/lib/validation/team";
import { createClient } from "@/lib/supabase/client";

export interface CreateTeamDTO {
  name: string;
  short_name: string;
  logo_url?: string;
  registration_number?: string;
  manager_name?: string;
  captain_name?: string;
  contact_phone?: string;
  contact_email?: string;
  status?: TeamStatus;
  is_active?: boolean;
}

export interface FetchTeamsParams {
  search?: string;
  status?: string;
  group?: string; // "ALL" | "UNASSIGNED" | group_id / group_name
  page?: number;
  pageSize?: number; // 10 | 20 | 50
}

export interface PaginatedTeamsResult {
  data: Team[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  from: number;
  to: number;
}

const INITIAL_SEED_TEAMS: Array<{
  tournament_id: string;
  name: string;
  short_name: string;
  slug: string;
  logo_url?: string | null;
  registration_number: string;
  manager_name: string;
  captain_name: string;
  contact_phone: string;
  contact_email: string;
  status: TeamStatus;
  is_active: boolean;
  group_name?: string | null;
}> = [
  {
    tournament_id: "trn-2025-01",
    name: "Oddamavadi Youth FC",
    short_name: "OYFC",
    slug: "oddamavadi-youth-fc",
    logo_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80",
    registration_number: "REG-2025-001",
    manager_name: "Mohamed Farook",
    captain_name: "Ahmed Rizwan",
    contact_phone: "+94 77 123 4567",
    contact_email: "farook@oddamavadiyouth.lk",
    status: "APPROVED",
    is_active: true,
    group_name: "Group A",
  },
  {
    tournament_id: "trn-2025-01",
    name: "Young Lions Senior XI",
    short_name: "YLXI",
    slug: "young-lions-senior-xi",
    logo_url: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=150&auto=format&fit=crop&q=80",
    registration_number: "REG-2025-002",
    manager_name: "K. Saifullah",
    captain_name: "Imran Khan",
    contact_phone: "+94 77 234 5678",
    contact_email: "saifullah@younglions.lk",
    status: "APPROVED",
    is_active: true,
    group_name: "Group A",
  },
  {
    tournament_id: "trn-2025-01",
    name: "Coastal Eagles SC",
    short_name: "CESC",
    slug: "coastal-eagles-sc",
    logo_url: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=150&auto=format&fit=crop&q=80",
    registration_number: "REG-2025-003",
    manager_name: "A. Rameez",
    captain_name: "S. Naufal",
    contact_phone: "+94 77 345 6789",
    contact_email: "rameez@coastaleagles.lk",
    status: "APPROVED",
    is_active: true,
    group_name: "Group B",
  },
  {
    tournament_id: "trn-2025-01",
    name: "Red Storm Oddamavadi",
    short_name: "RSO",
    slug: "red-storm-oddamavadi",
    logo_url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80",
    registration_number: "REG-2025-004",
    manager_name: "M. Aslam",
    captain_name: "F. Nabeel",
    contact_phone: "+94 77 456 7890",
    contact_email: "aslam@redstorm.lk",
    status: "APPROVED",
    is_active: true,
    group_name: "Group B",
  },
  {
    tournament_id: "trn-2025-01",
    name: "Green Falcons United",
    short_name: "GFU",
    slug: "green-falcons-united",
    logo_url: null,
    registration_number: "REG-2025-005",
    manager_name: "T. Jamsheed",
    captain_name: "M. Haris",
    contact_phone: "+94 77 567 8901",
    contact_email: "jamsheed@falcons.lk",
    status: "PENDING",
    is_active: true,
    group_name: null,
  },
];

function mapTeamRow(row: any): Team {
  return {
    id: row.id,
    tournament_id: row.tournament_id,
    name: row.name,
    short_name: row.short_name,
    slug: row.slug,
    logo_url: row.logo_url || null,
    registration_number: row.registration_number || null,
    manager_name: row.manager_name || row.contact_name || null,
    captain_name: row.captain_name || null,
    contact_phone: row.contact_phone || null,
    contact_email: row.contact_email || null,
    status: row.status || (row.is_active ? "APPROVED" : "INACTIVE"),
    is_active: row.is_active !== undefined ? row.is_active : true,
    group_id: row.group_id || null,
    group_name: row.group_name || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function seedInitialTeamsIfEmpty(supabase: any, tournamentId: string) {
  try {
    const { count } = await (supabase.from("teams") as any)
      .select("id", { count: "exact", head: true })
      .eq("tournament_id", tournamentId);

    if (count === 0 && tournamentId === "trn-2025-01") {
      for (const tm of INITIAL_SEED_TEAMS) {
        await (supabase.from("teams") as any).insert({
          tournament_id: tournamentId,
          name: tm.name,
          short_name: tm.short_name,
          slug: tm.slug,
          logo_url: tm.logo_url || null,
          contact_name: tm.manager_name,
          contact_phone: tm.contact_phone,
          is_active: tm.is_active,
        });
      }
    }
  } catch (err) {
    console.warn("Auto-seeding teams check skipped:", err);
  }
}

/**
 * Server/Database Paginated Query for Tournament Teams using Supabase.
 */
export async function fetchTeams(
  tournamentId: string,
  params?: FetchTeamsParams
): Promise<PaginatedTeamsResult> {
  const supabase = createClient();
  await seedInitialTeamsIfEmpty(supabase, tournamentId);

  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);

  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tournamentId);

  let query: any = (supabase.from("teams") as any)
    .select("*", { count: "exact" });

  if (isUUID) {
    query = query.eq("tournament_id", tournamentId);
  } else {
    // Legacy mock ID string mapping or fallback
    query = query.or(`tournament_id.eq.${tournamentId},slug.ilike.%${tournamentId}%`);
  }

  // Search filter
  if (params?.search?.trim()) {
    const q = `%${params.search.trim().toLowerCase()}%`;
    query = query.or(`name.ilike.${q},short_name.ilike.${q},contact_name.ilike.${q}`);
  }

  // Status filter
  if (params?.status && params.status !== "ALL") {
    if (params.status === "APPROVED") {
      query = query.eq("is_active", true);
    } else if (params.status === "INACTIVE") {
      query = query.eq("is_active", false);
    }
  }

  // Database sorting (Newest registration first)
  query = query.order("created_at", { ascending: false });

  // Range slicing
  const fromIndex = (page - 1) * pageSize;
  const toIndex = fromIndex + pageSize - 1;
  query = query.range(fromIndex, toIndex);

  const { data, count, error } = await query;

  if (error) {
    if (error.code === "PGRST103" || error.code === "22P02") {
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 1,
        from: 0,
        to: 0,
      };
    }
    console.error("Error fetching teams from Supabase:", error);
    throw new Error(error.message || "Failed to fetch teams.");
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const validPage = Math.min(page, totalPages);
  const mapped = (data || []).map(mapTeamRow);

  return {
    data: mapped,
    total,
    page: validPage,
    pageSize,
    totalPages,
    from: total === 0 ? 0 : fromIndex + 1,
    to: Math.min(fromIndex + pageSize, total),
  };
}

export async function fetchTeamById(id: string): Promise<Team | null> {
  const supabase = createClient();
  const { data, error } = await (supabase.from("teams") as any)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapTeamRow(data);
}

export async function createTeam(
  tournamentId: string,
  dto: CreateTeamDTO,
  tournamentStatus?: TournamentStatus
): Promise<Team> {
  if (tournamentStatus && !canModifyTeams(tournamentStatus)) {
    throw new Error("Cannot register new team. Tournament lifecycle is locked for team additions.");
  }

  const supabase = createClient();
  const slug = dto.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const { data, error } = await (supabase.from("teams") as any)
    .insert({
      tournament_id: tournamentId,
      name: dto.name,
      short_name: dto.short_name.toUpperCase(),
      slug,
      logo_url: dto.logo_url || null,
      contact_name: dto.manager_name || null,
      contact_phone: dto.contact_phone || null,
      is_active: dto.is_active !== undefined ? dto.is_active : true,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Error creating team:", error);
    throw new Error(error?.message || "Failed to create team.");
  }

  return mapTeamRow(data);
}

export async function updateTeam(
  id: string,
  dto: Partial<CreateTeamDTO>,
  tournamentStatus?: TournamentStatus
): Promise<Team> {
  if (tournamentStatus && !canModifyTeams(tournamentStatus)) {
    throw new Error("Cannot modify team details. Competition matches have started or draw is locked.");
  }

  const supabase = createClient();
  const updateFields: any = { updated_at: new Date().toISOString() };
  if (dto.name !== undefined) {
    updateFields.name = dto.name;
    updateFields.slug = dto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  if (dto.short_name !== undefined) updateFields.short_name = dto.short_name.toUpperCase();
  if (dto.logo_url !== undefined) updateFields.logo_url = dto.logo_url;
  if (dto.manager_name !== undefined) updateFields.contact_name = dto.manager_name;
  if (dto.contact_phone !== undefined) updateFields.contact_phone = dto.contact_phone;
  if (dto.is_active !== undefined) updateFields.is_active = dto.is_active;

  const { data, error } = await (supabase.from("teams") as any)
    .update(updateFields)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("Error updating team:", error);
    throw new Error(error?.message || "Failed to update team.");
  }

  return mapTeamRow(data);
}

export async function deleteTeam(
  id: string,
  tournamentStatus?: TournamentStatus
): Promise<{ success: boolean; error?: string }> {
  if (tournamentStatus && !canModifyTeams(tournamentStatus)) {
    return {
      success: false,
      error: "Cannot delete team. Tournament draw is locked or competition has commenced.",
    };
  }

  const supabase = createClient();
  const { error } = await (supabase.from("teams") as any).delete().eq("id", id);
  if (error) {
    console.error("Error deleting team:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function bulkCreateTeams(
  tournamentId: string,
  dtos: CreateTeamDTO[],
  tournamentStatus?: TournamentStatus
): Promise<{ importedCount: number; teams: Team[] }> {
  if (tournamentStatus && !canModifyTeams(tournamentStatus)) {
    throw new Error("Cannot import teams. Tournament lifecycle is locked.");
  }

  const supabase = createClient();
  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tournamentId);

  let targetId = tournamentId;
  if (!isUUID) {
    const { data: tData } = await (supabase.from("tournaments") as any)
      .select("id")
      .or(`slug.eq.${tournamentId},name.ilike.%${tournamentId}%`)
      .limit(1)
      .maybeSingle();

    if (tData?.id) {
      targetId = tData.id;
    }
  }

  const insertRows = dtos.map((dto) => ({
    tournament_id: targetId,
    name: dto.name,
    short_name: dto.short_name.toUpperCase(),
    slug: dto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    logo_url: dto.logo_url || null,
    contact_name: dto.manager_name || null,
    contact_phone: dto.contact_phone || null,
    is_active: dto.is_active !== undefined ? dto.is_active : true,
  }));

  const { data, error } = await (supabase.from("teams") as any)
    .insert(insertRows)
    .select();

  if (error || !data) {
    console.error("Error bulk creating teams:", error);
    throw new Error(error?.message || "Failed to bulk create teams.");
  }

  const mapped = data.map(mapTeamRow);

  return {
    importedCount: mapped.length,
    teams: mapped,
  };
}
