import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  /** Height in Tailwind class form e.g. "h-4" */
  height?: string;
  /** Width in Tailwind class form e.g. "w-full" or "w-32" */
  width?: string;
  /** Render as a circle (avatar placeholder) */
  circle?: boolean;
}

/**
 * Skeleton — inline content placeholder.
 * Use in loading.tsx and suspense fallbacks to prevent layout shift.
 */
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

/** Pre-built skeleton for a single card */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-[var(--color-bg-card)] rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 flex flex-col gap-3",
        className
      )}
    >
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

/** Pre-built skeleton for a table row */
export function SkeletonRow({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-[var(--color-border)]">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-3 flex-1" />
      ))}
    </div>
  );
}
