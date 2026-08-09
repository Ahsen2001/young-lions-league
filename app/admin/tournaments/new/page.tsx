"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { toast } from "@/components/ui/Toast";
import {
  validateTournamentForm,
  FORMAT_DESCRIPTIONS,
  type TournamentFormInput,
  type ValidationErrorMap,
} from "@/lib/validation/tournament";
import { createTournament } from "@/lib/services/tournament.service";
import type { TournamentFormat } from "@/types";

const INITIAL_FORM: TournamentFormInput = {
  name: "",
  season: new Date().getFullYear().toString(),
  description: "",
  logo_url: "",
  start_date: "",
  end_date: "",
  num_groups: 4,
  teams_per_group: 4,
  max_teams: 16,
  teams_advancing_per_group: 2,
  format: "GROUP_QUARTER_SEMI_FINAL",
  points_for_win: 3,
  points_for_draw: 1,
  points_for_loss: 0,
  allow_draws_in_group: true,
};

export default function NewTournamentPage() {
  const router = useRouter();
  const [form, setForm] = useState<TournamentFormInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<ValidationErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const updateField = <K extends keyof TournamentFormInput>(
    field: K,
    value: TournamentFormInput[K]
  ) => {
    setForm((prev) => {
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
    const result = validateTournamentForm(form);

    if (!result.isValid) {
      setErrors(result.errors);
      toast.error(
        "Validation Failed",
        "Please fix the highlighted errors before saving."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createTournament(form);
      toast.success(
        "Tournament Created",
        `"${created.name}" has been initialized in DRAFT mode.`
      );
      setIsDirty(false);
      router.push(`/admin/tournaments/${created.id}`);
    } catch {
      toast.error("Error", "Failed to create tournament. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setShowCancelModal(true);
    } else {
      router.push("/admin/tournaments");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Create New Tournament"
        subtitle="Set up competition format, group limits, and standings rules"
        actions={
          <Button variant="outline" size="sm" onClick={handleCancelClick}>
            Cancel
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Basic Information */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-base text-[var(--color-primary)]">
              1. Basic Information
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Tournament Name"
                placeholder="e.g. Young Lions Super League 2025"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                error={errors.name}
                required
                wrapperClassName="sm:col-span-2"
              />
              <Input
                label="Season / Year"
                placeholder="e.g. 2025"
                value={form.season}
                onChange={(e) => updateField("season", e.target.value)}
                error={errors.season}
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Expected Start Date"
                type="date"
                value={form.start_date}
                onChange={(e) => updateField("start_date", e.target.value)}
                error={errors.start_date}
              />
              <Input
                label="Expected End Date"
                type="date"
                value={form.end_date}
                onChange={(e) => updateField("end_date", e.target.value)}
                error={errors.end_date}
              />
            </div>

            <Input
              label="Logo URL (Optional)"
              placeholder="https://..."
              value={form.logo_url}
              onChange={(e) => updateField("logo_url", e.target.value)}
            />

            <Textarea
              label="Tournament Description"
              placeholder="Add tournament notes, venue location overview, or qualification rules…"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
            />
          </CardBody>
        </Card>

        {/* SECTION 2: Tournament Format & Structure */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-base text-[var(--color-primary)]">
              2. Tournament Format & Knockout Progression
            </h3>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-display tracking-widest uppercase font-semibold text-[var(--color-text)]">
                Select Format Paradigm <span className="text-[var(--color-error)]">*</span>
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
                    <div
                      key={fmt}
                      onClick={() => updateField("format", fmt)}
                      className={`p-4 rounded-[var(--radius-md)] border cursor-pointer transition-all ${
                        isSelected
                          ? "border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-sm"
                          : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-primary)]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-bold text-xs text-[var(--color-primary)]">
                          {fmt === "GROUP_SEMI_FINAL"
                            ? "Format A"
                            : fmt === "GROUP_QUARTER_SEMI_FINAL"
                            ? "Format B"
                            : "Format C"}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                        )}
                      </div>
                      <h4 className="font-semibold text-xs text-[var(--color-text)] mb-1">
                        {info.subtitle}
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-muted)] line-clamp-3 leading-relaxed">
                        {info.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {errors.format && (
                <p className="text-xs text-[var(--color-error)]">{errors.format}</p>
              )}
            </div>

            {/* Selected Format Highlight Box */}
            <div className="p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-[var(--radius-md)] space-y-1">
              <span className="font-display text-xs font-bold uppercase text-[var(--color-primary)] block">
                Selected Progression Flow:
              </span>
              <p className="text-xs font-semibold text-[var(--color-text)]">
                {FORMAT_DESCRIPTIONS[form.format].progression}
              </p>
            </div>

            {/* Structure Counters */}
            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <Input
                label="Number of Groups"
                type="number"
                min={1}
                max={8}
                value={form.num_groups.toString()}
                onChange={(e) => updateField("num_groups", parseInt(e.target.value) || 1)}
                error={errors.num_groups}
                hint="MVP default: 2-4 groups (Group A, Group B)"
              />
              <Input
                label="Teams per Group"
                type="number"
                min={2}
                max={8}
                value={form.teams_per_group.toString()}
                onChange={(e) => updateField("teams_per_group", parseInt(e.target.value) || 2)}
                error={errors.teams_per_group}
              />
              <Input
                label="Total Expected Teams"
                type="number"
                min={2}
                value={form.max_teams.toString()}
                onChange={(e) => updateField("max_teams", parseInt(e.target.value) || 2)}
                error={errors.max_teams}
                hint={`Auto-calc: ${form.num_groups} × ${form.teams_per_group} = ${form.num_groups * form.teams_per_group}`}
              />
            </div>
          </CardBody>
        </Card>

        {/* SECTION 3: Points System & Rules */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-base text-[var(--color-primary)]">
              3. Points System & Group Standings Rules
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Points for Win"
                type="number"
                min={0}
                value={form.points_for_win.toString()}
                onChange={(e) => updateField("points_for_win", parseInt(e.target.value) || 0)}
                error={errors.points_for_win}
              />
              <Input
                label="Points for Draw"
                type="number"
                min={0}
                value={form.points_for_draw.toString()}
                onChange={(e) => updateField("points_for_draw", parseInt(e.target.value) || 0)}
                error={errors.points_for_draw}
              />
              <Input
                label="Points for Loss"
                type="number"
                min={0}
                value={form.points_for_loss.toString()}
                onChange={(e) => updateField("points_for_loss", parseInt(e.target.value) || 0)}
                error={errors.points_for_loss}
              />
            </div>

            <div className="pt-2">
              <Checkbox
                id="allow_draws"
                label="Allow Draws in Group Stage Matches"
                description="If unchecked, drawn group matches will proceed to penalty shootouts."
                checked={form.allow_draws_in_group}
                onCheckedChange={(checked) =>
                  updateField("allow_draws_in_group", Boolean(checked))
                }
              />
            </div>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelClick}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Create Tournament
          </Button>
        </div>
      </form>

      {/* Unsaved Changes Alert Modal */}
      <AlertDialog.Root open={showCancelModal} onOpenChange={setShowCancelModal}>
        <AlertDialog.Content>
          <AlertDialog.Header destructive>
            <AlertDialog.Title className="font-display text-lg font-bold text-[var(--color-text)]">
              Discard Unsaved Changes?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-[var(--color-text-muted)] mt-1">
              You have entered tournament configuration data that will be lost if you leave this page.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.CancelButton />
            <AlertDialog.ConfirmButton
              destructive
              onClick={() => router.push("/admin/tournaments")}
            >
              Discard Changes
            </AlertDialog.ConfirmButton>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
}
