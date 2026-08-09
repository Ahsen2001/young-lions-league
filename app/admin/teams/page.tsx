"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTournament } from "@/lib/context/TournamentContext";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * /admin/teams — Smart redirect shim.
 *
 * Teams are scoped to a tournament. This page reads the active tournament
 * from TournamentContext and immediately redirects to
 * /admin/tournaments/[id]/teams. If no tournament is selected, it shows
 * a helpful prompt to navigate to Tournaments first.
 */
export default function AdminTeamsRedirectPage() {
  const router = useRouter();
  const { currentTournament, isLoading } = useTournament();

  useEffect(() => {
    if (!isLoading && currentTournament?.id) {
      router.replace(`/admin/tournaments/${currentTournament.id}/teams`);
    }
  }, [isLoading, currentTournament, router]);

  // While loading context or redirecting, show a neutral state
  if (isLoading || currentTournament?.id) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3 text-[var(--color-text-muted)]">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Redirecting to teams…</span>
        </div>
      </div>
    );
  }

  // No active tournament — guide the admin
  return (
    <EmptyState
      title="No tournament selected"
      description="Teams are registered under a specific tournament. Please select or create a tournament first, then manage its teams."
      action={
        <div className="flex items-center gap-3">
          <Link href="/admin/tournaments">
            <Button size="sm">Browse Tournaments</Button>
          </Link>
          <Link href="/admin/tournaments/new">
            <Button size="sm" variant="outline">Create Tournament</Button>
          </Link>
        </div>
      }
    />
  );
}
