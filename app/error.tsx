"use client";

// In Next.js 16 the prop is `retry` (not `reset`)
import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // In production, forward to your error-reporting service here
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-error)]/10 mb-6">
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
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        <h2 className="font-display text-2xl font-bold text-[var(--color-text)] mb-2">
          Something went wrong
        </h2>
        <p className="text-[var(--color-text-muted)] mb-1">
          An unexpected error occurred. Please try again.
        </p>

        {/* Show digest in dev for log correlation */}
        {error.digest && (
          <p className="text-xs text-[var(--color-text-subtle)] font-mono mb-6">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => retry()}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white font-display text-sm tracking-wide uppercase transition-colors hover:bg-[var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] font-display text-sm tracking-wide uppercase transition-colors hover:bg-[var(--color-bg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
