import {
  drawSingleTeam,
  fetchDrawState,
  completeDraw,
  lockDraw,
  resetDraw,
} from "../draw.service";

export async function runDrawLifecycleTests() {
  console.log("\n=== Running Draw Lifecycle Transition Unit Tests ===");
  const results: Array<{ name: string; passed: boolean; error?: string }> = [];

  const tournamentId = `trn-lifecycle-test-${Date.now()}`;

  // Test 1: Reset & Start Fresh State
  try {
    await resetDraw(tournamentId);
    const state = await fetchDrawState(tournamentId);
    if (state.draw_records.length === 0 && state.tournament_status === "READY_FOR_DRAW") {
      results.push({ name: "Reset initializes ready state cleanly", passed: true });
    } else {
      results.push({
        name: "Reset initializes ready state cleanly",
        passed: false,
        error: `Expected 0 records and READY_FOR_DRAW, got ${state.draw_records.length} records and status ${state.tournament_status}`,
      });
    }
  } catch (err: any) {
    results.push({ name: "Reset initializes ready state cleanly", passed: false, error: err.message });
  }

  // Test 2: Complete Draw creates audit log entry
  try {
    await drawSingleTeam(tournamentId, "team-lc-1");
    await drawSingleTeam(tournamentId, "team-lc-2");
    await completeDraw(tournamentId, "admin-tester");

    const state = await fetchDrawState(tournamentId);
    const hasCompleteAudit = state.draw_audit_logs.some((log) => log.action === "DRAW_COMPLETED");

    if (hasCompleteAudit) {
      results.push({ name: "Complete Draw logs DRAW_COMPLETED audit record", passed: true });
    } else {
      results.push({
        name: "Complete Draw logs DRAW_COMPLETED audit record",
        passed: false,
        error: "Missing DRAW_COMPLETED audit log entry",
      });
    }
  } catch (err: any) {
    results.push({ name: "Complete Draw logs DRAW_COMPLETED audit record", passed: false, error: err.message });
  }

  // Test 3: Lock Draw logs DRAW_LOCKED audit record
  try {
    await lockDraw(tournamentId, "admin-tester");
    const state = await fetchDrawState(tournamentId);
    const hasLockAudit = state.draw_audit_logs.some((log) => log.action === "DRAW_LOCKED");

    if (hasLockAudit) {
      results.push({ name: "Lock Draw logs DRAW_LOCKED audit record", passed: true });
    } else {
      results.push({
        name: "Lock Draw logs DRAW_LOCKED audit record",
        passed: false,
        error: "Missing DRAW_LOCKED audit log entry",
      });
    }
  } catch (err: any) {
    results.push({ name: "Lock Draw logs DRAW_LOCKED audit record", passed: false, error: err.message });
  }

  // Test 4: Reset Draw logs DRAW_RESET audit record
  try {
    await resetDraw(tournamentId, "admin-tester");
    const state = await fetchDrawState(tournamentId);
    const hasResetAudit = state.draw_audit_logs.some((log) => log.action === "DRAW_RESET");

    if (hasResetAudit) {
      results.push({ name: "Reset Draw logs DRAW_RESET audit record", passed: true });
    } else {
      results.push({
        name: "Reset Draw logs DRAW_RESET audit record",
        passed: false,
        error: "Missing DRAW_RESET audit log entry",
      });
    }
  } catch (err: any) {
    results.push({ name: "Reset Draw logs DRAW_RESET audit record", passed: false, error: err.message });
  }

  // Print Summary Results
  results.forEach((r) => {
    if (r.passed) {
      console.log(`✅ [PASS] ${r.name}`);
    } else {
      console.log(`❌ [FAIL] ${r.name}: ${r.error}`);
    }
  });

  return results;
}
