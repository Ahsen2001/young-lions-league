"use client";

import { use, useState, useEffect, useTransition, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import {
  fetchTournamentById,
  type TournamentWithSettings,
} from "@/lib/services/tournament.service";
import {
  fetchTeams,
  deleteTeam,
  type PaginatedTeamsResult,
} from "@/lib/services/team.service";
import { canModifyTeams } from "@/lib/validation/team";
import type { Team } from "@/types";

const STATUS_FILTERS = [
  { value: "ALL", label: "All Statuses" },
  { value: "APPROVED", label: "Approved" },
  { value: "PENDING", label: "Pending Approval" },
  { value: "INACTIVE", label: "Inactive" },
];

const GROUP_FILTERS = [
  { value: "ALL", label: "All Groups" },
  { value: "UNASSIGNED", label: "Unassigned (Pre-Draw)" },
  { value: "Group A", label: "Group A" },
  { value: "Group B", label: "Group B" },
  { value: "Group C", label: "Group C" },
  { value: "Group D", label: "Group D" },
];

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10 per page" },
  { value: "20", label: "20 per page" },
  { value: "50", label: "50 per page" },
];

function AdminTeamsContent({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [tournament, setTournament] = useState<TournamentWithSettings | null>(null);

  // URL Params
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";
  const group = searchParams.get("group") || "ALL";

  const [result, setResult] = useState<PaginatedTeamsResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Team | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateQueryParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === null ||
        value === "" ||
        (key === "page" && value === 1) ||
        (key === "pageSize" && value === 10) ||
        (key === "status" && value === "ALL") ||
        (key === "group" && value === "ALL")
      ) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.push(newUrl);
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [tData, teamData] = await Promise.all([
        fetchTournamentById(id),
        fetchTeams(id, { page, pageSize, search, status, group }),
      ]);
      setTournament(tData);
      setResult(teamData);
    } catch {
      toast.error("Error", "Failed to load tournament teams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, page, pageSize, search, status, group]);

  const handleDelete = async () => {
    if (!deleteTarget || isDeleting || !tournament) return;
    setIsDeleting(true);
    try {
      const res = await deleteTeam(deleteTarget.id, tournament.status);
      if (res.success) {
        toast.success("Team Removed", `"${deleteTarget.name}" has been deleted.`);
        setDeleteTarget(null);
        await loadData();
      } else {
        toast.error("Cannot Delete", res.error || "Failed to remove team.");
      }
    } catch {
      toast.error("Delete Error", "An error occurred during deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered = search !== "" || status !== "ALL" || group !== "ALL";
  const modifiable = tournament ? canModifyTeams(tournament.status) : true;

  return (
    <div className="space-y-6">
      <PageHeader
        title={tournament ? `${tournament.name} — Registered Teams` : "Tournament Teams"}
        subtitle="Manage club registrations, roster details, and group allocations"
        actions={
          <div className="flex gap-2">
            <Link href={`/admin/tournaments/${id}/teams/new`}>
              <Button size="sm" disabled={!modifiable}>
                + Register Team
              </Button>
            </Link>
            <Link href={`/admin/tournaments/${id}/teams/import`}>
              <Button size="sm" variant="secondary" disabled={!modifiable}>
                Import CSV
              </Button>
            </Link>
            <Link href={`/admin/tournaments/${id}`}>
              <Button size="sm" variant="outline">
                Back to Overview
              </Button>
            </Link>
          </div>
        }
      />

      {/* Lifecycle Warning Banner */}
      {!modifiable && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-900 rounded-[var(--radius-md)] text-xs flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>
            Team registration and deletions are locked because the tournament draw has been finalized or matches have begun.
          </span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[var(--color-bg-card)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <Input
            placeholder="Search team, manager, code..."
            value={search}
            onChange={(e) => updateQueryParams({ search: e.target.value, page: 1 })}
            wrapperClassName="flex-1 max-w-xs"
            leadingIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />

          <Select
            value={group}
            onValueChange={(val) => updateQueryParams({ group: val, page: 1 })}
            options={GROUP_FILTERS}
            wrapperClassName="w-44"
          />

          <Select
            value={pageSize.toString()}
            onValueChange={(val) => updateQueryParams({ pageSize: parseInt(val), page: 1 })}
            options={PAGE_SIZE_OPTIONS}
            wrapperClassName="w-36"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => updateQueryParams({ status: f.value, page: 1 })}
              className={`px-3 py-1.5 rounded-full text-xs font-display tracking-widest uppercase transition-colors shrink-0 ${
                status === f.value
                  ? "bg-[var(--color-primary)] text-white font-bold"
                  : "bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {f.label}
            </button>
          ))}

          {isFiltered && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => startTransition(() => router.push(pathname))}
              className="text-xs shrink-0"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Showing Counter */}
      {result && !loading && (
        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] px-1">
          <span>
            Showing <strong className="text-[var(--color-text)] font-semibold">{result.from}–{result.to}</strong> of <strong className="text-[var(--color-text)] font-semibold">{result.total}</strong> teams
          </span>
          {isPending && <span className="text-[var(--color-primary)] animate-pulse">Updating...</span>}
        </div>
      )}

      {/* Desktop Table & Mobile Cards */}
      {loading || isPending ? (
        <SkeletonTable rows={5} />
      ) : !result || result.data.length === 0 ? (
        <EmptyState
          title={isFiltered ? "No matching teams" : "No teams registered yet"}
          description={
            isFiltered
              ? "No team matches your search query or selected group filter."
              : "Register participating football clubs for this tournament."
          }
          action={
            isFiltered ? (
              <Button size="sm" variant="outline" onClick={() => startTransition(() => router.push(pathname))}>
                Clear All Filters
              </Button>
            ) : (
              <Link href={`/admin/tournaments/${id}/teams/new`}>
                <Button size="sm" disabled={!modifiable}>
                  + Register First Team
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Reg Number</TableHead>
                  <TableHead>Manager & Captain</TableHead>
                  <TableHead>Group Allocation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.data.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center font-display text-xs font-bold text-[var(--color-primary)] overflow-hidden shrink-0">
                          {team.logo_url ? (
                            <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                          ) : (
                            team.short_name.substring(0, 2)
                          )}
                        </div>
                        <div>
                          <Link href={`/admin/tournaments/${id}/teams/${team.id}`} className="font-semibold text-xs text-[var(--color-primary)] hover:underline block font-display">
                            {team.name}
                          </Link>
                          <span className="text-[11px] text-[var(--color-text-subtle)]">{team.contact_email || "No email"}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="px-2 py-0.5 rounded bg-[var(--color-bg-muted)] border border-[var(--color-border)] font-display text-xs font-bold text-[var(--color-primary)]">
                        {team.short_name}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs font-mono text-[var(--color-text-muted)]">
                      {team.registration_number || "—"}
                    </TableCell>

                    <TableCell className="text-xs text-[var(--color-text-muted)]">
                      <div><strong className="text-[var(--color-text)]">Mgr:</strong> {team.manager_name || "—"}</div>
                      <div><strong className="text-[var(--color-text)]">Capt:</strong> {team.captain_name || "—"}</div>
                    </TableCell>

                    <TableCell>
                      {team.group_name ? (
                        <Badge variant="primary" size="sm">{team.group_name}</Badge>
                      ) : (
                        <span className="text-xs text-[var(--color-text-subtle)] italic">Unassigned (Draw Pending)</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {team.status === "APPROVED" ? (
                        <Badge variant="success" size="sm" dot>Approved</Badge>
                      ) : team.status === "PENDING" ? (
                        <Badge variant="warning" size="sm" dot>Pending</Badge>
                      ) : (
                        <Badge variant="neutral" size="sm" dot>Inactive</Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/tournaments/${id}/teams/${team.id}`}>
                          <Button size="sm" variant="ghost">View</Button>
                        </Link>
                        <Link href={`/admin/tournaments/${id}/teams/${team.id}/edit`}>
                          <Button size="sm" variant="outline" disabled={!modifiable}>Edit</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={!modifiable}
                          onClick={() => setDeleteTarget(team)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards View */}
          <div className="grid md:hidden gap-3">
            {result.data.map((team) => (
              <Card key={team.id} padding="none">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 border flex items-center justify-center font-display font-bold text-xs text-[var(--color-primary)] overflow-hidden shrink-0">
                      {team.logo_url ? <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" /> : team.short_name.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-[var(--color-primary)]">{team.name}</h3>
                      <p className="text-xs text-[var(--color-text-muted)]">{team.registration_number}</p>
                    </div>
                  </div>
                  <Badge variant={team.status === "APPROVED" ? "success" : "warning"} size="sm">{team.status}</Badge>
                </CardHeader>
                <CardBody className="space-y-1 text-xs">
                  <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
                    <span className="text-[var(--color-text-subtle)]">Short Code:</span>
                    <span className="font-bold text-[var(--color-primary)]">{team.short_name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
                    <span className="text-[var(--color-text-subtle)]">Group Allocation:</span>
                    <span>{team.group_name || "Unassigned"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--color-text-subtle)]">Manager:</span>
                    <span>{team.manager_name || "—"}</span>
                  </div>
                </CardBody>
                <div className="flex items-center justify-end gap-2 p-3 bg-[var(--color-bg-muted)] border-t border-[var(--color-border)]">
                  <Link href={`/admin/tournaments/${id}/teams/${team.id}`}>
                    <Button size="sm" variant="ghost">View</Button>
                  </Link>
                  <Link href={`/admin/tournaments/${id}/teams/${team.id}/edit`}>
                    <Button size="sm" variant="outline" disabled={!modifiable}>Edit</Button>
                  </Link>
                  <Button size="sm" variant="destructive" disabled={!modifiable} onClick={() => setDeleteTarget(team)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Pagination Controls */}
      {result && result.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-text-muted)]">
            Page <strong className="text-[var(--color-text)]">{result.page}</strong> of <strong className="text-[var(--color-text)]">{result.totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={result.page <= 1}
              onClick={() => updateQueryParams({ page: result.page - 1 })}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={result.page >= result.totalPages}
              onClick={() => updateQueryParams({ page: result.page + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert */}
      <AlertDialog.Root open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialog.Content>
          <AlertDialog.Header destructive>
            <AlertDialog.Title className="font-display text-lg font-bold">
              Delete Team {deleteTarget?.name}?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-[var(--color-text-muted)] mt-1">
              Removing this club will unregister them from tournament standings and draws.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.CancelButton disabled={isDeleting} />
            <AlertDialog.ConfirmButton
              destructive
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting…" : "Delete Team"}
            </AlertDialog.ConfirmButton>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
}

export default function AdminTeamsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<SkeletonTable rows={5} />}>
      <AdminTeamsContent id={id} />
    </Suspense>
  );
}
