import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  /** h2 section title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Optional right-side action */
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 mb-5 flex-wrap",
        className
      )}
    >
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-[var(--color-text)] tracking-wide">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0 flex items-center">{action}</div>
      )}
    </div>
  );
}
