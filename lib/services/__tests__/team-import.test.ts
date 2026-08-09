import { parseCSV, validateCSVImportRows } from "@/lib/utils/csv-importer";
import { bulkCreateTeams } from "../team.service";
import type { Team } from "@/types";

export async function runTeamImportTests() {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  // Test 1: CSV parsing with quotes and whitespace
  try {
    const csvContent = `team_name,short_name,registration_number,manager_name,captain_name,phone,email
"Oddamavadi Youth FC, Central",OYFC,REG-2025-099,Mohamed Farook,Ahmed Rizwan,+94 77 123 4567,farook@oyfc.lk
Coastal Eagles SC,CESC,REG-2025-100,A. Rameez,S. Naufal,+94 77 345 6789,rameez@coastaleagles.lk
`;

    const parsed = parseCSV(csvContent);
    if (parsed.length !== 2) {
      throw new Error(`Expected 2 parsed rows, got ${parsed.length}`);
    }
    if (parsed[0].team_name !== "Oddamavadi Youth FC, Central") {
      throw new Error(`Quoted CSV cell parsing failed: ${parsed[0].team_name}`);
    }
    results.push({ name: "CSV text parser handles quotes & line breaks", passed: true });
  } catch (e: any) {
    results.push({ name: "CSV text parser handles quotes & line breaks", passed: false, error: e.message });
  }

  // Test 2: Row-level validation and duplicate detection
  try {
    const mockExistingTeams: Team[] = [
      {
        id: "tm-001",
        tournament_id: "trn-2025-01",
        name: "Oddamavadi Youth FC",
        short_name: "OYFC",
        slug: "oddamavadi-youth-fc",
        logo_url: null,
        registration_number: "REG-2025-001",
        manager_name: null,
        captain_name: null,
        contact_phone: null,
        contact_email: null,
        status: "APPROVED",
        is_active: true,
        group_id: null,
        group_name: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const rawRows = [
      {
        rowIndex: 2,
        team_name: "Valid Unique FC",
        short_name: "VUFC",
        registration_number: "REG-2025-999",
        manager_name: "John Doe",
        captain_name: "Jane Doe",
        phone: "+94 77 000 0000",
        email: "valid@vufc.lk",
      },
      {
        rowIndex: 3,
        team_name: "Oddamavadi Youth FC", // Existing DB Duplicate
        short_name: "OYFC",
        registration_number: "REG-2025-001",
        manager_name: "Duplicate Mgr",
        captain_name: "Duplicate Capt",
        phone: "",
        email: "",
      },
      {
        rowIndex: 4,
        team_name: "Bad Code FC",
        short_name: "B", // Invalid short code (<2 chars)
        registration_number: "REG-2025-888",
        manager_name: "",
        captain_name: "",
        phone: "",
        email: "invalid-email",
      },
    ];

    const validation = validateCSVImportRows(rawRows, mockExistingTeams);

    if (validation.validCount !== 1) {
      throw new Error(`Expected 1 valid row, got ${validation.validCount}`);
    }
    if (validation.invalidCount !== 2) {
      throw new Error(`Expected 2 invalid rows, got ${validation.invalidCount}`);
    }
    results.push({ name: "Row validation & duplicate detection contract", passed: true });
  } catch (e: any) {
    results.push({ name: "Row validation & duplicate detection contract", passed: false, error: e.message });
  }

  // Test 3: Bulk team insertion service
  try {
    const res = await bulkCreateTeams("trn-2025-01", [
      {
        name: "Imported Club A",
        short_name: "ICA",
        registration_number: "REG-IMP-001",
        status: "APPROVED",
        is_active: true,
      },
      {
        name: "Imported Club B",
        short_name: "ICB",
        registration_number: "REG-IMP-002",
        status: "APPROVED",
        is_active: true,
      },
    ]);

    if (res.importedCount !== 2) {
      throw new Error(`Expected 2 imported teams, got ${res.importedCount}`);
    }
    results.push({ name: "Bulk team creation service contract", passed: true });
  } catch (e: any) {
    results.push({ name: "Bulk team creation service contract", passed: false, error: e.message });
  }

  return results;
}
