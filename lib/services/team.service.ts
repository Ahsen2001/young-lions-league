import type { Team, TeamStatus, TournamentStatus } from "@/types";
import { canModifyTeams } from "@/lib/validation/team";

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

// Seeded dataset simulating teams database table per tournament
let MOCK_TEAMS: Team[] = [
  {
    id: "tm-001",
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
    group_id: "grp-a",
    group_name: "Group A",
    created_at: "2025-07-02T10:00:00Z",
    updated_at: "2025-07-02T10:00:00Z",
  },
  {
    id: "tm-002",
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
    group_id: "grp-a",
    group_name: "Group A",
    created_at: "2025-07-03T10:00:00Z",
    updated_at: "2025-07-03T10:00:00Z",
  },
  {
    id: "tm-003",
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
    group_id: "grp-b",
    group_name: "Group B",
    created_at: "2025-07-04T10:00:00Z",
    updated_at: "2025-07-04T10:00:00Z",
  },
  {
    id: "tm-004",
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
    group_id: "grp-b",
    group_name: "Group B",
    created_at: "2025-07-05T10:00:00Z",
    updated_at: "2025-07-05T10:00:00Z",
  },
  {
    id: "tm-005",
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
    group_id: null,
    group_name: null,
    created_at: "2025-07-06T10:00:00Z",
    updated_at: "2025-07-06T10:00:00Z",
  },
  {
    id: "tm-006",
    tournament_id: "trn-2025-02",
    name: "Oddamavadi Under-19 Stars",
    short_name: "U19S",
    slug: "oddamavadi-under-19-stars",
    logo_url: null,
    registration_number: "REG-2025-006",
    manager_name: "R. Shafeek",
    captain_name: "Z. Akram",
    contact_phone: "+94 77 678 9012",
    contact_email: "shafeek@stars.lk",
    status: "APPROVED",
    is_active: true,
    group_id: null,
    group_name: null,
    created_at: "2025-07-16T10:00:00Z",
    updated_at: "2025-07-16T10:00:00Z",
  },
];

/**
 * Server/Database Paginated Query for Tournament Teams.
 */
export async function fetchTeams(
  tournamentId: string,
  params?: FetchTeamsParams
): Promise<PaginatedTeamsResult> {
  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);

  let filtered = MOCK_TEAMS.filter((t) => t.tournament_id === tournamentId);

  // Search filter
  if (params?.search?.trim()) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.short_name.toLowerCase().includes(q) ||
        t.manager_name?.toLowerCase().includes(q) ||
        t.registration_number?.toLowerCase().includes(q)
    );
  }

  // Status filter
  if (params?.status && params.status !== "ALL") {
    filtered = filtered.filter((t) => t.status === params.status);
  }

  // Group filter
  if (params?.group && params.group !== "ALL") {
    if (params.group === "UNASSIGNED") {
      filtered = filtered.filter((t) => !t.group_id && !t.group_name);
    } else {
      filtered = filtered.filter(
        (t) => t.group_id === params.group || t.group_name === params.group
      );
    }
  }

  // Database sorting (Newest registration first)
  filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const validPage = Math.min(page, totalPages);

  const fromIndex = (validPage - 1) * pageSize;
  const toIndex = Math.min(fromIndex + pageSize, total);
  const data = filtered.slice(fromIndex, toIndex);

  return {
    data,
    total,
    page: validPage,
    pageSize,
    totalPages,
    from: total === 0 ? 0 : fromIndex + 1,
    to: toIndex,
  };
}

export async function fetchTeamById(id: string): Promise<Team | null> {
  const found = MOCK_TEAMS.find((t) => t.id === id);
  return found ? { ...found } : null;
}

export async function createTeam(
  tournamentId: string,
  dto: CreateTeamDTO,
  tournamentStatus?: TournamentStatus
): Promise<Team> {
  if (tournamentStatus && !canModifyTeams(tournamentStatus)) {
    throw new Error("Cannot register new team. Tournament lifecycle is locked for team additions.");
  }

  const id = `tm-${Date.now()}`;
  const slug = dto.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const regNum = dto.registration_number || `REG-2025-${Math.floor(100 + Math.random() * 900)}`;

  const newTeam: Team = {
    id,
    tournament_id: tournamentId,
    name: dto.name,
    short_name: dto.short_name.toUpperCase(),
    slug,
    logo_url: dto.logo_url || null,
    registration_number: regNum,
    manager_name: dto.manager_name || null,
    captain_name: dto.captain_name || null,
    contact_phone: dto.contact_phone || null,
    contact_email: dto.contact_email || null,
    status: dto.status || "APPROVED",
    is_active: dto.is_active !== undefined ? dto.is_active : true,
    group_id: null,   // STRICT: Group allocation happens ONLY through official draw
    group_name: null, // STRICT: Group allocation happens ONLY through official draw
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  MOCK_TEAMS.unshift(newTeam);
  return newTeam;
}

export async function updateTeam(
  id: string,
  dto: Partial<CreateTeamDTO>,
  tournamentStatus?: TournamentStatus
): Promise<Team> {
  if (tournamentStatus && !canModifyTeams(tournamentStatus)) {
    throw new Error("Cannot modify team details. Competition matches have started or draw is locked.");
  }

  const index = MOCK_TEAMS.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Team with ID ${id} not found.`);
  }

  const existing = MOCK_TEAMS[index];
  const updated: Team = {
    ...existing,
    name: dto.name ?? existing.name,
    short_name: dto.short_name ? dto.short_name.toUpperCase() : existing.short_name,
    logo_url: dto.logo_url !== undefined ? dto.logo_url : existing.logo_url,
    registration_number:
      dto.registration_number !== undefined ? dto.registration_number : existing.registration_number,
    manager_name: dto.manager_name !== undefined ? dto.manager_name : existing.manager_name,
    captain_name: dto.captain_name !== undefined ? dto.captain_name : existing.captain_name,
    contact_phone: dto.contact_phone !== undefined ? dto.contact_phone : existing.contact_phone,
    contact_email: dto.contact_email !== undefined ? dto.contact_email : existing.contact_email,
    status: dto.status ?? existing.status,
    is_active: dto.is_active !== undefined ? dto.is_active : existing.is_active,
    updated_at: new Date().toISOString(),
  };

  MOCK_TEAMS[index] = updated;
  return updated;
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

  const initialLength = MOCK_TEAMS.length;
  MOCK_TEAMS = MOCK_TEAMS.filter((t) => t.id !== id);
  if (MOCK_TEAMS.length < initialLength) {
    return { success: true };
  }
  return { success: false, error: "Team not found." };
}
