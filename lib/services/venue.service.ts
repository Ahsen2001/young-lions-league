import type { Venue } from "@/types";

export interface CreateVenueDTO {
  name: string;
  short_name: string;
  location?: string;
  capacity?: number | null;
  availability_start?: string;
  availability_end?: string;
  is_active?: boolean;
}

export interface FetchVenuesParams {
  search?: string;
  status?: "ALL" | "ACTIVE" | "INACTIVE";
  page?: number;
  pageSize?: number;
}

export interface PaginatedVenuesResult {
  data: Venue[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  from: number;
  to: number;
}

// Seeded dataset simulating venues table in database
let MOCK_VENUES: Venue[] = [
  {
    id: "ven-001",
    name: "Oddamavadi Central Stadium Ground",
    short_name: "Central Pitch",
    location: "Main Street, Oddamavadi",
    capacity: 2500,
    availability_start: "07:00",
    availability_end: "18:00",
    is_active: true,
    created_at: "2025-01-01T10:00:00Z",
    updated_at: "2025-01-01T10:00:00Z",
  },
  {
    id: "ven-002",
    name: "Young Lions Youth Sports Complex",
    short_name: "Youth Complex",
    location: "Hospital Road, Oddamavadi",
    capacity: 1200,
    availability_start: "08:00",
    availability_end: "19:00",
    is_active: true,
    created_at: "2025-01-05T10:00:00Z",
    updated_at: "2025-01-05T10:00:00Z",
  },
  {
    id: "ven-003",
    name: "Oddamavadi Beachside Football Arena",
    short_name: "Beachside Ground",
    location: "Coastal Road, Oddamavadi",
    capacity: 800,
    availability_start: "06:00",
    availability_end: "17:30",
    is_active: true,
    created_at: "2025-01-10T10:00:00Z",
    updated_at: "2025-01-10T10:00:00Z",
  },
  {
    id: "ven-004",
    name: "Oddamavadi National School Field",
    short_name: "School Ground",
    location: "School Avenue, Oddamavadi",
    capacity: 600,
    availability_start: "14:00",
    availability_end: "18:00",
    is_active: false,
    created_at: "2025-01-12T10:00:00Z",
    updated_at: "2025-01-12T10:00:00Z",
  },
];

/**
 * Server/Database Paginated Venue query function.
 */
export async function fetchVenues(
  params?: FetchVenuesParams
): Promise<PaginatedVenuesResult> {
  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);

  let filtered = [...MOCK_VENUES];

  // 1. Search filter (name or location)
  if (params?.search?.trim()) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.short_name.toLowerCase().includes(q) ||
        v.location?.toLowerCase().includes(q)
    );
  }

  // 2. Status filter
  if (params?.status && params.status !== "ALL") {
    const activeReq = params.status === "ACTIVE";
    filtered = filtered.filter((v) => v.is_active === activeReq);
  }

  // 3. Database sorting
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

export async function fetchVenueById(id: string): Promise<Venue | null> {
  const found = MOCK_VENUES.find((v) => v.id === id);
  return found ? { ...found } : null;
}

export async function createVenue(dto: CreateVenueDTO): Promise<Venue> {
  const id = `ven-${Date.now()}`;
  const newVenue: Venue = {
    id,
    name: dto.name,
    short_name: dto.short_name,
    location: dto.location || null,
    capacity: dto.capacity ?? null,
    availability_start: dto.availability_start || null,
    availability_end: dto.availability_end || null,
    is_active: dto.is_active !== undefined ? dto.is_active : true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  MOCK_VENUES.unshift(newVenue);
  return newVenue;
}

export async function updateVenue(id: string, dto: Partial<CreateVenueDTO>): Promise<Venue> {
  const index = MOCK_VENUES.findIndex((v) => v.id === id);
  if (index === -1) {
    throw new Error(`Venue with ID ${id} not found.`);
  }

  const existing = MOCK_VENUES[index];
  const updated: Venue = {
    ...existing,
    name: dto.name ?? existing.name,
    short_name: dto.short_name ?? existing.short_name,
    location: dto.location !== undefined ? dto.location : existing.location,
    capacity: dto.capacity !== undefined ? dto.capacity : existing.capacity,
    availability_start:
      dto.availability_start !== undefined ? dto.availability_start : existing.availability_start,
    availability_end:
      dto.availability_end !== undefined ? dto.availability_end : existing.availability_end,
    is_active: dto.is_active !== undefined ? dto.is_active : existing.is_active,
    updated_at: new Date().toISOString(),
  };

  MOCK_VENUES[index] = updated;
  return updated;
}

export async function deleteVenue(id: string): Promise<{ success: boolean; error?: string }> {
  const initialLength = MOCK_VENUES.length;
  MOCK_VENUES = MOCK_VENUES.filter((v) => v.id !== id);
  if (MOCK_VENUES.length < initialLength) {
    return { success: true };
  }
  return { success: false, error: "Venue not found." };
}
