"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "@/constants/navigation";
import { useState } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-[var(--color-border)] bg-[var(--color-primary)] transition-all duration-300",
          collapsed ? "w-16" : "w-56"
        )}
        aria-label="Admin navigation"
      >
        {/* Brand header */}
        <div className="flex items-center gap-3 h-16 px-4 border-b border-[var(--color-primary-dark)]">
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-accent)]">
            <span className="font-display font-bold text-[var(--color-primary)] text-xs leading-none">
              YL
            </span>
          </div>
          {!collapsed && (
            <span className="font-display text-white font-semibold text-sm tracking-wide whitespace-nowrap overflow-hidden">
              Admin Panel
            </span>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-0.5">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] font-display text-xs tracking-widest uppercase transition-colors",
                  active
                    ? "bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
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

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center justify-center h-12 border-t border-[var(--color-primary-dark)] text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* Mobile top bar — shown on small screens */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center gap-4 px-4 bg-[var(--color-primary)] border-b border-[var(--color-primary-dark)]">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-accent)]">
          <span className="font-display font-bold text-[var(--color-primary)] text-xs">YL</span>
        </div>
        <span className="font-display text-white font-semibold text-sm tracking-wide">
          Admin
        </span>
        {/* Mobile nav items would be a drawer — implemented in a later sprint */}
      </div>
      {/* Push content below mobile bar */}
      <div className="lg:hidden h-14" aria-hidden="true" />
    </>
  );
}
