"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS, ROUTE_LABELS } from "@/constants/navigation";
import { useTournament } from "@/lib/context/TournamentContext";
import { Select } from "@/components/ui/Select";
import { signOutClient } from "@/lib/supabase/auth-client";
import { toast } from "@/components/ui/Toast";

export default function AdminMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { currentTournament, tournaments, setCurrentTournament } = useTournament();

  // Close drawer when path changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSignOut = async () => {
    try {
      setOpen(false);
      await signOutClient();
      toast.success("Signed Out", "You have been logged out.");
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  // Get active route title
  const currentSegment = pathname.split("/").filter(Boolean).pop() || "admin";
  const pageTitle = ROUTE_LABELS[currentSegment] || "Admin Dashboard";

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[var(--color-primary)] border-b border-[var(--color-primary-dark)] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open admin navigation drawer"
            className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] shrink-0"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-display font-bold text-white text-sm tracking-wide truncate">
              {pageTitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] font-display font-bold text-xs flex items-center justify-center">
            YL
          </div>
        </div>
      </header>

      {/* Push content below mobile top bar */}
      <div className="lg:hidden h-14" aria-hidden="true" />

      {/* Mobile Drawer Backdrop & Menu */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[var(--color-overlay)] animate-[overlay-show_200ms_ease]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-[var(--color-primary)] text-white flex flex-col h-full shadow-[var(--shadow-lg)] animate-[slide-down_200ms_ease] z-10">
            {/* Header */}
            <div className="p-4 border-b border-[var(--color-primary-dark)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] font-display font-bold text-sm flex items-center justify-center">
                  YL
                </div>
                <div>
                  <p className="font-display font-bold text-sm tracking-wide">
                    Admin Panel
                  </p>
                  <p className="text-[10px] text-white/60">Young Lions SC</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-white/70 hover:text-white hover:bg-white/10"
                aria-label="Close navigation drawer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tournament Selector in Mobile Drawer */}
            <div className="p-4 border-b border-[var(--color-primary-dark)] bg-black/10">
              <p className="text-[10px] font-display uppercase tracking-widest text-[var(--color-accent)] font-semibold mb-1.5">
                Active Tournament
              </p>
              <Select
                value={currentTournament?.id}
                onValueChange={(val) => {
                  const selected = tournaments.find((t) => t.id === val);
                  if (selected) setCurrentTournament(selected);
                }}
                options={tournaments.map((t) => ({
                  value: t.id,
                  label: `${t.name} (${t.season})`,
                }))}
              />
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {ADMIN_NAV_ITEMS.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] font-display text-sm tracking-widest uppercase transition-colors",
                      active
                        ? "bg-[var(--color-accent)] text-[var(--color-primary)] font-bold shadow-[var(--shadow-sm)]"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Info & Logout Footer */}
            <div className="p-4 border-t border-[var(--color-primary-dark)] bg-black/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] font-display font-bold text-xs flex items-center justify-center">
                  AD
                </div>
                <div>
                  <p className="font-display text-xs font-semibold">Admin User</p>
                  <p className="text-[10px] text-white/60">admin@younglions.lk</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10"
                title="Log out"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
