"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { toast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard, SkeletonGrid } from "@/components/ui/Skeleton";
import {
  fetchDrawState,
  drawSingleTeam,
  completeDraw,
  lockDraw,
  resetDraw,
  type DrawState,
  type DrawSingleTeamResult,
} from "@/lib/services/draw.service";
import { fetchTournamentById } from "@/lib/services/tournament.service";
import type { TournamentStatus } from "@/types";

export default function AdminDrawControlPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const tournamentId = params.id;

  const [tournamentName, setTournamentName] = useState<string>("Loading Tournament...");
  const [tournamentStatus, setTournamentStatus] = useState<TournamentStatus>("DRAFT");
  const [drawState, setDrawState] = useState<DrawState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // SPIN State
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastDrawResult, setLastDrawResult] = useState<DrawSingleTeamResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // Modals & Action States
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

  // Load Draw State
  const loadData = useCallback(async () => {
    try {
      const [tData, dState] = await Promise.all([
        fetchTournamentById(tournamentId),
        fetchDrawState(tournamentId),
      ]);

      if (tData) {
        setTournamentName(tData.name);
        setTournamentStatus(tData.status);
      }

      setDrawState(dState);

      // Auto-select first undrawn team if not set
      if (
        dState.undrawn_teams.length > 0 &&
        (!selectedTeamId || !dState.undrawn_teams.some((t) => t.id === selectedTeamId))
      ) {
        setSelectedTeamId(dState.undrawn_teams[0].id);
      }
    } catch (err) {
      console.error("Error loading draw data:", err);
      toast.error("Failed to Load Draw Data", "Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }, [tournamentId, selectedTeamId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle SPIN Allocation
  const handleSpinDraw = async () => {
    if (!selectedTeamId) {
      toast.error("No Team Selected", "Please select an undrawn team to spin.");
      return;
    }

    if (isSpinning) return; // Prevent double clicks

    setIsSpinning(true);

    try {
      // Execute Atomic Draw Operation on Database/Server first
      const result = await drawSingleTeam(tournamentId, selectedTeamId);

      // Reload state to synchronize
      await loadData();

      setLastDrawResult(result);
      setShowResultModal(true);

      toast.success(
        `Drawn to ${result.group_name}!`,
        `${result.team_name} assigned position #${result.drawn_position}`
      );
    } catch (err: any) {
      console.error("[Draw Spin Error]", err);
      toast.error("Draw Operation Failed", err.message || "Could not allocate team.");
    } finally {
      setIsSpinning(false);
    }
  };

  // Handle Complete Draw
  const handleCompleteDraw = async () => {
    setIsCompleting(true);
    try {
      await completeDraw(tournamentId);
      setTournamentStatus("DRAW_COMPLETED");
      toast.success("Draw Marked Completed", "Tournament status updated to DRAW_COMPLETED.");
      await loadData();
    } catch (err: any) {
      toast.error("Failed to Complete Draw", err.message);
    } finally {
      setIsCompleting(false);
    }
  };

  // Handle Lock Draw
  const handleLockDraw = async () => {
    setIsLocking(true);
    try {
      await lockDraw(tournamentId);
      setTournamentStatus("DRAW_LOCKED");
      toast.success("Draw Locked Successfully", "Official group assignments locked.");
      await loadData();
    } catch (err: any) {
      toast.error("Failed to Lock Draw", err.message);
    } finally {
      setIsLocking(false);
    }
  };

  // Handle Reset Draw
  const handleConfirmReset = async () => {
    if (resetConfirmInput.trim().toUpperCase() !== "RESET") {
      toast.error("Invalid Confirmation", "Please type RESET to confirm.");
      return;
    }

    setIsResetting(true);
    try {
      await resetDraw(tournamentId);
      setShowResetDialog(false);
      setResetConfirmInput("");
      setTournamentStatus("READY_FOR_DRAW");
      toast.info("Draw Reset", "All group allocations cleared.");
      await loadData();
    } catch (err: any) {
      toast.error("Reset Failed", err.message);
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading || !drawState) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse flex justify-between items-center h-12 bg-[var(--color-bg-card)] rounded-[var(--radius-md)]" />
        <SkeletonGrid columns={4} />
        <SkeletonCard className="h-96" />
      </div>
    );
  }

  const isLocked =
    tournamentStatus === "DRAW_LOCKED" ||
    tournamentStatus === "FIXTURES_GENERATED" ||
    tournamentStatus === "TOURNAMENT_IN_PROGRESS";
  const totalTeams = drawState.all_teams.length || 8;
  const drawnCount = drawState.draw_records.length;
  const progressPercent = Math.round((drawnCount / totalTeams) * 100);

  const groupACount = drawState.group_a_teams.length;
  const groupBCount = drawState.group_b_teams.length;
  const maxPerGroup = drawState.max_teams_per_group || 4;

  const selectedTeam = drawState.undrawn_teams.find((t) => t.id === selectedTeamId);

  const badgeVariant: BadgeVariant =
    tournamentStatus === "DRAW_LOCKED"
      ? "accent"
      : tournamentStatus === "DRAW_COMPLETED"
      ? "success"
      : tournamentStatus === "DRAW_IN_PROGRESS"
      ? "primary"
      : "neutral";

  return (
    <div className="space-y-6 pb-12">
      {/* Back Navigation & Page Header */}
      <div>
        <Link
          href={`/admin/tournaments/${tournamentId}`}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tournament Overview
        </Link>

        <PageHeader
          title="Official Live Draw Engine"
          subtitle={`${tournamentName} • Group A & Group B Allocation`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={badgeVariant} size="md">
                {tournamentStatus.replace(/_/g, " ")}
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/draw/${tournamentId}`, "_blank")}
              >
                Open Ceremony View
              </Button>

              <Link href="/admin/groups">
                <Button variant="secondary" size="sm">
                  View Groups
                </Button>
              </Link>

              {isLocked ? (
                <Link href="/admin/fixtures">
                  <Button variant="accent" size="sm">
                    📅 Generate Fixtures
                  </Button>
                </Link>
              ) : drawnCount >= totalTeams && tournamentStatus !== "DRAW_COMPLETED" ? (
                <Button variant="secondary" size="sm" loading={isCompleting} onClick={handleCompleteDraw}>
                  Complete Draw
                </Button>
              ) : tournamentStatus === "DRAW_COMPLETED" ? (
                <Button variant="primary" size="sm" loading={isLocking} onClick={handleLockDraw}>
                  🔒 Lock Draw
                </Button>
              ) : null}

              {!isLocked && drawnCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--color-error)] hover:bg-[var(--color-error-bg)]"
                  onClick={() => setShowResetDialog(true)}
                >
                  Reset Draw
                </Button>
              )}
            </div>
          }
        />
      </div>

      {/* DRAW COMPLETE / LOCKED BANNER */}
      {(tournamentStatus === "DRAW_COMPLETED" || tournamentStatus === "DRAW_LOCKED") && (
        <Card padding="lg" className="border-l-8 border-l-[var(--color-success)] bg-[var(--color-success-bg)]/20 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <h3 className="font-display font-extrabold text-xl text-[var(--color-primary)] uppercase tracking-wide">
                  {tournamentStatus === "DRAW_LOCKED" ? "OFFICIAL DRAW LOCKED" : "DRAW COMPLETED"}
                </h3>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                {tournamentStatus === "DRAW_LOCKED"
                  ? "All group assignments are permanently locked. Fixture generation and Road to Final bracket structure are now unlocked."
                  : "All 8 teams have been allocated. Please review rosters and click Lock Draw to finalize."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/admin/groups">
                <Button variant="outline" size="sm">
                  View Groups
                </Button>
              </Link>
              {tournamentStatus === "DRAW_COMPLETED" && (
                <Button variant="accent" size="sm" loading={isLocking} onClick={handleLockDraw}>
                  🔒 Lock Draw Now
                </Button>
              )}
              {isLocked && (
                <Link href="/admin/fixtures">
                  <Button variant="primary" size="sm">
                    📅 Proceed to Fixtures
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md" className="border-l-4 border-l-[var(--color-primary)]">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
            Registered Teams
          </p>
          <p className="text-2xl font-bold font-display text-[var(--color-primary)] mt-1">
            {totalTeams}
          </p>
        </Card>

        <Card padding="md" className="border-l-4 border-l-[var(--color-accent)]">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
            Drawn Progress
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-display text-[var(--color-primary)]">
              {drawnCount} / {totalTeams}
            </span>
            <span className="text-xs text-[var(--color-accent-dark)] font-semibold">
              ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-[var(--color-bg-muted)] h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[var(--color-accent)] h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </Card>

        <Card padding="md" className="border-l-4 border-l-blue-600">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
            Group A Capacity
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-display text-blue-700">
              {groupACount} / {maxPerGroup}
            </span>
            {groupACount >= maxPerGroup && <Badge variant="error" size="sm">FULL</Badge>}
          </div>
        </Card>

        <Card padding="md" className="border-l-4 border-l-amber-600">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
            Group B Capacity
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-display text-amber-700">
              {groupBCount} / {maxPerGroup}
            </span>
            {groupBCount >= maxPerGroup && <Badge variant="error" size="sm">FULL</Badge>}
          </div>
        </Card>
      </div>

      {/* ROAD TO THE FINAL BRACKET STRUCTURE PREVIEW */}
      <Card padding="lg" className="space-y-4 border-t-4 border-t-[var(--color-primary)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--color-primary)] uppercase tracking-wide">
              🥊 Road to the Final — Knockout Bracket Preview
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Placeholder bracket structure based on Group A and Group B standings
            </p>
          </div>
          <Badge variant={isLocked ? "success" : "neutral"} size="sm">
            {isLocked ? "KNOCKOUT UNLOCKED" : "PLACEHOLDER BRACKET"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {/* Semi Final 1 */}
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-muted)] border border-[var(--color-border)] space-y-2">
            <span className="text-xs font-bold text-[var(--color-primary)] uppercase font-display">
              Semi Final 1
            </span>
            <div className="p-2 bg-white rounded border border-[var(--color-border)] text-xs font-bold text-gray-700">
              Group A Winner (A1)
            </div>
            <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">vs</span>
            <div className="p-2 bg-white rounded border border-[var(--color-border)] text-xs font-bold text-gray-700">
              Group B Runner-Up (B2)
            </div>
          </div>

          {/* Semi Final 2 */}
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-muted)] border border-[var(--color-border)] space-y-2">
            <span className="text-xs font-bold text-[var(--color-primary)] uppercase font-display">
              Semi Final 2
            </span>
            <div className="p-2 bg-white rounded border border-[var(--color-border)] text-xs font-bold text-gray-700">
              Group B Winner (B1)
            </div>
            <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">vs</span>
            <div className="p-2 bg-white rounded border border-[var(--color-border)] text-xs font-bold text-gray-700">
              Group A Runner-Up (A2)
            </div>
          </div>

          {/* Grand Final */}
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-accent)]/15 border-2 border-[var(--color-accent)] space-y-2">
            <span className="text-xs font-extrabold text-[var(--color-accent-dark)] uppercase font-display">
              🏆 GRAND FINAL
            </span>
            <div className="p-2 bg-white rounded border border-[var(--color-accent)]/40 text-xs font-bold text-[var(--color-primary)]">
              Winner Semi Final 1
            </div>
            <span className="text-[10px] text-[var(--color-accent-dark)] uppercase font-bold">vs</span>
            <div className="p-2 bg-white rounded border border-[var(--color-accent)]/40 text-xs font-bold text-[var(--color-primary)]">
              Winner Semi Final 2
            </div>
          </div>
        </div>
      </Card>

      {/* Main Control Panel: Spin Section & Live Rosters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: SPIN Allocation Control */}
        <Card padding="lg" className="lg:col-span-1 border-t-4 border-t-[var(--color-accent)] space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--color-primary)]">
              SPIN & Allocation Control
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Select team and trigger atomic group allocation
            </p>
          </div>

          {isLocked ? (
            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-muted)] text-center space-y-2 border border-[var(--color-border)]">
              <Badge variant="accent">DRAW LOCKED</Badge>
              <p className="text-xs text-[var(--color-text-muted)]">
                The draw is locked. Group memberships cannot be edited.
              </p>
            </div>
          ) : drawState.undrawn_teams.length === 0 ? (
            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-success-bg)] text-center space-y-2 border border-[var(--color-success)]/30">
              <Badge variant="success">ALL TEAMS DRAWN</Badge>
              <p className="text-xs text-[#15803d] font-medium">
                Every registered team has been allocated to a group!
              </p>
              {tournamentStatus !== "DRAW_COMPLETED" && (
                <Button variant="primary" size="sm" onClick={handleCompleteDraw} loading={isCompleting}>
                  Complete Draw Ceremony
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Undrawn Team Selector */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-2">
                  Select Team to Draw
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  disabled={isSpinning}
                  className="w-full h-11 px-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
                >
                  {drawState.undrawn_teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.short_name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Team Preview Card */}
              {selectedTeam && (
                <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-muted)] border border-[var(--color-border)] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center font-bold text-sm text-[var(--color-primary)] overflow-hidden shrink-0 shadow-sm">
                    {selectedTeam.logo_url ? (
                      <img src={selectedTeam.logo_url} alt={selectedTeam.name} className="w-full h-full object-cover" />
                    ) : (
                      selectedTeam.short_name
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[var(--color-primary)]">{selectedTeam.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Code: {selectedTeam.short_name}</p>
                  </div>
                </div>
              )}

              {/* Big SPIN Action Button */}
              <Button
                variant="accent"
                size="lg"
                fullWidth
                disabled={isSpinning || !selectedTeamId}
                loading={isSpinning}
                onClick={handleSpinDraw}
                className="h-14 font-display text-base font-extrabold shadow-[var(--shadow-md)]"
              >
                {isSpinning ? "SPINNING & ALLOCATING…" : "🎲 SPIN & ALLOCATE GROUP"}
              </Button>
            </div>
          )}
        </Card>

        {/* Right Column: Group A & Group B Live Rosters */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group A Roster */}
          <Card padding="md" className="border-t-4 border-t-blue-600 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div>
                <h4 className="font-display font-bold text-lg text-blue-700">GROUP A</h4>
                <p className="text-xs text-[var(--color-text-muted)]">Allocated Teams (Read-Only)</p>
              </div>
              <Badge variant="primary" size="sm">
                {groupACount} / {maxPerGroup}
              </Badge>
            </div>

            {groupACount === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--color-text-muted)] border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-md)]">
                No teams allocated to Group A yet.
              </div>
            ) : (
              <div className="space-y-2">
                {drawState.group_a_teams.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-bg-muted)] border border-[var(--color-border)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-sm text-[var(--color-text)]">{t.name}</span>
                    </div>
                    <Badge variant="neutral" size="sm">{t.short_name}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Group B Roster */}
          <Card padding="md" className="border-t-4 border-t-amber-600 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div>
                <h4 className="font-display font-bold text-lg text-amber-700">GROUP B</h4>
                <p className="text-xs text-[var(--color-text-muted)]">Allocated Teams (Read-Only)</p>
              </div>
              <Badge variant="accent" size="sm">
                {groupBCount} / {maxPerGroup}
              </Badge>
            </div>

            {groupBCount === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--color-text-muted)] border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-md)]">
                No teams allocated to Group B yet.
              </div>
            ) : (
              <div className="space-y-2">
                {drawState.group_b_teams.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-bg-muted)] border border-[var(--color-border)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-sm text-[var(--color-text)]">{t.name}</span>
                    </div>
                    <Badge variant="neutral" size="sm">{t.short_name}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Draw History & Audit Trail */}
      <Card padding="lg" className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--color-primary)]">
              Chronological Draw History & Audit Log
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Official timestamped log of draw order assignments and status transitions
            </p>
          </div>
          <Badge variant="neutral" size="sm">
            {drawState.draw_records.length} Draws • {drawState.draw_audit_logs.length} Audit Logs
          </Badge>
        </div>

        {drawState.draw_records.length === 0 ? (
          <EmptyState
            title="No Draws Performed Yet"
            description="Select an undrawn team and click SPIN to start official group allocation."
          />
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {drawState.draw_records.map((record) => {
              const team = drawState.all_teams.find((t) => t.id === record.team_id);
              const isGroupA = record.group_id.includes("grp-a");
              return (
                <div key={record.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[var(--color-bg-muted)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-primary)] flex items-center justify-center">
                      #{record.drawn_position}
                    </span>
                    <div>
                      <p className="font-bold text-sm text-[var(--color-text)]">
                        {team ? team.name : `Team ${record.team_id}`}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Drawn at: {new Date(record.drawn_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <Badge variant={isGroupA ? "primary" : "accent"} size="md">
                    {isGroupA ? "GROUP A" : "GROUP B"}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Result Celebration Dialog */}
      {lastDrawResult && (
        <Dialog.Root open={showResultModal} onOpenChange={setShowResultModal}>
          <Dialog.Content size="md">
            <Dialog.Header>
              <Dialog.Title className="text-lg font-bold text-[var(--color-primary)]">
                🎲 Draw Allocation Result
              </Dialog.Title>
              <Dialog.CloseButton />
            </Dialog.Header>

            <Dialog.Body className="text-center py-6 space-y-5">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-primary)] text-white text-3xl font-extrabold shadow-[var(--shadow-lg)] border-4 border-[var(--color-accent)] animate-bounce mx-auto">
                {lastDrawResult.group_name.slice(-1)}
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
                  Drawn Team
                </p>
                <h3 className="text-2xl font-bold font-display text-[var(--color-primary)] mt-1">
                  {lastDrawResult.team_name}
                </h3>
              </div>

              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-muted)] border border-[var(--color-border)] space-y-1">
                <p className="text-xs text-[var(--color-text-muted)]">Assigned Group</p>
                <p className="text-xl font-extrabold text-[var(--color-accent-dark)]">
                  {lastDrawResult.group_name}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Draw Position: #{lastDrawResult.drawn_position}
                </p>
              </div>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="primary" fullWidth onClick={() => setShowResultModal(false)}>
                Continue Draw
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {/* Strong Reset Confirmation Dialog */}
      <Dialog.Root open={showResetDialog} onOpenChange={setShowResetDialog}>
        <Dialog.Content size="md">
          <Dialog.Header>
            <Dialog.Title className="text-lg font-bold text-[var(--color-error)]">
              ⚠️ Confirm Admin Draw Reset
            </Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>

          <Dialog.Body className="space-y-4 py-2">
            <p className="text-sm text-[var(--color-text)]">
              Are you sure you want to clear and reset all group allocations for{" "}
              <strong>{tournamentName}</strong>?
            </p>
            <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-error-bg)] border border-[var(--color-error)]/30 text-xs text-[var(--color-error)] space-y-1">
              <p className="font-bold">⚠️ High-Risk Admin Action:</p>
              <p>All drawn positions, group memberships, and records will be permanently deleted.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text)] mb-1">
                Type <span className="text-[var(--color-error)] uppercase font-mono">RESET</span> to confirm:
              </label>
              <input
                type="text"
                value={resetConfirmInput}
                onChange={(e) => setResetConfirmInput(e.target.value)}
                placeholder="Type RESET here"
                className="w-full h-10 px-3 border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm font-mono focus:ring-2 focus:ring-[var(--color-error)]"
              />
            </div>
          </Dialog.Body>

          <Dialog.Footer>
            <Button variant="outline" onClick={() => setShowResetDialog(false)} disabled={isResetting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={resetConfirmInput.trim().toUpperCase() !== "RESET" || isResetting}
              onClick={handleConfirmReset}
              loading={isResetting}
            >
              Yes, Reset All Draws
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
