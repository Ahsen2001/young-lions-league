import { cn } from "@/lib/utils";
import Link from "next/link";

/* ── Breadcrumb item ─────────────────────────────────────────────────── */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/* ── Props ───────────────────────────────────────────────────────────── */
export interface PageHeaderProps {
  /** h1 page title */
  title: string;
  /** Optional subtitle / description */
  subtitle?: string;
  /** Breadcrumb trail — last item is current page (no href needed) */
  breadcrumbs?: BreadcrumbItem[];
  /** Action buttons / controls rendered on the right */
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2 mb-8", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-[var(--color-text-muted)]">
            {breadcrumbs.map((item, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <li key={i} className="flex items-center gap-1">
                  {i > 0 && (
                    <span aria-hidden="true" className="opacity-50">
                      /
                    </span>
                  )}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="hover:text-[var(--color-primary)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={
                        isLast ? "text-[var(--color-text-subtle)]" : undefined
                      }
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--color-primary)] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-[var(--color-text-muted)] text-sm sm:text-base max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>

      {/* Accent line */}
      <div className="h-1 w-16 rounded-full bg-[var(--color-accent)]" />
    </div>
  );
}
