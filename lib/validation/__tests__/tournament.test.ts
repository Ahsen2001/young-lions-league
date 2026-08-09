import {
  validateTournamentForm,
  isFormatLocked,
} from "../tournament";
import type { TournamentFormInput } from "../tournament";

/**
 * Lightweight test suite for Tournament validation & format locking business rules.
 */
export function runTournamentValidationTests() {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  // Test 1: Valid tournament input passes validation
  try {
    const validData: TournamentFormInput = {
      name: "Oddamavadi Super Cup 2025",
      season: "2025",
      num_groups: 4,
      teams_per_group: 4,
      max_teams: 16,
      teams_advancing_per_group: 2,
      format: "GROUP_QUARTER_SEMI_FINAL",
      points_for_win: 3,
      points_for_draw: 1,
      points_for_loss: 0,
      allow_draws_in_group: true,
    };
    const res = validateTournamentForm(validData);
    if (!res.isValid || Object.keys(res.errors).length !== 0) {
      throw new Error(`Expected valid result, got errors: ${JSON.stringify(res.errors)}`);
    }
    results.push({ name: "Valid tournament input passes validation", passed: true });
  } catch (e: any) {
    results.push({ name: "Valid tournament input passes validation", passed: false, error: e.message });
  }

  // Test 2: Short name & invalid team capacity triggers errors
  try {
    const invalidData: Partial<TournamentFormInput> = {
      name: "Ab", // too short
      season: "2025",
      num_groups: 4,
      teams_per_group: 4,
      max_teams: 5, // invalid: 4 groups * 4 teams = 16 min
    };
    const res = validateTournamentForm(invalidData);
    if (res.isValid || !res.errors.name || !res.errors.max_teams) {
      throw new Error(`Expected name and max_teams errors, got: ${JSON.stringify(res.errors)}`);
    }
    results.push({ name: "Invalid name & max_teams trigger field errors", passed: true });
  } catch (e: any) {
    results.push({ name: "Invalid name & max_teams trigger field errors", passed: false, error: e.message });
  }

  // Test 3: Format locking status check
  try {
    if (!isFormatLocked("TOURNAMENT_IN_PROGRESS")) {
      throw new Error("Expected TOURNAMENT_IN_PROGRESS to be locked.");
    }
    if (!isFormatLocked("COMPLETED")) {
      throw new Error("Expected COMPLETED to be locked.");
    }
    if (isFormatLocked("DRAFT")) {
      throw new Error("Expected DRAFT to be unlocked.");
    }
    if (isFormatLocked("REGISTRATION_OPEN")) {
      throw new Error("Expected REGISTRATION_OPEN to be unlocked.");
    }
    results.push({ name: "Format locking status helper logic", passed: true });
  } catch (e: any) {
    results.push({ name: "Format locking status helper logic", passed: false, error: e.message });
  }

  // Test 4: Format modification on active tournament rejected
  try {
    const editData: Partial<TournamentFormInput> = {
      name: "Active Cup",
      season: "2025",
      num_groups: 4,
      teams_per_group: 4,
      max_teams: 16,
      format: "GROUP_FINAL", // changed from GROUP_SEMI_FINAL
    };
    const res = validateTournamentForm(
      editData,
      "TOURNAMENT_IN_PROGRESS",
      "GROUP_SEMI_FINAL"
    );
    if (res.isValid || !res.errors.format) {
      throw new Error("Expected format locked error when modifying active tournament format.");
    }
    results.push({ name: "Format modification blocked on active tournament", passed: true });
  } catch (e: any) {
    results.push({ name: "Format modification blocked on active tournament", passed: false, error: e.message });
  }

  return results;
}
