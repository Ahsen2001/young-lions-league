import type { Team } from "@/types";
import type { CreateTeamDTO } from "@/lib/services/team.service";

export interface RawCSVRow {
  rowIndex: number;
  team_name: string;
  short_name: string;
  registration_number: string;
  manager_name: string;
  captain_name: string;
  phone: string;
  email: string;
}

export interface ParsedCSVRowResult {
  rowIndex: number;
  raw: RawCSVRow;
  dto: CreateTeamDTO | null;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ImportValidationResult {
  rows: ParsedCSVRowResult[];
  validCount: number;
  invalidCount: number;
  warningCount: number;
  totalCount: number;
}

/**
 * Parses raw CSV string content into structured key-value rows.
 * Handles quoted cells containing commas (e.g. "Oddamavadi Youth FC, Central").
 */
export function parseCSV(csvContent: string): RawCSVRow[] {
  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) {
    return [];
  }

  // Helper to parse a single CSV line respecting quotes
  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, ""));

  const getCol = (cols: string[], possibleKeys: string[]): string => {
    for (const key of possibleKeys) {
      const idx = headers.findIndex((h) => h.includes(key));
      if (idx !== -1 && cols[idx]) {
        return cols[idx].replace(/^"|"$/g, "").trim();
      }
    }
    return "";
  };

  const rows: RawCSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    if (cols.every((c) => !c.trim())) continue;

    rows.push({
      rowIndex: i + 1,
      team_name: getCol(cols, ["team_name", "teamname", "name", "club"]),
      short_name: getCol(cols, ["short_name", "shortname", "code", "tag"]),
      registration_number: getCol(cols, ["registration_number", "reg_num", "registration", "reg"]),
      manager_name: getCol(cols, ["manager_name", "manager", "mgr"]),
      captain_name: getCol(cols, ["captain_name", "captain", "capt"]),
      phone: getCol(cols, ["phone", "contact_phone", "mobile", "tel"]),
      email: getCol(cols, ["email", "contact_email", "mail"]),
    });
  }

  return rows;
}

/**
 * Validates parsed CSV rows against domain rules, intra-CSV duplicates, and existing database records.
 */
export function validateCSVImportRows(
  rawRows: RawCSVRow[],
  existingTeams: Team[] = []
): ImportValidationResult {
  const results: ParsedCSVRowResult[] = [];
  const seenNamesInCSV = new Set<string>();
  const seenRegsInCSV = new Set<string>();

  const existingNamesInDB = new Set(existingTeams.map((t) => t.name.toLowerCase().trim()));
  const existingRegsInDB = new Set(
    existingTeams
      .map((t) => t.registration_number?.toLowerCase().trim())
      .filter((r): r is string => Boolean(r))
  );

  let validCount = 0;
  let invalidCount = 0;
  let warningCount = 0;

  for (const raw of rawRows) {
    const errors: string[] = [];
    const warnings: string[] = [];

    const normName = raw.team_name.toLowerCase().trim();
    const normCode = raw.short_name.toUpperCase().trim();
    const normReg = raw.registration_number.toLowerCase().trim();

    // 1. Team Name validation
    if (!raw.team_name || !raw.team_name.trim()) {
      errors.push("Team name is required.");
    } else if (raw.team_name.trim().length < 3) {
      errors.push("Team name must be at least 3 characters.");
    }

    // 2. Short Name validation
    if (!raw.short_name || !raw.short_name.trim()) {
      errors.push("Short code is required (e.g. OYFC).");
    } else if (normCode.length < 2 || normCode.length > 6) {
      errors.push("Short code must be 2 to 6 characters.");
    }

    // 3. Email validation
    if (raw.email && raw.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(raw.email.trim())) {
        errors.push("Invalid email format.");
      }
    }

    // 4. Intra-CSV Duplicate Checks
    if (normName && seenNamesInCSV.has(normName)) {
      errors.push(`Duplicate team name "${raw.team_name}" found elsewhere in this CSV.`);
    } else if (normName) {
      seenNamesInCSV.add(normName);
    }

    if (normReg && seenRegsInCSV.has(normReg)) {
      errors.push(`Duplicate registration number "${raw.registration_number}" elsewhere in CSV.`);
    } else if (normReg) {
      seenRegsInCSV.add(normReg);
    }

    // 5. Existing Tournament Database Duplicate Checks
    if (normName && existingNamesInDB.has(normName)) {
      warnings.push(`Team "${raw.team_name}" is already registered in this tournament.`);
      errors.push(`Team "${raw.team_name}" already exists in this tournament.`);
    }

    if (normReg && existingRegsInDB.has(normReg)) {
      warnings.push(`Registration number "${raw.registration_number}" already exists in database.`);
      errors.push(`Registration number "${raw.registration_number}" already exists in database.`);
    }

    const isValid = errors.length === 0;

    if (isValid) {
      validCount++;
    } else {
      invalidCount++;
    }

    if (warnings.length > 0) {
      warningCount++;
    }

    const dto: CreateTeamDTO | null = isValid
      ? {
          name: raw.team_name.trim(),
          short_name: normCode,
          registration_number: raw.registration_number.trim() || undefined,
          manager_name: raw.manager_name.trim() || undefined,
          captain_name: raw.captain_name.trim() || undefined,
          contact_phone: raw.phone.trim() || undefined,
          contact_email: raw.email.trim() || undefined,
          status: "APPROVED",
          is_active: true,
        }
      : null;

    results.push({
      rowIndex: raw.rowIndex,
      raw,
      dto,
      isValid,
      errors,
      warnings,
    });
  }

  return {
    rows: results,
    validCount,
    invalidCount,
    warningCount,
    totalCount: rawRows.length,
  };
}
