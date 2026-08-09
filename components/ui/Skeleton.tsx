import { cn } from "@/lib/utils";

/* ── Inline skeleton ─────────────────────────────────────────────────── */
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

/* ── Pre-built card skeleton ─────────────────────────────────────────── */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-[var(--color-bg-card)] rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Skeleton circle className="w-9 h-9 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  );
}

/* ── Pre-built table-row skeleton ────────────────────────────────────── */
export function SkeletonRow({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-[var(--color-border)]">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-3 flex-1" />
      ))}
    </div>
  );
}

/* ── Pre-built text block skeleton ──────────────────────────────────── */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3", i === lines - 1 ? "w-3/5" : "w-full")}
        />
      ))}
    </div>
  );
}

/* ── Pre-built avatar skeleton ───────────────────────────────────────── */
export function SkeletonAvatar({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const s = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14" }[size];
  return <Skeleton circle className={s} />;
}
