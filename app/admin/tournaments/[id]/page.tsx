"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TournamentStatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  fetchTournamentById,
  type TournamentWithSettings,
} from "@/lib/services/tournament.service";
import { FORMAT_DESCRIPTIONS } from "@/lib/validation/tournament";

export default function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [tournament, setTournament] = useState<TournamentWithSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournamentById(id)
      .then((data) => setTournament(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <SkeletonGrid count={4} />
      </div>
    );
  }

  if (!tournament) {
    return (
      <EmptyState
        title="Tournament Not Found"
        description="The requested tournament ID does not exist or has been removed."
        action={
          <Link href="/admin/tournaments">
            <Button size="sm">Back to Tournaments</Button>
          </Link>
        }
      />
    );
  }

  const formatInfo = FORMAT_DESCRIPTIONS[tournament.format];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title={tournament.name}
        subtitle={`Season ${tournament.season} · ID: ${tournament.id}`}
        actions={
          <div className="flex gap-2">
            <Link href={`/admin/tournaments/${tournament.id}/settings`}>
              <Button size="sm" variant="outline">
                Edit Settings
              </Button>
            </Link>
            <Link href="/admin/tournaments">
              <Button size="sm" variant="ghost">
                Back to List
              </Button>
            </Link>
          </div>
        }
      />

      <div className="-mt-4 flex items-center gap-3">
        <TournamentStatusBadge status={tournament.status} />
        <Badge variant="primary">
          {tournament.format === "GROUP_SEMI_FINAL"
            ? "Format A"
            : tournament.format === "GROUP_QUARTER_SEMI_FINAL"
            ? "Format B"
            : "Format C"}
        </Badge>
      </div>

      {/* Quick Navigation Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/admin/teams">
          <Card hoverable className="text-center py-4 space-y-1">
            <span className="font-display font-bold text-sm text-[var(--color-primary)]">
              Teams & Roster
            </span>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Manage participating clubs
            </p>
          </Card>
        </Link>
        <Link href="/admin/draw">
          <Card hoverable className="text-center py-4 space-y-1">
            <span className="font-display font-bold text-sm text-[var(--color-primary)]">
              Live Draw
            </span>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Allocate teams into groups
            </p>
          </Card>
        </Link>
        <Link href="/admin/fixtures">
          <Card hoverable className="text-center py-4 space-y-1">
            <span className="font-display font-bold text-sm text-[var(--color-primary)]">
              Fixtures & Results
            </span>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Generate & record scores
            </p>
          </Card>
        </Link>
        <Link href="/admin/standings">
          <Card hoverable className="text-center py-4 space-y-1">
            <span className="font-display font-bold text-sm text-[var(--color-primary)]">
              Group Standings
            </span>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              View live derived tables
            </p>
          </Card>
        </Link>
      </div>

      {/* Format & Rules Banner */}
      <Card>
        <CardHeader>
          <h3 className="font-display font-bold text-sm text-[var(--color-primary)]">
            Competition Format Rules
          </h3>
        </CardHeader>
        <CardBody className="space-y-2">
          <h4 className="font-semibold text-xs text-[var(--color-text)]">
            {formatInfo.title}
          </h4>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            {formatInfo.description}
          </p>
          <div className="p-3 bg-[var(--color-bg)] rounded-[var(--radius-sm)] border border-[var(--color-border)] mt-2">
            <span className="text-[11px] font-display uppercase tracking-widest text-[var(--color-text-subtle)] block mb-1">
              Progression Path
            </span>
            <p className="text-xs font-bold text-[var(--color-primary)]">
              {formatInfo.progression}
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Settings Summary Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-sm text-[var(--color-primary)]">
              Group Structure & Capacity
            </h3>
          </CardHeader>
          <CardBody className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">Total Groups</span>
              <span className="font-bold text-[var(--color-text)]">
                {tournament.settings?.num_groups || 4} Groups (Group A - Group D)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">Teams Per Group</span>
              <span className="font-bold text-[var(--color-text)]">
                {tournament.settings?.teams_per_group || 4} Teams
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">Total Maximum Teams</span>
              <span className="font-bold text-[var(--color-text)]">
                {tournament.settings?.max_teams || 16} Teams
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[var(--color-text-muted)]">Advancing Per Group</span>
              <span className="font-bold text-[var(--color-text)]">
                Top {tournament.settings?.teams_advancing_per_group || 2} Teams
              </span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-sm text-[var(--color-primary)]">
              Points & Match Rules
            </h3>
          </CardHeader>
          <CardBody className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">Points For Win</span>
              <span className="font-bold text-green-700">
                +{tournament.settings?.points_for_win ?? 3} Points
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">Points For Draw</span>
              <span className="font-bold text-amber-700">
                +{tournament.settings?.points_for_draw ?? 1} Point
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">Points For Loss</span>
              <span className="font-bold text-red-700">
                {tournament.settings?.points_for_loss ?? 0} Points
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[var(--color-text-muted)]">Group Stage Draws</span>
              <span className="font-bold text-[var(--color-text)]">
                {tournament.settings?.allow_draws_in_group ? "Allowed" : "No Draws (Shootout)"}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
