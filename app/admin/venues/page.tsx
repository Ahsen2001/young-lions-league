"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dialog } from "@/components/ui/Dialog";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import {
  fetchVenues,
  createVenue,
  updateVenue,
  deleteVenue,
  type PaginatedVenuesResult,
} from "@/lib/services/venue.service";
import {
  validateVenueForm,
  type VenueFormInput,
  type VenueValidationErrorMap,
} from "@/lib/validation/venue";
import type { Venue } from "@/types";

const STATUS_FILTERS = [
  { value: "ALL", label: "All Venues" },
  { value: "ACTIVE", label: "Active Grounds" },
  { value: "INACTIVE", label: "Inactive Grounds" },
];

const INITIAL_FORM: VenueFormInput = {
  name: "",
  short_name: "",
  location: "",
  capacity: 1000,
  availability_start: "08:00",
  availability_end: "18:00",
  is_active: true,
};

function AdminVenuesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // URL Params
  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";

  const [result, setResult] = useState<PaginatedVenuesResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal & Edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [form, setForm] = useState<VenueFormInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<VenueValidationErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Venue | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateQueryParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || (key === "page" && value === 1) || (key === "status" && value === "ALL")) {
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
      const data = await fetchVenues({
        page,
        pageSize: 10,
        search,
        status: status as "ALL" | "ACTIVE" | "INACTIVE",
      });
      setResult(data);
    } catch {
      toast.error("Error", "Failed to load venue list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search, status]);

  const handleOpenCreateModal = () => {
    setEditingVenue(null);
    setForm(INITIAL_FORM);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (venue: Venue) => {
    setEditingVenue(venue);
    setForm({
      name: venue.name,
      short_name: venue.short_name,
      location: venue.location || "",
      capacity: venue.capacity,
      availability_start: venue.availability_start || "08:00",
      availability_end: venue.availability_end || "18:00",
      is_active: venue.is_active,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const updateFormField = <K extends keyof VenueFormInput>(
    field: K,
    value: VenueFormInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission

    const valResult = validateVenueForm(form);
    if (!valResult.isValid) {
      setErrors(valResult.errors);
      toast.error("Validation Error", "Please resolve highlighted form fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingVenue) {
        await updateVenue(editingVenue.id, form);
        toast.success("Venue Updated", `Successfully updated "${form.name}".`);
      } else {
        await createVenue(form);
        toast.success("Venue Added", `Successfully registered pitch "${form.name}".`);
      }

      setIsModalOpen(false);
      await loadData();
    } catch {
      toast.error("Save Error", "Failed to save venue details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await deleteVenue(deleteTarget.id);
      if (res.success) {
        toast.success("Venue Removed", `"${deleteTarget.name}" has been deleted.`);
        setDeleteTarget(null);
        await loadData();
      } else {
        toast.error("Cannot Delete", res.error || "Failed to remove venue.");
      }
    } catch {
      toast.error("Delete Error", "An error occurred while deleting the venue.");
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered = search !== "" || status !== "ALL";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Venue Management"
        subtitle="Configure grounds, pitches, and daily operating hours"
        actions={
          <Button size="sm" onClick={handleOpenCreateModal}>
            + Add Venue
          </Button>
        }
      />

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[var(--color-bg-card)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)]">
        <Input
          placeholder="Search venue name or location..."
          value={search}
          onChange={(e) => updateQueryParams({ search: e.target.value, page: 1 })}
          wrapperClassName="max-w-md"
          leadingIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />

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

      {/* Counter */}
      {result && !loading && (
        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] px-1">
          <span>
            Showing <strong className="text-[var(--color-text)] font-semibold">{result.from}–{result.to}</strong> of <strong className="text-[var(--color-text)] font-semibold">{result.total}</strong> venues
          </span>
          {isPending && (
            <span className="text-[var(--color-primary)] animate-pulse">Updating...</span>
          )}
        </div>
      )}

      {/* Responsive Table / Cards Content */}
      {loading || isPending ? (
        <SkeletonTable rows={5} />
      ) : !result || result.data.length === 0 ? (
        <EmptyState
          title={isFiltered ? "No matching venues" : "No venues configured"}
          description={
            isFiltered
              ? "No venue ground matches your search query or status filter."
              : "Register your first match ground to start scheduling fixtures."
          }
          action={
            isFiltered ? (
              <Button size="sm" variant="outline" onClick={() => startTransition(() => router.push(pathname))}>
                Clear All Filters
              </Button>
            ) : (
              <Button size="sm" onClick={handleOpenCreateModal}>
                + Add First Venue
              </Button>
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
                  <TableHead>Venue Name</TableHead>
                  <TableHead>Short Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Operating Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.data.map((venue) => (
                  <TableRow key={venue.id}>
                    <TableCell className="font-semibold text-[var(--color-primary)] font-display">
                      {venue.name}
                    </TableCell>
                    <TableCell className="text-xs text-[var(--color-text)]">
                      {venue.short_name}
                    </TableCell>
                    <TableCell className="text-xs text-[var(--color-text-muted)]">
                      {venue.location || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-[var(--color-text)]">
                      {venue.capacity ? `${venue.capacity.toLocaleString()} seats` : "Unspecified"}
                    </TableCell>
                    <TableCell className="text-xs text-[var(--color-text-subtle)]">
                      {venue.availability_start && venue.availability_end
                        ? `${venue.availability_start} – ${venue.availability_end}`
                        : "Full Day"}
                    </TableCell>
                    <TableCell>
                      {venue.is_active ? (
                        <Badge variant="success" size="sm" dot>Active</Badge>
                      ) : (
                        <Badge variant="neutral" size="sm" dot>Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEditModal(venue)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteTarget(venue)}
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
            {result.data.map((venue) => (
              <Card key={venue.id} padding="none">
                <CardHeader>
                  <div>
                    <h3 className="font-display font-bold text-sm text-[var(--color-primary)]">
                      {venue.name}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)]">{venue.location || "No location set"}</p>
                  </div>
                  {venue.is_active ? (
                    <Badge variant="success" size="sm">Active</Badge>
                  ) : (
                    <Badge variant="neutral" size="sm">Inactive</Badge>
                  )}
                </CardHeader>
                <CardBody className="space-y-1 text-xs">
                  <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
                    <span className="text-[var(--color-text-subtle)]">Short Code:</span>
                    <span className="font-semibold">{venue.short_name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--color-border)]">
                    <span className="text-[var(--color-text-subtle)]">Capacity:</span>
                    <span>{venue.capacity ? `${venue.capacity} seats` : "—"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--color-text-subtle)]">Hours:</span>
                    <span>{venue.availability_start && venue.availability_end ? `${venue.availability_start} - ${venue.availability_end}` : "Full Day"}</span>
                  </div>
                </CardBody>
                <div className="flex items-center justify-end gap-2 p-3 bg-[var(--color-bg-muted)] border-t border-[var(--color-border)]">
                  <Button size="sm" variant="outline" onClick={() => handleOpenEditModal(venue)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(venue)}>
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

      {/* Create / Edit Modal Dialog */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Content className="max-w-lg">
          <Dialog.Header>
            <Dialog.Title>
              {editingVenue ? `Edit Venue: ${editingVenue.short_name}` : "Register New Venue"}
            </Dialog.Title>
            <Dialog.Description>
              Provide pitch location, spectator capacity, and operating availability hours.
            </Dialog.Description>
          </Dialog.Header>

          <form onSubmit={handleFormSubmit}>
            <Dialog.Body className="space-y-4">
              <Input
                label="Venue Name"
                placeholder="e.g. Oddamavadi Central Stadium Ground"
                value={form.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                error={errors.name}
                required
              />

              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  label="Short Name / Code"
                  placeholder="e.g. Central Pitch"
                  value={form.short_name}
                  onChange={(e) => updateFormField("short_name", e.target.value)}
                  error={errors.short_name}
                  required
                />
                <Input
                  label="Spectator Capacity"
                  type="number"
                  placeholder="e.g. 1500"
                  value={form.capacity !== null && form.capacity !== undefined ? form.capacity.toString() : ""}
                  onChange={(e) => updateFormField("capacity", e.target.value ? parseInt(e.target.value) : null)}
                  error={errors.capacity}
                />
              </div>

              <Input
                label="Physical Location / Address"
                placeholder="e.g. Main Street, Oddamavadi"
                value={form.location || ""}
                onChange={(e) => updateFormField("location", e.target.value)}
              />

              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  label="Availability Start Time"
                  type="time"
                  value={form.availability_start || "08:00"}
                  onChange={(e) => updateFormField("availability_start", e.target.value)}
                  error={errors.availability_start}
                />
                <Input
                  label="Availability End Time"
                  type="time"
                  value={form.availability_end || "18:00"}
                  onChange={(e) => updateFormField("availability_end", e.target.value)}
                  error={errors.availability_end}
                />
              </div>

              <div className="pt-2">
                <Checkbox
                  id="venue_active"
                  label="Venue Active for Match Scheduling"
                  checked={form.is_active}
                  onCheckedChange={(c) => updateFormField("is_active", Boolean(c))}
                />
              </div>
            </Dialog.Body>

            <Dialog.Footer>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {editingVenue ? "Save Venue" : "Create Venue"}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      {/* Delete Confirmation Alert */}
      <AlertDialog.Root open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialog.Content>
          <AlertDialog.Header destructive>
            <AlertDialog.Title className="font-display text-lg font-bold">
              Delete Venue {deleteTarget?.short_name}?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-[var(--color-text-muted)] mt-1">
              Are you sure you want to remove this pitch? This action cannot be undone.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.CancelButton disabled={isDeleting} />
            <AlertDialog.ConfirmButton
              destructive
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting…" : "Delete Venue"}
            </AlertDialog.ConfirmButton>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
}

export default function AdminVenuesPage() {
  return (
    <Suspense fallback={<SkeletonTable rows={5} />}>
      <AdminVenuesContent />
    </Suspense>
  );
}
