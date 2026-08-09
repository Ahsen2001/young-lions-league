"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { TournamentStatusBadge } from "@/components/ui/StatusBadge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { SkeletonTournamentCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import {
  fetchTournaments,
  deleteTournament,
  type TournamentWithSettings,
  type PaginatedTournamentsResult,
} from "@/lib/services/tournament.service";

const STATUS_FILTERS = [
  { value: "ALL", label: "All Tournaments" },
  { value: "DRAFT", label: "Draft" },
  { value: "REGISTRATION_OPEN", label: "Registration" },
  { value: "READY_FOR_DRAW", label: "Ready for Draw" },
  { value: "TOURNAMENT_IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

function AdminTournamentsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // URL Query Parameters State
  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";
  const sort = (searchParams.get("sort") as "newest" | "oldest") || "newest";

  const [result, setResult] = useState<PaginatedTournamentsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<TournamentWithSettings | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Synchronize URL search params seamlessly
  const updateQueryParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || (key === "page" && value === 1) || (key === "status" && value === "ALL") || (key === "sort" && value === "newest")) {
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
      const data = await fetchTournaments({
        page,
        pageSize: 10,
        search,
        status,
        sort,
      });
      setResult(data);
    } catch {
      toast.error("Error", "Failed to load database tournaments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search, status, sort]);

  const handleSearchChange = (val: string) => {
    updateQueryParams({ search: val, page: 1 });
  };

  const handleStatusChange = (newStatus: string) => {
    updateQueryParams({ status: newStatus, page: 1 });
  };

  const handleSortChange = (newSort: string) => {
    updateQueryParams({ sort: newSort, page: 1 });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteTournament(deleteTarget.id);
      toast.success("Tournament Removed", `${deleteTarget.name} has been deleted.`);
      setDeleteTarget(null);
      await loadData();
    } catch {
      toast.error("Delete Error", "Could not delete tournament.");
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered = search !== "" || status !== "ALL" || sort !== "newest";

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

      {/* Search, Filter & Sort Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[var(--color-bg-card)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <Input
            placeholder="Search tournament name..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            wrapperClassName="flex-1 max-w-xs"
            leadingIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />

          <Select
            value={sort}
            onValueChange={handleSortChange}
            options={SORT_OPTIONS}
            wrapperClassName="w-36"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleStatusChange(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-display tracking-widest uppercase transition-colors shrink-0 ${
                status === f.value
                  ? "bg-[var(--color-primary)] text-white font-bold shadow-sm"
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
              onClick={handleClearFilters}
              className="text-xs text-[var(--color-text-subtle)] shrink-0"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Header: Showing X–Y of Z */}
      {result && !loading && (
        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] px-1">
          <span>
            Showing <strong className="text-[var(--color-text)] font-semibold">{result.from}–{result.to}</strong> of <strong className="text-[var(--color-text)] font-semibold">{result.total}</strong> tournaments
          </span>
          {isPending && (
            <span className="text-[var(--color-primary)] font-medium flex items-center gap-1 animate-pulse">
              Updating parameters…
            </span>
          )}
        </div>
      )}

      {/* Tournament Cards Grid */}
      {loading || isPending ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonTournamentCard />
          <SkeletonTournamentCard />
          <SkeletonTournamentCard />
          <SkeletonTournamentCard />
          <SkeletonTournamentCard />
          <SkeletonTournamentCard />
        </div>
      ) : !result || result.data.length === 0 ? (
        <EmptyState
          title={isFiltered ? "No matching tournaments" : "No tournaments created"}
          description={
            isFiltered
              ? "No tournament matches your search query or selected status filter."
              : "Initialize your first competition format to get started."
          }
          action={
            isFiltered ? (
              <Button size="sm" variant="outline" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            ) : (
              <Link href="/admin/tournaments/new">
                <Button size="sm">+ Create First Tournament</Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.data.map((t) => (
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
                    <span className="text-[var(--color-text-subtle)]">Capacity</span>
                    <span className="font-semibold text-[var(--color-text)]">
                      {t.settings?.num_groups || 4} Groups · {t.settings?.max_teams || 16} Teams Max
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

      {/* Database-backed Pagination Controls */}
      {result && result.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-text-muted)]">
            Page <strong className="text-[var(--color-text)] font-bold">{result.page}</strong> of <strong className="text-[var(--color-text)] font-bold">{result.totalPages}</strong>
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              disabled={result.page <= 1}
              onClick={() => updateQueryParams({ page: result.page - 1 })}
            >
              Previous
            </Button>

            {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => updateQueryParams({ page: p })}
                className={`w-8 h-8 rounded-[var(--radius-sm)] text-xs font-display font-semibold transition-colors ${
                  p === result.page
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]"
                }`}
              >
                {p}
              </button>
            ))}

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
            <AlertDialog.Title className="font-display text-lg font-bold text-[var(--color-text)]">
              Delete {deleteTarget?.name}?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-[var(--color-text-muted)] mt-1">
              This operation cannot be undone.
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

export default function AdminTournamentsPage() {
  return (
    <Suspense fallback={<div className="space-y-6"><SkeletonTournamentCard /></div>}>
      <AdminTournamentsContent />
    </Suspense>
  );
}
