import type { TournamentStatus } from "@/types";

/** Application-wide constants */

export const APP_NAME = "Young Lions League";
export const APP_SHORT_NAME = "YLL";
export const CLUB_NAME = "Young Lions Sports Club";
export const CLUB_LOCATION = "Oddamavadi";

/** Pagination */
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

/** Tournament */
export const MAX_TEAMS_PER_GROUP = 8;
export const MIN_TEAMS_PER_GROUP = 3;
export const MAX_GROUPS = 8;

/** Status display labels */
export const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  DRAFT: "Draft",
  REGISTRATION_OPEN: "Registration Open",
  READY_FOR_DRAW: "Ready for Draw",
  DRAW_IN_PROGRESS: "Draw in Progress",
  DRAW_COMPLETED: "Draw Completed",
  DRAW_LOCKED: "Draw Locked",
  FIXTURES_GENERATED: "Fixtures Generated",
  TOURNAMENT_IN_PROGRESS: "In Progress",
  GROUP_STAGE_COMPLETED: "Group Stage Completed",
  KNOCKOUT_IN_PROGRESS: "Knockout Stage",
  FINAL_READY: "Final Ready",
  COMPLETED: "Completed",
};

/** Status badge color classes (bg + text — never color alone) */
export const TOURNAMENT_STATUS_COLORS: Record<
  TournamentStatus,
  { bg: string; text: string; label: string }
> = {
  DRAFT: { bg: "bg-[var(--color-bg-muted)]", text: "text-[var(--color-text-muted)]", label: "Draft" },
  REGISTRATION_OPEN: { bg: "bg-blue-100", text: "text-blue-800", label: "Registration Open" },
  READY_FOR_DRAW: { bg: "bg-amber-100", text: "text-amber-800", label: "Ready for Draw" },
  DRAW_IN_PROGRESS: { bg: "bg-amber-100", text: "text-amber-800", label: "Draw in Progress" },
  DRAW_COMPLETED: { bg: "bg-blue-100", text: "text-blue-800", label: "Draw Completed" },
  DRAW_LOCKED: { bg: "bg-purple-100", text: "text-purple-800", label: "Draw Locked" },
  FIXTURES_GENERATED: { bg: "bg-blue-100", text: "text-blue-800", label: "Fixtures Generated" },
  TOURNAMENT_IN_PROGRESS: { bg: "bg-[var(--color-secondary)]/20", text: "text-[var(--color-primary)]", label: "In Progress" },
  GROUP_STAGE_COMPLETED: { bg: "bg-indigo-100", text: "text-indigo-800", label: "Group Stage Done" },
  KNOCKOUT_IN_PROGRESS: { bg: "bg-[var(--color-accent)]/20", text: "text-[var(--color-primary)]", label: "Knockout" },
  FINAL_READY: { bg: "bg-purple-100", text: "text-purple-800", label: "Final Ready" },
  COMPLETED: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
};
