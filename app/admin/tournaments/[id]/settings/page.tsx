"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { TournamentStatusBadge } from "@/components/ui/StatusBadge";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { toast } from "@/components/ui/Toast";
import {
  validateTournamentForm,
  isFormatLocked,
  FORMAT_DESCRIPTIONS,
  type TournamentFormInput,
  type ValidationErrorMap,
} from "@/lib/validation/tournament";
import {
  fetchTournamentById,
  updateTournament,
  type TournamentWithSettings,
} from "@/lib/services/tournament.service";
import type { TournamentStatus, TournamentFormat } from "@/types";

const ALL_STATUSES: { value: TournamentStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "REGISTRATION_OPEN", label: "Registration Open" },
  { value: "READY_FOR_DRAW", label: "Ready for Draw" },
  { value: "DRAW_IN_PROGRESS", label: "Draw in Progress" },
  { value: "DRAW_COMPLETED", label: "Draw Completed" },
  { value: "DRAW_LOCKED", label: "Draw Locked" },
  { value: "FIXTURES_GENERATED", label: "Fixtures Generated" },
  { value: "TOURNAMENT_IN_PROGRESS", label: "In Progress" },
  { value: "GROUP_STAGE_COMPLETED", label: "Group Stage Completed" },
  { value: "KNOCKOUT_IN_PROGRESS", label: "Knockout Stage" },
  { value: "FINAL_READY", label: "Final Ready" },
  { value: "COMPLETED", label: "Completed" },
];

