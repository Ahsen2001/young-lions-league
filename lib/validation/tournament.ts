import type { TournamentStatus, TournamentFormat } from "@/types";

export interface TournamentFormInput {
  name: string;
  season: string;
  description?: string;
  logo_url?: string;
  start_date?: string;
  end_date?: string;
  num_groups: number;
  teams_per_group: number;
  max_teams: number;
  teams_advancing_per_group: number;
  format: TournamentFormat;
  points_for_win: number;
  points_for_draw: number;
  points_for_loss: number;
  allow_draws_in_group: boolean;
}

export type ValidationErrorMap = Partial<Record<keyof TournamentFormInput, string>>;

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrorMap;
}

/**
 * Format Locking Rule:
 * Tournament format can be modified during setup (DRAFT, REGISTRATION_OPEN, READY_FOR_DRAW),
 * BUT becomes strictly LOCKED once official matches/tournament starts.
 */
export function isFormatLocked(status: TournamentStatus): boolean {
  const lockedStatuses: TournamentStatus[] = [
    "TOURNAMENT_IN_PROGRESS",
    "GROUP_STAGE_COMPLETED",
    "KNOCKOUT_IN_PROGRESS",
    "FINAL_READY",
    "COMPLETED",
  ];
  return lockedStatuses.includes(status);
}

/**
 * Validates Tournament form data inline.
 */
export function validateTournamentForm(
  input: Partial<TournamentFormInput>,
  currentStatus?: TournamentStatus,
  originalFormat?: TournamentFormat
): ValidationResult {
  const errors: ValidationErrorMap = {};

  // Name validation
  if (!input.name || !input.name.trim()) {
    errors.name = "Tournament name is required.";
  } else if (input.name.trim().length < 3) {
    errors.name = "Tournament name must be at least 3 characters.";
  } else if (input.name.trim().length > 100) {
    errors.name = "Tournament name cannot exceed 100 characters.";
  }

  // Season validation
  if (!input.season || !input.season.trim()) {
    errors.season = "Season is required (e.g. 2025).";
  }

  // Number of groups validation
  if (input.num_groups === undefined || input.num_groups < 1) {
    errors.num_groups = "At least 1 group is required.";
  } else if (input.num_groups > 8) {
    errors.num_groups = "Maximum 8 groups allowed.";
  }

  // Teams per group validation
  if (input.teams_per_group === undefined || input.teams_per_group < 2) {
    errors.teams_per_group = "Each group must have at least 2 teams.";
  }

  // Max teams validation
  const minRequiredTeams = (input.num_groups || 1) * (input.teams_per_group || 2);
  if (input.max_teams === undefined || input.max_teams < 2) {
    errors.max_teams = "Expected team count is required.";
  } else if (input.max_teams < minRequiredTeams) {
    errors.max_teams = `Total teams (${input.max_teams}) cannot be less than groups × teams per group (${minRequiredTeams}).`;
  }

  // Points validation
  if (input.points_for_win === undefined || input.points_for_win < 0) {
    errors.points_for_win = "Win points must be 0 or greater.";
  }
  if (input.points_for_draw === undefined || input.points_for_draw < 0) {
    errors.points_for_draw = "Draw points must be 0 or greater.";
  }
  if (input.points_for_loss === undefined || input.points_for_loss < 0) {
    errors.points_for_loss = "Loss points must be 0 or greater.";
  }

  // Date range validation
  if (input.start_date && input.end_date) {
    if (new Date(input.end_date) < new Date(input.start_date)) {
      errors.end_date = "Expected end date cannot be before start date.";
    }
  }

  // Format Lock Business Rule validation
  if (
    currentStatus &&
    isFormatLocked(currentStatus) &&
    originalFormat &&
    input.format &&
    input.format !== originalFormat
  ) {
    errors.format = "Tournament format is locked because official competition matches have begun.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/** Format Descriptions and Rule Explanations */
export const FORMAT_DESCRIPTIONS: Record<
  TournamentFormat,
  { title: string; subtitle: string; description: string; progression: string }
> = {
  GROUP_SEMI_FINAL: {
    title: "Format A: Group Stage → Semi-Finals → Final",
    subtitle: "Ideal for 4-8 teams across 2 groups",
    description:
      "Teams compete in Round-Robin group matches. The Top 2 teams from Group A and Group B advance directly to the Semi-Finals, followed by the Grand Final.",
    progression: "Group Stage (Groups A & B) ➔ Semi-Finals ➔ Grand Final",
  },
  GROUP_QUARTER_SEMI_FINAL: {
    title: "Format B: Group Stage → Quarter-Finals → Semi-Finals → Final",
    subtitle: "Recommended for 16 teams across 4 groups",
    description:
      "Standard major tournament format. 16 teams play in 4 groups (A, B, C, D). Top 2 teams per group advance to the 8-team Quarter-Final knockout stage.",
    progression: "Group Stage (Groups A, B, C, D) ➔ Quarter-Finals ➔ Semi-Finals ➔ Grand Final",
  },
  GROUP_FINAL: {
    title: "Format C: Group Stage → Final",
    subtitle: "Fast-track tournament format",
    description:
      "Short tournament format. Teams play in groups, and only the 1st place winners of each group advance directly to play in the Grand Final.",
    progression: "Group Stage ➔ Grand Final",
  },
};
