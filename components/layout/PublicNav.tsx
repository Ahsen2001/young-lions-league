"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PUBLIC_NAV_ITEMS } from "@/constants/navigation";
import { useState } from "react";

export default function PublicNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-primary-dark)] bg-[var(--color-primary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Young Lions League Home"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-accent)] transition-transform group-hover:scale-105">
              <span className="font-display font-bold text-[var(--color-primary)] text-sm leading-none">
                YL
              </span>
            </div>
            <span className="font-display text-white font-semibold text-lg tracking-wide hidden sm:block">
              Young Lions
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-display text-sm tracking-widest uppercase px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors",
                    active
                      ? "bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu toggle */}
          <button
            id="mobile-menu-toggle"
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] text-white hover:bg-white/10 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="md:hidden border-t border-[var(--color-primary-dark)] bg-[var(--color-primary)]"
        >
          <div className="px-4 py-3 flex flex-col gap-1">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "font-display text-sm tracking-widest uppercase px-3 py-2 rounded-[var(--radius-sm)] transition-colors",
                    active
                      ? "bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
