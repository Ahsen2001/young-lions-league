import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="text-center max-w-md">
        {/* 404 display number */}
        <p className="font-display text-[8rem] font-bold leading-none text-[var(--color-primary)]/10 select-none">
          404
        </p>

        <div className="-mt-8">
          <h1 className="font-display text-3xl font-bold text-[var(--color-primary)] mb-3">
            Page not found
          </h1>
          <p className="text-[var(--color-text-muted)] mb-8">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white font-display text-sm tracking-wide uppercase transition-colors hover:bg-[var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              Go home
            </Link>
            <Link
              href="/tournament"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] font-display text-sm tracking-wide uppercase transition-colors hover:bg-[var(--color-bg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              View tournament
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
