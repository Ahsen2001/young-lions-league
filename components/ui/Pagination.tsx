"use client";

import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Pages shown either side of current (default 1) */
  siblingCount?: number;
  className?: string;
  /** Show total info string */
  totalItems?: number;
  pageSize?: number;
}

function getPageNumbers(current: number, total: number, sibling: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const leftSibling = Math.max(current - sibling, 1);
  const rightSibling = Math.min(current + sibling, total);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from({ length: 3 + 2 * sibling }, (_, i) => i + 1);
    return [...leftRange, "…", total];
  }
  if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: 3 + 2 * sibling },
      (_, i) => total - (3 + 2 * sibling) + i + 1
    );
    return [1, "…", ...rightRange];
  }
  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i
  );
  return [1, "…", ...middleRange, "…", total];
}

const btnBase =
  "inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-[var(--radius-sm)] text-sm font-display tracking-wide transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  totalItems,
  pageSize,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages, siblingCount);

  const start = pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const end = pageSize ? Math.min(currentPage * pageSize, totalItems ?? 0) : null;

  return (
    <div className={cn("flex items-center justify-between gap-4 flex-wrap", className)}>
      {/* Info text */}
      {totalItems != null && pageSize != null ? (
        <p className="text-xs text-[var(--color-text-muted)]">
          Showing <span className="font-semibold">{start}</span>–
          <span className="font-semibold">{end}</span> of{" "}
          <span className="font-semibold">{totalItems}</span>
        </p>
      ) : (
        <p className="text-xs text-[var(--color-text-muted)]">
          Page <span className="font-semibold">{currentPage}</span> of{" "}
          <span className="font-semibold">{totalPages}</span>
        </p>
      )}

      {/* Controls */}
      <nav aria-label="Pagination" className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className={cn(
            btnBase,
            "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]"
          )}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page numbers */}
        {pages.map((page, i) =>
          page === "…" ? (
            <span key={`dots-${i}`} className="px-1.5 text-sm text-[var(--color-text-subtle)]" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                btnBase,
                page === currentPage
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]"
              )}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className={cn(
            btnBase,
            "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]"
          )}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
