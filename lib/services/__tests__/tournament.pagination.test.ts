import { fetchTournaments } from "../tournament.service";

/**
 * Unit tests for Database-Backed Tournament Pagination & Sorting contract.
 */
export async function runTournamentPaginationTests() {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  // Test 1: Default pagination parameters (page=1, pageSize=10)
  try {
    const res = await fetchTournaments({ page: 1, pageSize: 10 });
    if (res.pageSize !== 10) {
      throw new Error(`Expected pageSize=10, got ${res.pageSize}`);
    }
    if (res.data.length > 10) {
      throw new Error(`Expected max 10 records returned, got ${res.data.length}`);
    }
    if (res.from !== 1 || res.to !== res.data.length) {
      throw new Error(`Expected from=1, to=${res.data.length}, got from=${res.from}, to=${res.to}`);
    }
    results.push({ name: "Default pagination bounds (page=1, pageSize=10)", passed: true });
  } catch (e: any) {
    results.push({ name: "Default pagination bounds (page=1, pageSize=10)", passed: false, error: e.message });
  }

  // Test 2: Page 2 slicing contract
  try {
    const resPage1 = await fetchTournaments({ page: 1, pageSize: 10 });
    const resPage2 = await fetchTournaments({ page: 2, pageSize: 10 });

    if (resPage2.page !== 2) {
      throw new Error(`Expected page 2, got ${resPage2.page}`);
    }
    if (
      resPage1.data.length > 0 &&
      resPage2.data.length > 0 &&
      resPage1.data[0].id === resPage2.data[0].id
    ) {
      throw new Error("Page 1 and Page 2 returned identical first record!");
    }
    results.push({ name: "Page 2 database range slicing contract", passed: true });
  } catch (e: any) {
    results.push({ name: "Page 2 database range slicing contract", passed: false, error: e.message });
  }

  // Test 3: Sorting newest vs oldest
  try {
    const resNewest = await fetchTournaments({ sort: "newest", page: 1, pageSize: 10 });
    const resOldest = await fetchTournaments({ sort: "oldest", page: 1, pageSize: 10 });

    const newestTime = new Date(resNewest.data[0].created_at).getTime();
    const oldestTime = new Date(resOldest.data[0].created_at).getTime();

    if (newestTime < oldestTime) {
      throw new Error("Newest sort returned an older record than Oldest sort!");
    }
    results.push({ name: "Newest vs Oldest sorting order", passed: true });
  } catch (e: any) {
    results.push({ name: "Newest vs Oldest sorting order", passed: false, error: e.message });
  }

  // Test 4: Search filter query parameter
  try {
    const resSearch = await fetchTournaments({ search: "Youth Cup", page: 1, pageSize: 10 });
    if (resSearch.data.length === 0 || !resSearch.data[0].name.includes("Youth Cup")) {
      throw new Error("Search filter failed to match 'Youth Cup'");
    }
    results.push({ name: "Search filter database query parameter", passed: true });
  } catch (e: any) {
    results.push({ name: "Search filter database query parameter", passed: false, error: e.message });
  }

  return results;
}
