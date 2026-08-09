import { Badge } from "./Badge";
import type { BadgeVariant, BadgeSize } from "./Badge";
import type { TournamentStatus } from "@/types";

/* ── Tournament status mapping ───────────────────────────────────────── */
const tournamentStatusMap: Record<
  TournamentStatus,
  { label: string; variant: BadgeVariant }
> = {
  draft:         { label: "Draft",          variant: "neutral"   },
  registration:  { label: "Registration",   variant: "info"      },
  draw_pending:  { label: "Draw Pending",   variant: "warning"   },
  group_stage:   { label: "Group Stage",    variant: "secondary" },
  knockout:      { label: "Knockout",       variant: "accent"    },
  completed:     { label: "Completed",      variant: "success"   },
  cancelled:     { label: "Cancelled",      variant: "error"     },
};

/* ── Match status mapping ────────────────────────────────────────────── */
export type MatchStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "postponed";

const matchStatusMap: Record<MatchStatus, { label: string; variant: BadgeVariant }> = {
  scheduled:   { label: "Scheduled",    variant: "neutral"   },
  in_progress: { label: "Live",         variant: "error"     }, // red = live broadcast feel
  completed:   { label: "Completed",    variant: "success"   },
  cancelled:   { label: "Cancelled",    variant: "error"     },
  postponed:   { label: "Postponed",    variant: "warning"   },
};

/* ── Components ──────────────────────────────────────────────────────── */
export function TournamentStatusBadge({
  status,
  size,
}: {
  status: TournamentStatus;
  size?: BadgeSize;
}) {
  const { label, variant } = tournamentStatusMap[status];
  return (
    <Badge variant={variant} size={size} dot>
      {label}
    </Badge>
  );
}

export function MatchStatusBadge({
  status,
  size,
}: {
  status: MatchStatus;
  size?: BadgeSize;
}) {
  const { label, variant } = matchStatusMap[status];
  const dot = status !== "in_progress"; // live uses pulsing style
  return (
    <Badge variant={variant} size={size} dot={dot}>
      {status === "in_progress" && (
        <span
          className="relative flex w-1.5 h-1.5 shrink-0"
          aria-hidden="true"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-error)] opacity-60" />
          <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[var(--color-error)]" />
        </span>
      )}
      {label}
    </Badge>
  );
}
