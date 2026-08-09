import fs from "fs";
import path from "path";

try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf8");
    envFile.split("\n").forEach((line) => {
      const [k, ...v] = line.trim().split("=");
      if (k && v.length) {
        process.env[k.trim()] = v.join("=").trim();
      }
    });
  }
} catch {
  // Ignore env read error
}

import { runTournamentValidationTests } from "../lib/validation/__tests__/tournament.test";
import { runTournamentPaginationTests } from "../lib/services/__tests__/tournament.pagination.test";
import { runVenueTests } from "../lib/services/__tests__/venue.test";
import { runTeamTests } from "../lib/services/__tests__/team.test";
import { runTeamImportTests } from "../lib/services/__tests__/team-import.test";
import { runDrawEngineTests } from "../lib/services/__tests__/draw.test";

async function main() {
  console.log("=== Running Young Lions League System Unit Tests ===");

  const valResults = runTournamentValidationTests();
  const pagResults = await runTournamentPaginationTests();
  const venResults = await runVenueTests();
  const teamResults = await runTeamTests();
  const importResults = await runTeamImportTests();
  const drawResults = await runDrawEngineTests();

  const allResults = [
    ...valResults,
    ...pagResults,
    ...venResults,
    ...teamResults,
    ...importResults,
    ...drawResults,
  ];
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
