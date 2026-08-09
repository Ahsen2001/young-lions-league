"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Badge } from "@/components/ui/Badge";
import AdminBreadcrumbs from "./AdminBreadcrumbs";
import { useTournament } from "@/lib/context/TournamentContext";
import { signOutClient } from "@/lib/supabase/auth-client";
import { toast } from "@/components/ui/Toast";

export default function AdminHeader() {
  const { currentTournament } = useTournament();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutClient();
      toast.success("Signed Out", "You have been logged out.");
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <header className="hidden lg:flex h-16 shrink-0 items-center justify-between px-8 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] sticky top-0 z-30">
      {/* Breadcrumbs */}
      <AdminBreadcrumbs />

      {/* Right controls: Active Tournament Pill + Profile Menu */}
      <div className="flex items-center gap-4">
        {/* Active Tournament Indicator */}
        {currentTournament && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-bg-muted)] border border-[var(--color-border)] text-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="font-display font-medium text-[var(--color-primary)] truncate max-w-[200px]">
              {currentTournament.name}
            </span>
            <Badge variant="primary" size="sm">
              {currentTournament.season}
            </Badge>
          </div>
        )}

        {/* User Profile / Logout Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              aria-label="Admin account menu"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white font-display font-bold text-xs flex items-center justify-center border-2 border-[var(--color-accent)]">
                AD
              </div>
              <div className="text-left hidden xl:block">
                <p className="font-display text-xs font-semibold text-[var(--color-text)] leading-none">
                  Admin User
                </p>
                <p className="text-[10px] text-[var(--color-text-subtle)] mt-0.5">
                  admin@younglions.lk
                </p>
              </div>
              <svg
                className="w-4 h-4 text-[var(--color-text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content align="end" className="w-56">
            <DropdownMenu.Label>Signed in as Admin</DropdownMenu.Label>
            <DropdownMenu.Item
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              }
              asChild
            >
              <Link href="/admin/settings">System Settings</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
              asChild
            >
              <Link href="/" target="_blank">
                View Public Site
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              destructive
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              }
              onSelect={handleSignOut}
            >
              Log Out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
