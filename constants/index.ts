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
  draft: "Draft",
  registration: "Registration",
  draw_pending: "Draw Pending",
  group_stage: "Group Stage",
  knockout: "Knockout",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Status badge color classes (bg + text — never color alone) */
export const TOURNAMENT_STATUS_COLORS: Record<
  TournamentStatus,
  { bg: string; text: string; label: string }
> = {
  draft: { bg: "bg-[var(--color-bg-muted)]", text: "text-[var(--color-text-muted)]", label: "Draft" },
  registration: { bg: "bg-blue-100", text: "text-blue-800", label: "Registration Open" },
  draw_pending: { bg: "bg-amber-100", text: "text-amber-800", label: "Draw Pending" },
  group_stage: { bg: "bg-[var(--color-secondary)]/20", text: "text-[var(--color-primary)]", label: "Group Stage" },
  knockout: { bg: "bg-[var(--color-accent)]/20", text: "text-[var(--color-primary)]", label: "Knockout" },
  completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
  cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
};
