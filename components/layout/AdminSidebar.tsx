"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "@/constants/navigation";
import { useTournament } from "@/lib/context/TournamentContext";
import { Select } from "@/components/ui/Select";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { currentTournament, tournaments, setCurrentTournament } = useTournament();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-[var(--color-primary-dark)] bg-[var(--color-primary)] text-white transition-all duration-200 shrink-0 sticky top-0 h-screen z-30",
        collapsed ? "w-16" : "w-60"
      )}
      aria-label="Admin navigation"
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-[var(--color-primary-dark)] shrink-0">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-accent)] transition-transform group-hover:scale-105">
            <span className="font-display font-bold text-[var(--color-primary)] text-sm leading-none">
              YL
            </span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <span className="font-display text-white font-bold text-base tracking-wide whitespace-nowrap block leading-tight">
                Young Lions
              </span>
              <span className="text-[10px] text-[var(--color-secondary)] uppercase tracking-widest block font-display">
                Admin Panel
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Tournament Selector Near Top */}
      {!collapsed && (
        <div className="p-3 border-b border-[var(--color-primary-dark)] bg-black/15">
          <label className="block text-[10px] font-display uppercase tracking-widest text-[var(--color-accent)] font-semibold mb-1">
            Active Tournament
          </label>
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
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-1 scrollbar-thin">
        {ADMIN_NAV_ITEMS.map((item) => {
          // Teams are tournament-scoped — resolve the href dynamically
          const resolvedHref =
            item.label === "Teams" && currentTournament?.id
              ? `/admin/tournaments/${currentTournament.id}/teams`
              : item.href;

          // Active detection — each label owns its path segment exclusively.
          // Teams owns any path containing /teams (even under /tournaments/[id]/teams).
          // Tournaments is only active on pure tournament routes, NOT on teams sub-routes.
          let active = false;
          if (item.href === "/admin") {
            active = pathname === "/admin";
          } else if (item.label === "Teams") {
            active = pathname.includes("/teams");
          } else if (item.label === "Tournaments") {
            // Active on /admin/tournaments and /admin/tournaments/[id] but NOT when
            // a more-specific item (Teams) owns the path.
            active =
              pathname.startsWith("/admin/tournaments") &&
              !pathname.includes("/teams");
          } else {
            active = pathname.startsWith(item.href);
          }

          return (
            <Link
              key={item.href}
              href={resolvedHref}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] font-display text-xs tracking-widest uppercase transition-all duration-150",
                active
                  ? "bg-[var(--color-accent)] text-[var(--color-primary)] font-bold shadow-[var(--shadow-sm)]"
                  : "text-white/75 hover:text-white hover:bg-white/10"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span className="flex-shrink-0 text-base">{item.icon}</span>
              {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse/Expand Footer Toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-center h-12 border-t border-[var(--color-primary-dark)] text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg
          className={cn("w-4 h-4 transition-transform duration-200", collapsed && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
        </svg>
        {!collapsed && (
          <span className="ml-2 font-display text-xs tracking-widest uppercase text-white/60">
            Collapse
          </span>
        )}
      </button>
    </aside>
  );
}
