import { runTournamentValidationTests } from "../lib/validation/__tests__/tournament.test";
import { runTournamentPaginationTests } from "../lib/services/__tests__/tournament.pagination.test";
import { runVenueTests } from "../lib/services/__tests__/venue.test";
import { runTeamTests } from "../lib/services/__tests__/team.test";

async function main() {
  console.log("=== Running Young Lions League System Unit Tests ===");

  const valResults = runTournamentValidationTests();
  const pagResults = await runTournamentPaginationTests();
  const venResults = await runVenueTests();
  const teamResults = await runTeamTests();

  const allResults = [...valResults, ...pagResults, ...venResults, ...teamResults];
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
    console.log("All system unit tests passed successfully!");
  }
}

main();
