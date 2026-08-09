"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { toast } from "@/components/ui/Toast";
import { uploadTeamLogo } from "@/lib/supabase/storage";
import {
  fetchTournamentById,
  type TournamentWithSettings,
} from "@/lib/services/tournament.service";
import { createTeam } from "@/lib/services/team.service";
import {
  validateTeamForm,
  canModifyTeams,
  type TeamFormInput,
  type TeamValidationErrorMap,
} from "@/lib/validation/team";
import type { TeamStatus } from "@/types";

const INITIAL_FORM: TeamFormInput = {
  name: "",
  short_name: "",
  logo_url: "",
  registration_number: "",
  manager_name: "",
  captain_name: "",
  contact_phone: "",
  contact_email: "",
  status: "APPROVED",
  is_active: true,
};

const STATUS_OPTIONS = [
  { value: "APPROVED", label: "Approved (Active)" },
  { value: "PENDING", label: "Pending Approval" },
  { value: "INACTIVE", label: "Inactive" },
];

export default function NewTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [tournament, setTournament] = useState<TournamentWithSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<TeamFormInput>(INITIAL_FORM);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [errors, setErrors] = useState<TeamValidationErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchTournamentById(id)
      .then((t) => setTournament(t))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !tournament) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <SkeletonGrid count={3} />
      </div>
    );
  }

  const modifiable = canModifyTeams(tournament.status);

  const updateField = <K extends keyof TeamFormInput>(
    field: K,
    value: TeamFormInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setIsDirty(true);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const valRes = validateTeamForm(form, tournament.status);
    if (!valRes.isValid) {
      setErrors(valRes.errors);
      toast.error("Validation Error", "Please resolve the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalLogoUrl = form.logo_url || null;

      // Upload logo to Supabase Storage if file selected
      if (logoFile) {
        setIsUploading(true);
        finalLogoUrl = await uploadTeamLogo(logoFile);
        setIsUploading(false);
      }

      const created = await createTeam(
        id,
        {
          ...form,
          logo_url: finalLogoUrl || undefined,
        },
        tournament.status
      );

      toast.success("Team Registered", `Successfully registered "${created.name}".`);
      setIsDirty(false);
      router.push(`/admin/tournaments/${id}/teams`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register team.";
      toast.error("Registration Error", msg);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelModal(true);
    } else {
      router.push(`/admin/tournaments/${id}/teams`);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <PageHeader
        title={`Register Team: ${tournament.name}`}
        subtitle="Register football club details, crest logo, and management contacts"
        actions={
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
        }
      />

      {!modifiable && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-900 rounded-[var(--radius-md)] text-xs font-semibold">
          Team registration is locked for this tournament because the draw or competition matches have begun.
        </div>
      )}

      {/* CRITICAL RULE INFORMATIONAL BANNER */}
      <div className="p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-[var(--radius-md)] flex items-start gap-3">
        <svg className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--color-primary)]">
            Official Competition Draw Rule
          </h4>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
            Manual Group A or Group B selection is strictly disabled during team registration. Group allocations occur solely through the official Live Draw process.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-base text-[var(--color-primary)]">
              Club & Registration Profile
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Team Name"
                placeholder="e.g. Oddamavadi Youth FC"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                error={errors.name}
                required
                disabled={!modifiable}
                wrapperClassName="sm:col-span-2"
              />
              <Input
                label="Short Code (2-6 Chars)"
                placeholder="e.g. OYFC"
                value={form.short_name}
                onChange={(e) => updateField("short_name", e.target.value.toUpperCase())}
                error={errors.short_name}
                required
                disabled={!modifiable}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Registration Number"
                placeholder="e.g. REG-2025-001 (Optional)"
                value={form.registration_number || ""}
                onChange={(e) => updateField("registration_number", e.target.value)}
                error={errors.registration_number}
                disabled={!modifiable}
              />
              <Select
                label="Approval Status"
                value={form.status}
                onValueChange={(val) => updateField("status", val as TeamStatus)}
                options={STATUS_OPTIONS}
                disabled={!modifiable}
              />
            </div>

            {/* Supabase Storage Logo Upload */}
            <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
              <label className="text-xs font-display tracking-widest uppercase font-semibold text-[var(--color-text)]">
                Team Crest / Logo (Supabase Storage)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--color-bg-muted)] border border-[var(--color-border)] flex items-center justify-center font-display font-bold text-sm text-[var(--color-primary)] overflow-hidden shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    form.short_name || "LOGO"
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    disabled={!modifiable || isUploading}
                    className="text-xs text-[var(--color-text-muted)] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-display file:bg-[var(--color-primary)] file:text-white hover:file:bg-[var(--color-primary-dark)]"
                  />
                  <p className="text-[11px] text-[var(--color-text-subtle)]">
                    Upload PNG, JPG or WEBP crest up to 5MB. Stored securely in Supabase Storage.
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Management Contacts */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-base text-[var(--color-primary)]">
              Management & Contact Personnel
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Team Manager Name"
                placeholder="e.g. Mohamed Farook"
                value={form.manager_name || ""}
                onChange={(e) => updateField("manager_name", e.target.value)}
                disabled={!modifiable}
              />
              <Input
                label="Team Captain Name"
                placeholder="e.g. Ahmed Rizwan"
                value={form.captain_name || ""}
                onChange={(e) => updateField("captain_name", e.target.value)}
                disabled={!modifiable}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Contact Phone"
                placeholder="e.g. +94 77 123 4567"
                value={form.contact_phone || ""}
                onChange={(e) => updateField("contact_phone", e.target.value)}
                disabled={!modifiable}
              />
              <Input
                label="Contact Email"
                type="email"
                placeholder="e.g. manager@club.lk"
                value={form.contact_email || ""}
                onChange={(e) => updateField("contact_email", e.target.value)}
                error={errors.contact_email}
                disabled={!modifiable}
              />
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting || isUploading} disabled={!modifiable}>
            Register Team
          </Button>
        </div>
      </form>

      {/* Unsaved Changes Confirmation Modal */}
      <AlertDialog.Root open={showCancelModal} onOpenChange={setShowCancelModal}>
        <AlertDialog.Content>
          <AlertDialog.Header destructive>
            <AlertDialog.Title className="font-display text-lg font-bold">
              Discard Unsaved Changes?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-[var(--color-text-muted)] mt-1">
              You have entered team registration data that will be lost.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.CancelButton />
            <AlertDialog.ConfirmButton
              destructive
              onClick={() => router.push(`/admin/tournaments/${id}/teams`)}
            >
              Discard Changes
            </AlertDialog.ConfirmButton>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
}
