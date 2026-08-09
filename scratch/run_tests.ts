import { runTournamentValidationTests } from "../lib/validation/__tests__/tournament.test";
import { runTournamentPaginationTests } from "../lib/services/__tests__/tournament.pagination.test";

async function main() {
  console.log("=== Running Young Lions League System Unit Tests ===");

  const valResults = runTournamentValidationTests();
  const pagResults = await runTournamentPaginationTests();

  const allResults = [...valResults, ...pagResults];
  let allPassed = true;

  allResults.forEach((r) => {
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
    console.log("All tournament validation and pagination tests passed successfully!");
  }
}

main();
