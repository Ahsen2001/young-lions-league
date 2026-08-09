import { runTournamentValidationTests } from "../lib/validation/__tests__/tournament.test";

const results = runTournamentValidationTests();
console.log("=== Tournament Validation & Business Rule Test Results ===");
let allPassed = true;
results.forEach((r) => {
  if (r.passed) {
    console.log(`✅ [PASS] ${r.name}`);
  } else {
    console.log(`❌ [FAIL] ${r.name}: ${r.error}`);
    allPassed = false;
  }
});

if (!allPassed) {
  process.exit(1);
} else {
  console.log("All tournament validation tests passed successfully!");
}
