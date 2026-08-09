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

const INITIAL_SEED_VENUES = [
  {
    name: "Oddamavadi Central Stadium Ground",
    short_name: "Central Pitch",
    location: "Main Street, Oddamavadi",
    capacity: 2500,
    availability_start: "07:00:00",
    availability_end: "18:00:00",
    is_active: true,
  },
  {
    name: "Young Lions Youth Sports Complex",
    short_name: "Youth Complex",
    location: "Hospital Road, Oddamavadi",
    capacity: 1200,
    availability_start: "08:00:00",
    availability_end: "19:00:00",
    is_active: true,
  },
  {
    name: "Oddamavadi Beachside Football Arena",
    short_name: "Beachside Ground",
    location: "Coastal Road, Oddamavadi",
    capacity: 800,
    availability_start: "06:00:00",
    availability_end: "17:30:00",
    is_active: true,
  },
  {
    name: "Oddamavadi National School Field",
    short_name: "School Ground",
    location: "School Avenue, Oddamavadi",
    capacity: 600,
    availability_start: "14:00:00",
    availability_end: "18:00:00",
    is_active: false,
  },
];

async function seedInitialVenuesIfEmpty(supabase: any) {
  try {
    const { count } = await (supabase.from("venues") as any)
      .select("id", { count: "exact", head: true });

    if (count === 0) {
      await (supabase.from("venues") as any).insert(INITIAL_SEED_VENUES);
    }
  } catch (err) {
    console.warn("Auto-seeding venues check skipped:", err);
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

  let query: any = (supabase.from("venues") as any).select("*", { count: "exact" });

  // 1. Search filter
  if (params?.search?.trim()) {
    const q = `%${params.search.trim().toLowerCase()}%`;
    query = query.or(`name.ilike.${q},short_name.ilike.${q},location.ilike.${q}`);
  }

  // 2. Status filter
  if (params?.status && params.status !== "ALL") {
    query = query.eq("is_active", params.status === "ACTIVE");
  }

  // 3. Sorting
  query = query.order("created_at", { ascending: false });

  // 4. Range slicing
  const fromIndex = (page - 1) * pageSize;
  const toIndex = fromIndex + pageSize - 1;
  query = query.range(fromIndex, toIndex);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching venues from Supabase:", error);
    throw new Error(error.message || "Failed to fetch venues.");
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const validPage = Math.min(page, totalPages);

  return {
    data: (data || []) as Venue[],
    total,
    page: validPage,
    pageSize,
    totalPages,
    from: total === 0 ? 0 : fromIndex + 1,
    to: Math.min(fromIndex + pageSize, total),
  };
}

export async function fetchVenueById(id: string): Promise<Venue | null> {
  const supabase = createClient();
  const { data, error } = await (supabase.from("venues") as any)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Venue;
}

export async function createVenue(dto: CreateVenueDTO): Promise<Venue> {
  const supabase = createClient();
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

  if (error || !data) {
    console.error("Error creating venue:", error);
    throw new Error(error?.message || "Failed to create venue.");
  }

  return data as Venue;
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

  const { data, error } = await (supabase.from("venues") as any)
    .update(updateFields)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("Error updating venue:", error);
    throw new Error(error?.message || "Failed to update venue.");
  }

  return data as Venue;
}

export async function deleteVenue(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await (supabase.from("venues") as any).delete().eq("id", id);
  if (error) {
    console.error("Error deleting venue:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}
