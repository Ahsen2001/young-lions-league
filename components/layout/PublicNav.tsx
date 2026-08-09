"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PUBLIC_NAV_ITEMS } from "@/constants/navigation";
import { useTournament } from "@/lib/context/TournamentContext";

export default function PublicNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentTournament } = useTournament();

  // Close mobile drawer when path changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-primary-dark)] bg-[var(--color-primary)] shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Header */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Young Lions League Home"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-accent)] transition-transform group-hover:scale-105 shadow-sm">
              <span className="font-display font-bold text-[var(--color-primary)] text-sm leading-none">
                YL
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-white font-bold text-lg tracking-wide leading-tight">
                YOUNG LIONS SC
              </span>
              <span className="font-display text-[10px] text-[var(--color-secondary)] tracking-widest uppercase font-semibold">
                Oddamavadi League
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
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
                    "font-display text-xs tracking-widest uppercase px-3 py-2 rounded-[var(--radius-sm)] transition-all duration-150",
                    active
                      ? "bg-[var(--color-accent)] text-[var(--color-primary)] font-bold shadow-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Badge / Admin Link */}
          <div className="hidden lg:flex items-center gap-3">
            {currentTournament && (
              <span className="text-[10px] font-display uppercase tracking-wider text-white/70 bg-black/20 px-2.5 py-1 rounded-full border border-white/10">
                {currentTournament.season} Season
              </span>
            )}
            <Link
              href="/admin"
              className="font-display text-xs tracking-widest uppercase px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors font-semibold"
            >
              Admin Portal
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            id="public-mobile-menu-toggle"
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="public-mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[var(--color-overlay)] animate-[overlay-show_150ms_ease]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer menu */}
          <nav
            id="public-mobile-nav"
            aria-label="Mobile public navigation"
            className="relative ml-auto w-4/5 max-w-xs bg-[var(--color-primary)] border-l border-[var(--color-primary-dark)] text-white flex flex-col h-full z-10 animate-[slide-down_200ms_ease]"
          >
            <div className="p-4 border-b border-[var(--color-primary-dark)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] font-display font-bold text-sm flex items-center justify-center">
                  YL
                </div>
                <span className="font-display font-bold text-sm tracking-wide">
                  Menu
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-white/70 hover:text-white hover:bg-white/10"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 py-3 flex flex-col gap-1 flex-1 overflow-y-auto">
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
                      "font-display text-sm tracking-widest uppercase px-4 py-3 rounded-[var(--radius-sm)] transition-colors",
                      active
                        ? "bg-[var(--color-accent)] text-[var(--color-primary)] font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-[var(--color-primary-dark)] bg-black/20">
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block text-center font-display text-xs tracking-widest uppercase py-2.5 px-4 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-primary)] font-bold"
              >
                Go to Admin Portal
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
