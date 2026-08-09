import { Badge } from "./Badge";
import type { BadgeVariant, BadgeSize } from "./Badge";
import type { TournamentStatus } from "@/types";

/* ── Tournament status mapping ───────────────────────────────────────── */
const tournamentStatusMap: Record<
  TournamentStatus,
  { label: string; variant: BadgeVariant }
> = {
  DRAFT:                  { label: "Draft",                 variant: "neutral"   },
  REGISTRATION_OPEN:      { label: "Registration Open",     variant: "info"      },
  READY_FOR_DRAW:         { label: "Ready for Draw",        variant: "warning"   },
  DRAW_IN_PROGRESS:       { label: "Draw in Progress",      variant: "warning"   },
  DRAW_COMPLETED:         { label: "Draw Completed",        variant: "secondary" },
  DRAW_LOCKED:            { label: "Draw Locked",           variant: "primary"   },
  FIXTURES_GENERATED:     { label: "Fixtures Generated",    variant: "info"      },
  TOURNAMENT_IN_PROGRESS: { label: "In Progress",           variant: "accent"    },
  GROUP_STAGE_COMPLETED:  { label: "Group Stage Done",      variant: "secondary" },
  KNOCKOUT_IN_PROGRESS:   { label: "Knockout Stage",        variant: "accent"    },
  FINAL_READY:            { label: "Final Ready",           variant: "primary"   },
  COMPLETED:              { label: "Completed",             variant: "success"   },
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
  in_progress: { label: "Live",         variant: "error"     },
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
  const info = tournamentStatusMap[status] || { label: status, variant: "neutral" };
  return (
    <Badge variant={info.variant} size={size} dot>
      {info.label}
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
  const info = matchStatusMap[status] || { label: status, variant: "neutral" };
  const dot = status !== "in_progress";
  return (
    <Badge variant={info.variant} size={size} dot={dot}>
      {status === "in_progress" && (
        <span
          className="relative flex w-1.5 h-1.5 shrink-0"
          aria-hidden="true"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-error)] opacity-60" />
          <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[var(--color-error)]" />
        </span>
      )}
      {info.label}
    </Badge>
  );
}
