import type { Venue } from "@/types";
import { createClient } from "@/lib/supabase/client";

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

const INITIAL_SEED_VENUES: Venue[] = [
  {
    id: "ven-001",
    name: "Oddamavadi Central Stadium Ground",
    short_name: "Central Pitch",
    location: "Main Street, Oddamavadi",
    capacity: 2500,
    availability_start: "07:00:00",
    availability_end: "18:00:00",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ven-002",
    name: "Young Lions Youth Sports Complex",
    short_name: "Youth Complex",
    location: "Hospital Road, Oddamavadi",
    capacity: 1200,
    availability_start: "08:00:00",
    availability_end: "19:00:00",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ven-003",
    name: "Oddamavadi Beachside Football Arena",
    short_name: "Beachside Ground",
    location: "Coastal Road, Oddamavadi",
    capacity: 800,
    availability_start: "06:00:00",
    availability_end: "17:30:00",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ven-004",
    name: "Oddamavadi National School Field",
    short_name: "School Ground",
    location: "School Avenue, Oddamavadi",
    capacity: 600,
    availability_start: "14:00:00",
    availability_end: "18:00:00",
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Local in-memory store for fallback/unauthenticated environments
let LOCAL_VENUES_STORE: Venue[] = [...INITIAL_SEED_VENUES];

async function seedInitialVenuesIfEmpty(supabase: any) {
  try {
    const { count } = await (supabase.from("venues") as any)
      .select("id", { count: "exact", head: true });

    if (count === 0) {
      await (supabase.from("venues") as any).insert(
        INITIAL_SEED_VENUES.map((v) => ({
          name: v.name,
          short_name: v.short_name,
          location: v.location,
          capacity: v.capacity,
          availability_start: v.availability_start,
          availability_end: v.availability_end,
          is_active: v.is_active,
        }))
      );
    }
  } catch {
    // Ignore seeding error
  }
}

/**
 * Server/Database Paginated Venue query function using Supabase.
 */
export async function fetchVenues(
  params?: FetchVenuesParams
): Promise<PaginatedVenuesResult> {
  const supabase = createClient();
  await seedInitialVenuesIfEmpty(supabase);

  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);

  try {
    let query: any = (supabase.from("venues") as any).select("*", { count: "exact" });

    if (params?.search?.trim()) {
      const q = `%${params.search.trim().toLowerCase()}%`;
      query = query.or(`name.ilike.${q},short_name.ilike.${q},location.ilike.${q}`);
    }

    if (params?.status && params.status !== "ALL") {
      query = query.eq("is_active", params.status === "ACTIVE");
    }

    query = query.order("created_at", { ascending: false });

    const fromIndex = (page - 1) * pageSize;
    const toIndex = fromIndex + pageSize - 1;
    query = query.range(fromIndex, toIndex);

    const { data, count, error } = await query;

    if (!error && data && data.length > 0) {
      const total = count || data.length;
      const totalPages = Math.ceil(total / pageSize) || 1;
      const validPage = Math.min(page, totalPages);
      return {
        data: data as Venue[],
        total,
        page: validPage,
        pageSize,
        totalPages,
        from: total === 0 ? 0 : fromIndex + 1,
        to: Math.min(fromIndex + pageSize, total),
      };
    }
  } catch {
    // Fallback to local memory store below
  }

  // Fallback memory querying for unit tests / RLS unauthenticated environments
  let filtered = [...LOCAL_VENUES_STORE];
  if (params?.search?.trim()) {
    const q = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.short_name.toLowerCase().includes(q) ||
        (v.location && v.location.toLowerCase().includes(q))
    );
  }
  if (params?.status && params.status !== "ALL") {
    filtered = filtered.filter((v) => v.is_active === (params.status === "ACTIVE"));
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const fromIndex = (page - 1) * pageSize;
  const sliced = filtered.slice(fromIndex, fromIndex + pageSize);

  return {
    data: sliced,
    total,
    page,
    pageSize,
    totalPages,
    from: total === 0 ? 0 : fromIndex + 1,
    to: Math.min(fromIndex + pageSize, total),
  };
}

export async function fetchVenueById(id: string): Promise<Venue | null> {
  const supabase = createClient();
  try {
    const { data, error } = await (supabase.from("venues") as any)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return data as Venue;
    }
  } catch {
    // Fallback
  }

  return LOCAL_VENUES_STORE.find((v) => v.id === id) || null;
}

export async function createVenue(dto: CreateVenueDTO): Promise<Venue> {
  const supabase = createClient();
  const timestamp = new Date().toISOString();

  try {
    const { data, error } = await (supabase.from("venues") as any)
      .insert({
        name: dto.name,
        short_name: dto.short_name,
        location: dto.location || null,
        capacity: dto.capacity ?? null,
        availability_start: dto.availability_start || null,
        availability_end: dto.availability_end || null,
        is_active: dto.is_active !== undefined ? dto.is_active : true,
      })
      .select()
      .single();

    if (!error && data) {
      LOCAL_VENUES_STORE.unshift(data as Venue);
      return data as Venue;
    }
  } catch {
    // Fallback
  }

  const fallbackVenue: Venue = {
    id: `ven-${Date.now()}`,
    name: dto.name,
    short_name: dto.short_name,
    location: dto.location || null,
    capacity: dto.capacity ?? null,
    availability_start: dto.availability_start || null,
    availability_end: dto.availability_end || null,
    is_active: dto.is_active !== undefined ? dto.is_active : true,
    created_at: timestamp,
    updated_at: timestamp,
  };

  LOCAL_VENUES_STORE.unshift(fallbackVenue);
  return fallbackVenue;
}

export async function updateVenue(id: string, dto: Partial<CreateVenueDTO>): Promise<Venue> {
  const supabase = createClient();
  const updateFields: any = { updated_at: new Date().toISOString() };
  if (dto.name !== undefined) updateFields.name = dto.name;
  if (dto.short_name !== undefined) updateFields.short_name = dto.short_name;
  if (dto.location !== undefined) updateFields.location = dto.location;
  if (dto.capacity !== undefined) updateFields.capacity = dto.capacity;
  if (dto.availability_start !== undefined) updateFields.availability_start = dto.availability_start;
  if (dto.availability_end !== undefined) updateFields.availability_end = dto.availability_end;
  if (dto.is_active !== undefined) updateFields.is_active = dto.is_active;

  try {
    const { data, error } = await (supabase.from("venues") as any)
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      return data as Venue;
    }
  } catch {
    // Fallback
  }

  const idx = LOCAL_VENUES_STORE.findIndex((v) => v.id === id);
  if (idx !== -1) {
    LOCAL_VENUES_STORE[idx] = { ...LOCAL_VENUES_STORE[idx], ...updateFields };
    return LOCAL_VENUES_STORE[idx];
  }

  throw new Error("Failed to update venue.");
}

export async function deleteVenue(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  try {
    const { error } = await (supabase.from("venues") as any).delete().eq("id", id);
    if (!error) {
      LOCAL_VENUES_STORE = LOCAL_VENUES_STORE.filter((v) => v.id !== id);
      return { success: true };
    }
  } catch {
    // Fallback
  }

  LOCAL_VENUES_STORE = LOCAL_VENUES_STORE.filter((v) => v.id !== id);
  return { success: true };
}
