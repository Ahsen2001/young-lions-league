"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { TournamentStatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { SkeletonTournamentCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import {
  fetchTournaments,
  deleteTournament,
  type TournamentWithSettings,
} from "@/lib/services/tournament.service";
import { FORMAT_DESCRIPTIONS } from "@/lib/validation/tournament";

const STATUS_FILTERS = [
  { value: "ALL", label: "All Tournaments" },
  { value: "DRAFT", label: "Draft" },
  { value: "REGISTRATION_OPEN", label: "Registration" },
  { value: "TOURNAMENT_IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<TournamentWithSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<TournamentWithSettings | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTournaments({ search, status: statusFilter });
      setTournaments(data);
    } catch {
      toast.error("Error", "Failed to load tournaments list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteTournament(deleteTarget.id);
      toast.success("Tournament Deleted", `${deleteTarget.name} has been removed.`);
      setDeleteTarget(null);
      await loadData();
    } catch {
      toast.error("Delete Failed", "Could not delete tournament.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tournament Management"
        subtitle="Create, configure, and manage all league competitions"
        actions={
          <Link href="/admin/tournaments/new">
            <Button size="sm">+ Create Tournament</Button>
          </Link>
        }
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <Input
          placeholder="Search tournaments by name or season…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          wrapperClassName="max-w-md"
          leadingIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1 rounded-full text-xs font-display tracking-widest uppercase transition-colors shrink-0 ${
                statusFilter === f.value
                  ? "bg-[var(--color-primary)] text-white font-bold"
                  : "bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tournament Cards Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonTournamentCard />
          <SkeletonTournamentCard />
          <SkeletonTournamentCard />
        </div>
      ) : tournaments.length === 0 ? (
        <EmptyState
          title="No tournaments found"
          description="No tournament matches your search query or status filter."
          action={
            <Link href="/admin/tournaments/new">
              <Button size="sm">+ Create First Tournament</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map((t) => (
            <Card key={t.id} padding="none" hoverable className="flex flex-col justify-between">
              <CardHeader className="bg-[var(--color-bg-muted)] border-b border-[var(--color-border)]">
                <div>
                  <h3 className="font-display font-bold text-base text-[var(--color-primary)] line-clamp-1">
                    {t.name}
                  </h3>
                  <span className="text-xs text-[var(--color-text-muted)] font-display uppercase tracking-widest">
                    Season {t.season}
                  </span>
                </div>
                <TournamentStatusBadge status={t.status} size="sm" />
              </CardHeader>

              <CardBody className="space-y-3">
                <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
                  {t.description || "No description provided."}
                </p>

                <div className="p-3 bg-[var(--color-bg)] rounded-[var(--radius-sm)] border border-[var(--color-border)] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-subtle)]">Format</span>
                    <span className="font-semibold text-[var(--color-primary)]">
                      {t.format === "GROUP_SEMI_FINAL"
                        ? "Group → Semis → Final"
                        : t.format === "GROUP_QUARTER_SEMI_FINAL"
                        ? "Group → Quarters → Semis"
                        : "Group → Final"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-subtle)]">Structure</span>
                    <span className="font-semibold text-[var(--color-text)]">
                      {t.settings?.num_groups || 4} Groups · {t.settings?.max_teams || 16} Teams Max
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-subtle)]">Points Rules</span>
                    <span className="font-semibold text-[var(--color-text)]">
                      Win {t.settings?.points_for_win ?? 3} / Draw {t.settings?.points_for_draw ?? 1} / Loss {t.settings?.points_for_loss ?? 0}
                    </span>
                  </div>
                </div>
              </CardBody>

              <CardFooter className="bg-[var(--color-bg-card)] border-t border-[var(--color-border)] flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <Link href={`/admin/tournaments/${t.id}`}>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </Link>
                  <Link href={`/admin/tournaments/${t.id}/settings`}>
                    <Button size="sm" variant="ghost">
                      Settings
                    </Button>
                  </Link>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteTarget(t)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && tournaments.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(tournaments.length / 6) || 1}
          onPageChange={setPage}
          totalItems={tournaments.length}
          pageSize={6}
        />
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog.Root open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialog.Content>
          <AlertDialog.Header destructive>
            <AlertDialog.Title className="font-display text-lg font-bold text-[var(--color-text)]">
              Delete {deleteTarget?.name}?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-[var(--color-text-muted)] mt-1">
              This action will remove the tournament and its configured settings. This operation is isolated and cannot be undone.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.CancelButton disabled={isDeleting} />
            <AlertDialog.ConfirmButton
              destructive
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting…" : "Delete Tournament"}
            </AlertDialog.ConfirmButton>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
}
