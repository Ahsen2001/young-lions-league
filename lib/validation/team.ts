import type { TeamStatus, TournamentStatus } from "@/types";

export interface TeamFormInput {
  name: string;
  short_name: string;
  logo_url?: string;
  registration_number?: string;
  manager_name?: string;
  captain_name?: string;
  contact_phone?: string;
  contact_email?: string;
  status: TeamStatus;
  is_active: boolean;
  // Note: group_id/group_name are intentionally excluded from registration form inputs
}

export type TeamValidationErrorMap = Partial<Record<keyof TeamFormInput | "group_selection" | "lifecycle", string>>;

export interface TeamValidationResult {
  isValid: boolean;
  errors: TeamValidationErrorMap;
}

/**
 * Tournament Lifecycle Restriction Check:
 * Teams can be created, updated, or deleted during setup (DRAFT, REGISTRATION_OPEN, READY_FOR_DRAW).
 * Once the draw is locked or matches start, team modifications are locked.
 */
export function canModifyTeams(status: TournamentStatus): boolean {
  const allowedStatuses: TournamentStatus[] = [
    "DRAFT",
    "REGISTRATION_OPEN",
    "READY_FOR_DRAW",
  ];
  return allowedStatuses.includes(status);
}

/**
 * Validates Team Form Input.
 * Strictly enforces that manual Group A / Group B assignment cannot occur during registration.
 */
export function validateTeamForm(
  input: Partial<TeamFormInput & { group_id?: string; group_name?: string }>,
  tournamentStatus?: TournamentStatus
): TeamValidationResult {
  const errors: TeamValidationErrorMap = {};

  // Lifecycle check
  if (tournamentStatus && !canModifyTeams(tournamentStatus)) {
    errors.lifecycle = "Team roster modification is locked because the tournament draw or competition matches have begun.";
  }

  // Manual Group Selection Prohibition Rule
  if (input.group_id || input.group_name) {
    errors.group_selection = "CRITICAL RULE VIOLATION: Manual Group selection is strictly prohibited during team registration. Groups are allocated solely through the official Live Draw.";
  }

  // Name validation
  if (!input.name || !input.name.trim()) {
    errors.name = "Team name is required.";
  } else if (input.name.trim().length < 3) {
    errors.name = "Team name must be at least 3 characters.";
  } else if (input.name.trim().length > 100) {
    errors.name = "Team name cannot exceed 100 characters.";
  }

  // Short Name validation
  if (!input.short_name || !input.short_name.trim()) {
    errors.short_name = "Short code is required (e.g. OYFC).";
  } else if (input.short_name.trim().length < 2 || input.short_name.trim().length > 6) {
    errors.short_name = "Short code must be 2 to 6 characters (e.g. OYFC).";
  }

  // Email format validation
  if (input.contact_email && input.contact_email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.contact_email.trim())) {
      errors.contact_email = "Please enter a valid email address.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
