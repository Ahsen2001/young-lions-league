import { validateTeamForm, canModifyTeams } from "@/lib/validation/team";
import {
  fetchTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../team.service";

export async function runTeamTests() {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  // Test 1: Valid team input passes validation
  try {
    const res = validateTeamForm({
      name: "Oddamavadi Youth FC",
      short_name: "OYFC",
      contact_email: "contact@oyfc.lk",
      status: "APPROVED",
      is_active: true,
    });
    if (!res.isValid) {
      throw new Error(`Expected valid team input, got errors: ${JSON.stringify(res.errors)}`);
    }
    results.push({ name: "Valid team registration input passes validation", passed: true });
  } catch (e: any) {
    results.push({ name: "Valid team registration input passes validation", passed: false, error: e.message });
  }

  // Test 2: CRITICAL RULE — Manual Group Selection Prohibition
  try {
    const res = validateTeamForm({
      name: "Cheating FC",
      short_name: "CFC",
      group_id: "grp-a", // Attempting manual group assignment
      group_name: "Group A",
      status: "APPROVED",
      is_active: true,
    });
    if (res.isValid || !res.errors.group_selection) {
      throw new Error("Expected manual group selection prohibition error!");
    }
    results.push({ name: "Manual group selection prohibition rule enforced", passed: true });
  } catch (e: any) {
    results.push({ name: "Manual group selection prohibition rule enforced", passed: false, error: e.message });
  }

  // Test 3: Tournament Lifecycle Restriction logic
  try {
    if (!canModifyTeams("DRAFT") || !canModifyTeams("REGISTRATION_OPEN")) {
      throw new Error("Expected DRAFT and REGISTRATION_OPEN to allow team modifications.");
    }
    if (canModifyTeams("DRAW_LOCKED") || canModifyTeams("TOURNAMENT_IN_PROGRESS")) {
      throw new Error("Expected DRAW_LOCKED and TOURNAMENT_IN_PROGRESS to block team modifications.");
    }

    const delRes = await deleteTeam("tm-001", "TOURNAMENT_IN_PROGRESS");
    if (delRes.success) {
      throw new Error("Expected team deletion to fail on TOURNAMENT_IN_PROGRESS!");
    }
    results.push({ name: "Tournament lifecycle restriction rules enforced", passed: true });
  } catch (e: any) {
    results.push({ name: "Tournament lifecycle restriction rules enforced", passed: false, error: e.message });
  }

  // Test 4: Team pagination and page size options (10/20/50)
  try {
    const pag10 = await fetchTeams("trn-2025-01", { page: 1, pageSize: 10 });
    const pag20 = await fetchTeams("trn-2025-01", { page: 1, pageSize: 20 });
    const pagGroupA = await fetchTeams("trn-2025-01", { group: "Group A", page: 1, pageSize: 10 });

    if (pag10.pageSize !== 10 || pag20.pageSize !== 20) {
      throw new Error("Page size configuration mismatch!");
    }
    if (pagGroupA.data.some((t) => t.group_name !== "Group A")) {
      throw new Error("Group filter returned team not belonging to Group A!");
    }
    results.push({ name: "Paginated team query & group filter contract", passed: true });
  } catch (e: any) {
    results.push({ name: "Paginated team query & group filter contract", passed: false, error: e.message });
  }

  return results;
}
