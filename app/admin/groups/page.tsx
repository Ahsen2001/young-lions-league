"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTournament } from "@/lib/context/TournamentContext";
import { fetchDrawState, type DrawState } from "@/lib/services/draw.service";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonGrid } from "@/components/ui/Skeleton";

export default function AdminGroupsPage() {
  const { currentTournament } = useTournament();
  const tournamentId = currentTournament?.id || "trn-2025-01";

  const [drawState, setDrawState] = useState<DrawState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadGroups = useCallback(async () => {
    try {
      const state = await fetchDrawState(tournamentId);
      setDrawState(state);
    } catch (err) {
      console.error("Error loading group state:", err);
    } finally {
      setIsLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  if (isLoading || !drawState) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse h-12 bg-[var(--color-bg-card)] rounded-[var(--radius-md)] w-64" />
        <SkeletonGrid columns={2} />
      </div>
    );
  }

  const groupACount = drawState.group_a_teams.length;
  const groupBCount = drawState.group_b_teams.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Group Stage Management"
        subtitle={`${currentTournament?.name || "Young Lions Super League"} • Official Group Allocation`}
        actions={
          <Link href={`/admin/tournaments/${tournamentId}/draw`}>
            <Button variant="accent" size="sm">
              🎲 Open Draw Control Center
            </Button>
          </Link>
        }
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {/* GROUP A */}
        <Card padding="none" className="border-t-4 border-t-blue-600">
          <CardHeader className="bg-blue-900 text-white flex items-center justify-between">
            <span className="font-display font-bold text-lg">Group A Roster</span>
            <Badge variant="primary" size="sm">
              {groupACount} / 4 Teams
            </Badge>
          </CardHeader>
          <CardBody className="p-0 divide-y divide-[var(--color-border)]">
            {groupACount === 0 ? (
              <div className="p-6 text-center text-xs text-[var(--color-text-muted)]">
                No teams allocated to Group A yet. Draw pending.
              </div>
            ) : (
              drawState.group_a_teams.map((team, idx) => (
                <div key={team.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 font-display text-xs font-extrabold flex items-center justify-center">
                      A{idx + 1}
                    </span>
                    <span className="font-display font-bold text-sm text-[var(--color-text)]">
                      {team.name}
                    </span>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {team.short_name}
                  </Badge>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* GROUP B */}
        <Card padding="none" className="border-t-4 border-t-amber-600">
          <CardHeader className="bg-amber-900 text-white flex items-center justify-between">
            <span className="font-display font-bold text-lg">Group B Roster</span>
            <Badge variant="accent" size="sm">
              {groupBCount} / 4 Teams
            </Badge>
          </CardHeader>
          <CardBody className="p-0 divide-y divide-[var(--color-border)]">
            {groupBCount === 0 ? (
              <div className="p-6 text-center text-xs text-[var(--color-text-muted)]">
                No teams allocated to Group B yet. Draw pending.
              </div>
            ) : (
              drawState.group_b_teams.map((team, idx) => (
                <div key={team.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-display text-xs font-extrabold flex items-center justify-center">
                      B{idx + 1}
                    </span>
                    <span className="font-display font-bold text-sm text-[var(--color-text)]">
                      {team.name}
                    </span>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {team.short_name}
                  </Badge>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
