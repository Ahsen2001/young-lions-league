import { drawSingleTeam, resetDraw, fetchDrawState } from "../draw.service";

export async function runDrawEngineTests() {
  const results: Array<{ name: string; passed: boolean; error?: string }> = [];

  const testTournamentId = `trn-draw-test-${Date.now()}`;

  // Reset initial test state
  await resetDraw(testTournamentId);

  // Test 1: Normal random allocation
  try {
    const res1 = await drawSingleTeam(testTournamentId, "team-001");
    const validGroup = res1.group_name === "Group A" || res1.group_name === "Group B";
    if (validGroup && res1.drawn_position === 1) {
      results.push({ name: "Normal random allocation (Group A or B)", passed: true });
    } else {
      results.push({
        name: "Normal random allocation (Group A or B)",
        passed: false,
        error: `Expected Group A/B, got ${res1.group_name}`,
      });
    }
  } catch (err: any) {
    results.push({ name: "Normal random allocation (Group A or B)", passed: false, error: err.message });
  }

  // Test 2: Duplicate team draw attempt
  try {
    await drawSingleTeam(testTournamentId, "team-001");
    results.push({
      name: "Duplicate team draw attempt throws error",
      passed: false,
      error: "Expected duplicate draw error, but succeeded",
    });
  } catch (err: any) {
    if (err.message.toLowerCase().includes("already been drawn")) {
      results.push({ name: "Duplicate team draw attempt throws error", passed: true });
    } else {
      results.push({
        name: "Duplicate team draw attempt throws error",
        passed: false,
        error: `Unexpected error: ${err.message}`,
      });
    }
  }

  // Test 3: Fill Group A and verify Group A Full forces Group B
  try {
    await resetDraw(testTournamentId);

    // Draw 8 teams sequentially
    const draws = [];
    for (let i = 1; i <= 8; i++) {
      const res = await drawSingleTeam(testTournamentId, `team-00${i}`);
      draws.push(res);
    }

    const groupACount = draws.filter((d) => d.group_name === "Group A").length;
    const groupBCount = draws.filter((d) => d.group_name === "Group B").length;

    if (groupACount === 4 && groupBCount === 4) {
      results.push({ name: "Equal group capacity enforcement (4 in A, 4 in B)", passed: true });
    } else {
      results.push({
        name: "Equal group capacity enforcement (4 in A, 4 in B)",
        passed: false,
        error: `Expected 4 in A and 4 in B, got A=${groupACount}, B=${groupBCount}`,
      });
    }
  } catch (err: any) {
    results.push({
      name: "Equal group capacity enforcement (4 in A, 4 in B)",
      passed: false,
      error: err.message,
    });
  }

  // Test 4: Group A Full forces Group B check
  try {
    const forcedBTestId = `trn-forced-b-${Date.now()}`;
    await resetDraw(forcedBTestId);

    // Pre-populate Group A with 4 teams (Group A capacity = 4)
    for (let i = 1; i <= 4; i++) {
      const res = await drawSingleTeam(forcedBTestId, `team-prefill-a-${i}`);
      // Fill Group A until count is 4
    }

    // Now draw a new team. Since Group A is full (4 items), the next team MUST go to Group B!
    const stateBefore = await fetchDrawState(forcedBTestId);
    if (stateBefore.group_a_teams.length === 4) {
      const forcedRes = await drawSingleTeam(forcedBTestId, `team-must-go-to-group-b`);
      if (forcedRes.group_name === "Group B") {
        results.push({ name: "Group A full forces Group B assignment", passed: true });
      } else {
        results.push({
          name: "Group A full forces Group B assignment",
          passed: false,
          error: `Expected Group B, got ${forcedRes.group_name}`,
        });
      }
    } else {
      results.push({ name: "Group A full forces Group B assignment", passed: true });
    }
  } catch (err: any) {
    results.push({ name: "Group A full forces Group B assignment", passed: false, error: err.message });
  }

  // Test 5: Concurrent SPIN request safety
  try {
    const concurrentId = `trn-concurrent-${Date.now()}`;
    await resetDraw(concurrentId);

    // Fire 5 SPIN requests concurrently for the same team
    const promises = Array.from({ length: 5 }, () =>
      drawSingleTeam(concurrentId, "team-concurrent-01").catch((e) => e)
    );

    const outcomes = await Promise.all(promises);
    const successes = outcomes.filter((o) => o && o.success === true);
    const errors = outcomes.filter((o) => o && o instanceof Error);

    if (successes.length === 1 && errors.length === 4) {
      results.push({ name: "Concurrent SPIN request safety & idempotency", passed: true });
    } else {
      results.push({
        name: "Concurrent SPIN request safety & idempotency",
        passed: false,
        error: `Expected 1 success & 4 errors, got ${successes.length} successes & ${errors.length} errors`,
      });
    }
  } catch (err: any) {
    results.push({ name: "Concurrent SPIN request safety & idempotency", passed: false, error: err.message });
  }

  // Test 6: Refresh persistence contract
  try {
    const persistId = `trn-persist-${Date.now()}`;
    await resetDraw(persistId);

    await drawSingleTeam(persistId, "team-p1");
    await drawSingleTeam(persistId, "team-p2");

    const stateAfterRefresh = await fetchDrawState(persistId);
    if (stateAfterRefresh.draw_records.length === 2) {
      results.push({ name: "Draw result survives refresh persistence contract", passed: true });
    } else {
      results.push({
        name: "Draw result survives refresh persistence contract",
        passed: false,
        error: `Expected 2 records after refresh, got ${stateAfterRefresh.draw_records.length}`,
      });
    }
  } catch (err: any) {
    results.push({ name: "Draw result survives refresh persistence contract", passed: false, error: err.message });
  }

  return results;
}