export default function TournamentSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [tournament, setTournament] = useState<TournamentWithSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<TournamentFormInput | null>(null);
  const [status, setStatus] = useState<TournamentStatus>("DRAFT");
  const [errors, setErrors] = useState<ValidationErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchTournamentById(id)
      .then((t) => {
        if (t) {
          setTournament(t);
          setStatus(t.status);
          setForm({
            name: t.name,
            season: t.season,
            description: t.description || "",
            logo_url: "",
            start_date: t.start_date || "",
            end_date: t.end_date || "",
            format: t.format,
            num_groups: t.settings?.num_groups || 4,
            teams_per_group: t.settings?.teams_per_group || 4,
            max_teams: t.settings?.max_teams || 16,
            teams_advancing_per_group: t.settings?.teams_advancing_per_group || 2,
            points_for_win: t.settings?.points_for_win ?? 3,
            points_for_draw: t.settings?.points_for_draw ?? 1,
            points_for_loss: t.settings?.points_for_loss ?? 0,
            allow_draws_in_group: t.settings?.allow_draws_in_group ?? true,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !form || !tournament) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <SkeletonGrid count={3} />
      </div>
    );
  }

  const formatLocked = isFormatLocked(status);

  const updateField = <K extends keyof TournamentFormInput>(
    field: K,
    value: TournamentFormInput[K]
  ) => {
    setForm((prev) => {
      if (!prev) return null;
      const next = { ...prev, [field]: value };
      if (field === "num_groups" || field === "teams_per_group") {
        const groups = field === "num_groups" ? (value as number) : prev.num_groups;
        const perGroup = field === "teams_per_group" ? (value as number) : prev.teams_per_group;
        next.max_teams = groups * perGroup;
      }
      return next;
    });
    setIsDirty(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !tournament) return;

    const result = validateTournamentForm(form, status, tournament.format);
    if (!result.isValid) {
      setErrors(result.errors);
      toast.error("Validation Failed", "Please resolve highlighted field errors.");
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await updateTournament(tournament.id, {
        ...form,
        status,
      });
      toast.success("Settings Saved", `Updated configurations for "${updated.name}".`);
      setIsDirty(false);
      router.push(`/admin/tournaments/${updated.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update tournament.";
      toast.error("Update Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelModal(true);
    } else {
      router.push(`/admin/tournaments/${tournament.id}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title={`Edit Settings: ${tournament.name}`}
        subtitle="Manage status lifecycle, format parameters, and points rules"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        }
      />

      <div className="-mt-4">
        <TournamentStatusBadge status={status} />
      </div>

      {/* Format Lock Warning Banner */}
      {formatLocked && (
        <div className="p-4 rounded-[var(--radius-md)] bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider">
              Tournament Format Locked
            </h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Official competition matches have commenced for this tournament. The progression format and group structures cannot be altered to preserve competition integrity.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tournament Lifecycle Status */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-base text-[var(--color-primary)]">
              Tournament Status Lifecycle
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Select
              label="Tournament Status"
              value={status}
              onValueChange={(val) => {
                setStatus(val as TournamentStatus);
                setIsDirty(true);
              }}
              options={ALL_STATUSES}
              hint="Transitioning status unlocks or locks competition workflows."
            />
          </CardBody>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-base text-[var(--color-primary)]">
              Basic Details
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Tournament Name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                error={errors.name}
                required
                wrapperClassName="sm:col-span-2"
              />
              <Input
                label="Season"
                value={form.season}
                onChange={(e) => updateField("season", e.target.value)}
                error={errors.season}
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={form.start_date}
                onChange={(e) => updateField("start_date", e.target.value)}
                error={errors.start_date}
              />
              <Input
                label="End Date"
                type="date"
                value={form.end_date}
                onChange={(e) => updateField("end_date", e.target.value)}
                error={errors.end_date}
              />
            </div>

            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
            />
          </CardBody>
        </Card>

        {/* Format & Structure */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-base text-[var(--color-primary)]">
              Format & Group Parameters
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-display tracking-widest uppercase font-semibold text-[var(--color-text)]">
                Tournament Format Paradigm {formatLocked && "(Locked)"}
              </label>

              <div className="grid sm:grid-cols-3 gap-3">
                {(
                  [
                    "GROUP_SEMI_FINAL",
                    "GROUP_QUARTER_SEMI_FINAL",
                    "GROUP_FINAL",
                  ] as TournamentFormat[]
                ).map((fmt) => {
                  const info = FORMAT_DESCRIPTIONS[fmt];
                  const isSelected = form.format === fmt;
                  return (
                    <button
                      type="button"
                      key={fmt}
                      disabled={formatLocked}
                      onClick={() => !formatLocked && updateField("format", fmt)}
                      className={`p-4 rounded-[var(--radius-md)] border text-left transition-all ${
                        formatLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      } ${
                        isSelected
                          ? "border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                          : "border-[var(--color-border)] bg-[var(--color-bg-card)]"
                      }`}
                    >
                      <h4 className="font-semibold text-xs text-[var(--color-text)] mb-1">
                        {info.subtitle}
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                        {info.progression}
                      </p>
                    </button>
                  );
                })}
              </div>
              {errors.format && (
                <p className="text-xs text-[var(--color-error)]">{errors.format}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <Input
                label="Number of Groups"
                type="number"
                disabled={formatLocked}
                value={form.num_groups.toString()}
                onChange={(e) => updateField("num_groups", parseInt(e.target.value) || 1)}
                error={errors.num_groups}
              />
              <Input
                label="Teams per Group"
                type="number"
                disabled={formatLocked}
                value={form.teams_per_group.toString()}
                onChange={(e) => updateField("teams_per_group", parseInt(e.target.value) || 2)}
                error={errors.teams_per_group}
              />
              <Input
                label="Max Teams Capacity"
                type="number"
                value={form.max_teams.toString()}
                onChange={(e) => updateField("max_teams", parseInt(e.target.value) || 2)}
                error={errors.max_teams}
              />
            </div>
          </CardBody>
        </Card>

        {/* Points System */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-base text-[var(--color-primary)]">
              Points System
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Points for Win"
                type="number"
                value={form.points_for_win.toString()}
                onChange={(e) => updateField("points_for_win", parseInt(e.target.value) || 0)}
                error={errors.points_for_win}
              />
              <Input
                label="Points for Draw"
                type="number"
                value={form.points_for_draw.toString()}
                onChange={(e) => updateField("points_for_draw", parseInt(e.target.value) || 0)}
                error={errors.points_for_draw}
              />
              <Input
                label="Points for Loss"
                type="number"
                value={form.points_for_loss.toString()}
                onChange={(e) => updateField("points_for_loss", parseInt(e.target.value) || 0)}
                error={errors.points_for_loss}
              />
            </div>

            <Checkbox
              id="allow_draws_edit"
              label="Allow Draws in Group Matches"
              checked={form.allow_draws_in_group}
              onCheckedChange={(c) => updateField("allow_draws_in_group", Boolean(c))}
            />
          </CardBody>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Save Settings
          </Button>
        </div>
      </form>

      {/* Unsaved Changes Confirmation Alert */}
      <AlertDialog.Root open={showCancelModal} onOpenChange={setShowCancelModal}>
        <AlertDialog.Content>
          <AlertDialog.Header destructive>
            <AlertDialog.Title className="font-display text-lg font-bold text-[var(--color-text)]">
              Discard Changes?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-[var(--color-text-muted)] mt-1">
              You have unsaved changes to tournament configurations.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.CancelButton />
            <AlertDialog.ConfirmButton
              destructive
              onClick={() => router.push(`/admin/tournaments/${tournament.id}`)}
            >
              Discard Changes
            </AlertDialog.ConfirmButton>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
}
