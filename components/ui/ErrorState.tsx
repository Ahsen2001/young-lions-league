import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  /** Error message or digest for display */
  detail?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  detail,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Warning icon */}
      <div className="mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-error-bg)]">
        <svg
          className="w-8 h-8 text-[var(--color-error)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-2 tracking-wide">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm mb-2">
          {description}
        </p>
      )}
      {detail && (
        <p className="text-xs font-mono text-[var(--color-text-subtle)] mb-6">
          {detail}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
