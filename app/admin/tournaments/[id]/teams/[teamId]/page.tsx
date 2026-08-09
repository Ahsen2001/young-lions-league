"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard, SkeletonGrid } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchTeamById } from "@/lib/services/team.service";
import { fetchTournamentById } from "@/lib/services/tournament.service";
import { canModifyTeams } from "@/lib/validation/team";
import type { Team } from "@/types";
import type { TournamentWithSettings } from "@/lib/services/tournament.service";

export default function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string; teamId: string }>;
}) {
  const { id, teamId } = use(params);
  const [team, setTeam] = useState<Team | null>(null);
  const [tournament, setTournament] = useState<TournamentWithSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTeamById(teamId), fetchTournamentById(id)])
      .then(([tm, trn]) => {
        setTeam(tm);
        setTournament(trn);
      })
      .finally(() => setLoading(false));
  }, [id, teamId]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <SkeletonCard className="h-32" />
        <SkeletonGrid count={2} />
      </div>
    );
  }

  if (!team) {
    return (
      <EmptyState
        title="Team Not Found"
        description="The requested team record does not exist or has been removed."
        action={
          <Link href={`/admin/tournaments/${id}/teams`}>
            <Button size="sm">Back to Teams List</Button>
          </Link>
        }
      />
    );
  }

  const modifiable = tournament ? canModifyTeams(tournament.status) : true;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title={team.name}
        subtitle={`Short Code: ${team.short_name} · Reg: ${team.registration_number || "—"}`}
        actions={
          <div className="flex gap-2">
            <Link href={`/admin/tournaments/${id}/teams/${team.id}/edit`}>
              <Button size="sm" variant="outline" disabled={!modifiable}>
                Edit Details
              </Button>
            </Link>
            <Link href={`/admin/tournaments/${id}/teams`}>
              <Button size="sm" variant="ghost">
                Back to List
              </Button>
            </Link>
          </div>
        }
      />

      {/* Header Profile Card */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row items-center gap-6 py-6">
          <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)] flex items-center justify-center font-display font-bold text-2xl text-[var(--color-primary)] overflow-hidden shrink-0 shadow-md">
            {team.logo_url ? (
              <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
            ) : (
              team.short_name
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="font-display font-bold text-xl text-[var(--color-primary)]">
                {team.name}
              </h2>
              <Badge variant="primary" size="md">
                {team.short_name}
              </Badge>
              {team.status === "APPROVED" ? (
                <Badge variant="success" size="md" dot>Approved</Badge>
              ) : (
                <Badge variant="warning" size="md" dot>Pending</Badge>
              )}
            </div>

            <p className="text-xs text-[var(--color-text-muted)]">
              Registered for {tournament?.name || "Tournament"} · Created {new Date(team.created_at).toLocaleDateString()}
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Group Allocation & Contact Information Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Draw Group Allocation Card */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-sm text-[var(--color-primary)]">
              Official Draw Allocation
            </h3>
          </CardHeader>
          <CardBody className="space-y-3">
            {team.group_name ? (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-[var(--radius-md)] text-center space-y-1">
                <span className="text-xs font-display uppercase tracking-widest text-green-800">
                  Allocated Group
                </span>
                <p className="font-display font-extrabold text-2xl text-green-900">
                  {team.group_name}
                </p>
              </div>
            ) : (
              <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-center space-y-1">
                <span className="text-xs font-display uppercase tracking-widest text-[var(--color-text-subtle)]">
                  Group Allocation Status
                </span>
                <p className="font-display font-bold text-sm text-[var(--color-text-muted)]">
                  Unassigned — Pending Official Live Draw
                </p>
                <p className="text-[11px] text-[var(--color-text-subtle)] pt-1">
                  Manual group assignment during registration is prohibited by competition rules.
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Management & Contacts */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-sm text-[var(--color-primary)]">
              Management & Contact Personnel
            </h3>
          </CardHeader>
          <CardBody className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">Manager Name</span>
              <span className="font-semibold text-[var(--color-text)]">
                {team.manager_name || "—"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">Captain Name</span>
              <span className="font-semibold text-[var(--color-text)]">
                {team.captain_name || "—"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">Contact Phone</span>
              <span className="font-semibold text-[var(--color-text)]">
                {team.contact_phone || "—"}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[var(--color-text-muted)]">Contact Email</span>
              <span className="font-semibold text-[var(--color-text)]">
                {team.contact_email || "—"}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
