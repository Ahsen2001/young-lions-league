import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const DefaultIcon = () => (
  <svg
    className="w-12 h-12 text-[var(--color-border-strong)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    {/* Football / soccer ball outline */}
    <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
    <path
      strokeWidth={1.5}
      strokeLinecap="round"
      d="M12 2C8.13 2 4.83 4.11 3.18 7.19M12 2c3.87 0 7.17 2.11 8.82 5.19M3.18 7.19 7 9.5M3.18 7.19C2.43 8.6 2 10.25 2 12M7 9.5l1 3.5M7 9.5H4.5M8 13l4 1.5M8 13 6.5 16M12 14.5l4-1.5M12 14.5 13.5 16M16 13l1.5 3M16 13l1-3.5M17 9.5H19.5M17 9.5 20.82 7.19M20.82 7.19C21.57 8.6 22 10.25 22 12M6.5 16C7.5 18.5 9.6 20.4 12 21M6.5 16H9M13.5 16H15M13.5 16C13 18 12.6 20 12 21M9 16c.5 2 1.2 3.8 3 5"
    />
  </svg>
);

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
      role="status"
      aria-label={title}
    >
      <div className="mb-5 opacity-60">{icon ?? <DefaultIcon />}</div>
      <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-2 tracking-wide">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
