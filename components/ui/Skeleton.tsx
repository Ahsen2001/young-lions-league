import { cn } from "@/lib/utils";

/* ── Base Inline Skeleton ────────────────────────────────────────────── */
export interface SkeletonProps {
  className?: string;
  circle?: boolean;
}

export function Skeleton({ className, circle = false }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton",
        circle ? "rounded-full" : "rounded-[var(--radius-sm)]",
        className
      )}
      aria-hidden="true"
    />
  );
}

/* ── Pre-built Card Skeleton ─────────────────────────────────────────── */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-[var(--color-bg-card)] rounded-[var(--radius-md)] border border-[var(--color-border)] p-5 flex flex-col gap-3 shadow-[var(--shadow-sm)]",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Skeleton circle className="w-10 h-10 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-2.5 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3.5 w-full mt-1" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  );
}

/* ── Match Card Skeleton (Fixtures & Results) ────────────────────────── */
export function SkeletonMatchCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-[var(--color-bg-card)] rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[var(--shadow-sm)]",
        className
      )}
    >
      <div className="flex items-center justify-center gap-4 flex-1 w-full sm:w-auto">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-12 rounded-[var(--radius-sm)]" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

/* ── Tournament Card Skeleton ────────────────────────────────────────── */
export function SkeletonTournamentCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-sm)]",
        className
      )}
    >
      <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-12 rounded-[var(--radius-sm)]" />
          <Skeleton className="h-12 rounded-[var(--radius-sm)]" />
        </div>
        <Skeleton className="h-9 w-full rounded-[var(--radius-md)]" />
      </div>
    </div>
  );
}

/* ── League Standings Table Skeleton ─────────────────────────────────── */
export function SkeletonStandings({ rows = 4 }: { rows?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-card)]">
      <div className="bg-[var(--color-primary)] h-11 px-4 flex items-center justify-between">
        <Skeleton className="h-4 w-12 bg-white/20" />
        <Skeleton className="h-4 w-32 bg-white/20" />
        <Skeleton className="h-4 w-48 bg-white/20" />
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-6 shrink-0" />
            <Skeleton className="h-4 w-40 flex-1" />
            <div className="flex gap-4 shrink-0">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Generic Data Table Skeleton ─────────────────────────────────────── */
export function SkeletonTable({
  columns = 5,
  rows = 5,
  className,
}: {
  columns?: number;
  rows?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-card)]",
        className
      )}
    >
      <div className="bg-[var(--color-primary)] h-11 px-4 flex items-center gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 bg-white/20" />
        ))}
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3.5 flex items-center gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} className="h-3.5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Responsive Skeleton Grid ────────────────────────────────────────── */
export function SkeletonGrid({
  count = 6,
  columns = 3,
}: {
  count?: number;
  columns?: 2 | 3 | 4;
}) {
  const colClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={cn("grid gap-4", colClass)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/* ── Inline Table Row Skeleton ───────────────────────────────────────── */
export function SkeletonRow({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-[var(--color-border)]">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-3 flex-1" />
      ))}
    </div>
  );
}

/* ── Pre-built Text Block Skeleton ──────────────────────────────────── */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3.5", i === lines - 1 ? "w-3/5" : "w-full")}
        />
      ))}
    </div>
  );
}

/* ── Avatar Skeleton ────────────────────────────────────────────────── */
export function SkeletonAvatar({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const s = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14" }[size];
  return <Skeleton circle className={s} />;
}
