import { validateVenueForm } from "@/lib/validation/venue";
import {
  fetchVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} from "../venue.service";

export async function runVenueTests() {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  // Test 1: Valid venue form validation
  try {
    const res = validateVenueForm({
      name: "Oddamavadi Central Stadium",
      short_name: "Central Pitch",
      capacity: 2000,
      availability_start: "08:00",
      availability_end: "18:00",
      is_active: true,
    });
    if (!res.isValid) {
      throw new Error(`Expected valid venue, got errors: ${JSON.stringify(res.errors)}`);
    }
    results.push({ name: "Valid venue input passes validation", passed: true });
  } catch (e: any) {
    results.push({ name: "Valid venue input passes validation", passed: false, error: e.message });
  }

  // Test 2: Invalid time range triggers validation error
  try {
    const res = validateVenueForm({
      name: "Invalid Ground",
      short_name: "Invalid",
      availability_start: "18:00",
      availability_end: "08:00", // end before start
    });
    if (res.isValid || !res.errors.availability_end) {
      throw new Error("Expected availability_end error when end time is before start time.");
    }
    results.push({ name: "Invalid availability time range triggers error", passed: true });
  } catch (e: any) {
    results.push({ name: "Invalid availability time range triggers error", passed: false, error: e.message });
  }

  // Test 3: Paginated venue query fetching
  try {
    const pag = await fetchVenues({ page: 1, pageSize: 10 });
    if (pag.data.length === 0) {
      throw new Error("Expected seeded venue list, got 0 items.");
    }
    results.push({ name: "Paginated venue fetching contract", passed: true });
  } catch (e: any) {
    results.push({ name: "Paginated venue fetching contract", passed: false, error: e.message });
  }

  // Test 4: Venue creation and deletion
  try {
    const newVenue = await createVenue({
      name: "Test Arena Ground",
      short_name: "Test Arena",
      capacity: 500,
      availability_start: "09:00",
      availability_end: "17:00",
      is_active: true,
    });

    if (!newVenue.id) {
      throw new Error("Created venue missing generated ID.");
    }

    const delRes = await deleteVenue(newVenue.id);
    if (!delRes.success) {
      throw new Error("Failed to delete newly created test venue.");
    }

    results.push({ name: "Venue creation and safe deletion cycle", passed: true });
  } catch (e: any) {
    results.push({ name: "Venue creation and safe deletion cycle", passed: false, error: e.message });
  }

  return results;
}
