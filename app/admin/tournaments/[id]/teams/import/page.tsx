"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { toast } from "@/components/ui/Toast";
import { downloadSampleCSVTemplate } from "@/lib/utils/csv-template";
import {
  parseCSV,
  validateCSVImportRows,
  type ImportValidationResult,
  type ParsedCSVRowResult,
} from "@/lib/utils/csv-importer";
import {
  fetchTournamentById,
  type TournamentWithSettings,
} from "@/lib/services/tournament.service";
import { fetchTeams, bulkCreateTeams } from "@/lib/services/team.service";
import { canModifyTeams } from "@/lib/validation/team";
import type { Team } from "@/types";

type ImportStep = "UPLOAD" | "PREVIEW" | "IMPORTING" | "SUMMARY";

export default function BulkImportTeamsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [tournament, setTournament] = useState<TournamentWithSettings | null>(null);
  const [existingTeams, setExistingTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Stepper state
  const [step, setStep] = useState<ImportStep>("UPLOAD");
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);

  // Filter state in Preview step
  const [filterTab, setFilterTab] = useState<"ALL" | "VALID" | "ERRORS">("ALL");

  // Progress state
  const [importProgress, setImportProgress] = useState(0);
  const [importedResult, setImportedResult] = useState<{ imported: number; skipped: number } | null>(null);

  useEffect(() => {
    Promise.all([
      fetchTournamentById(id),
      fetchTeams(id, { page: 1, pageSize: 500 }),
    ])
      .then(([tData, teamData]) => {
        setTournament(tData);
        setExistingTeams(teamData.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !tournament) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <SkeletonGrid count={3} />
      </div>
    );
  }

  const modifiable = canModifyTeams(tournament.status);

  // Step 1: File Selection & Parsing
  const handleFileUpload = (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".csv") && !selectedFile.name.endsWith(".txt")) {
      toast.error("Invalid File", "Please select a valid CSV file (.csv).");
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsedRows = parseCSV(text);

      if (parsedRows.length === 0) {
        toast.error("Empty CSV File", "The uploaded CSV file contains no team rows.");
        return;
      }

      const validated = validateCSVImportRows(parsedRows, existingTeams);
      setValidationResult(validated);
      setStep("PREVIEW");
      toast.success("CSV Parsed", `Parsed ${validated.totalCount} rows (${validated.validCount} valid).`);
    };

    reader.readAsText(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  };

  // Step 2 & 3: Execution of Bulk Import
  const handleConfirmImport = async (importOnlyValid: boolean) => {
    if (!validationResult || !modifiable) return;

    const rowsToImport = importOnlyValid
      ? validationResult.rows.filter((r) => r.isValid && r.dto)
      : validationResult.rows.filter((r) => r.dto);

    if (rowsToImport.length === 0) {
      toast.error("No Valid Rows", "There are no valid team rows available to import.");
      return;
    }

    setStep("IMPORTING");
    setImportProgress(10);

    const dtos = rowsToImport.map((r) => r.dto!);

    try {
      setImportProgress(50);
      const res = await bulkCreateTeams(id, dtos, tournament.status);
      setImportProgress(100);

      const skippedCount = validationResult.totalCount - res.importedCount;
      setImportedResult({ imported: res.importedCount, skipped: skippedCount });

      toast.success("Bulk Import Complete", `Successfully imported ${res.importedCount} teams.`);
      setStep("SUMMARY");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to execute bulk import.";
      toast.error("Import Error", msg);
      setStep("PREVIEW");
    }
  };

  const handleCancel = () => {
    setFile(null);
    setValidationResult(null);
    setStep("UPLOAD");
  };

  const filteredPreviewRows = validationResult
    ? validationResult.rows.filter((r) => {
        if (filterTab === "VALID") return r.isValid;
        if (filterTab === "ERRORS") return !r.isValid;
        return true;
      })
    : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title={`Bulk Import Teams: ${tournament.name}`}
        subtitle="Upload CSV spreadsheet to register multiple football clubs at once"
        actions={
          <Link href={`/admin/tournaments/${id}/teams`}>
            <Button size="sm" variant="outline">
              Back to Teams
            </Button>
          </Link>
        }
      />

      {!modifiable && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-900 rounded-[var(--radius-md)] text-xs font-semibold">
          Team import is disabled because the tournament draw is locked or competition matches have begun.
        </div>
      )}

      {/* STEPPER HEADER */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 text-xs font-display font-semibold uppercase tracking-wider">
        <div className={`flex items-center gap-2 ${step === "UPLOAD" ? "text-[var(--color-primary)] font-bold" : "text-[var(--color-text-muted)]"}`}>
          <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px]">1</span>
          Upload CSV
        </div>
        <span className="text-[var(--color-border)]">→</span>
        <div className={`flex items-center gap-2 ${step === "PREVIEW" ? "text-[var(--color-primary)] font-bold" : "text-[var(--color-text-muted)]"}`}>
          <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px]">2</span>
          Validate & Preview
        </div>
        <span className="text-[var(--color-border)]">→</span>
        <div className={`flex items-center gap-2 ${step === "IMPORTING" ? "text-[var(--color-primary)] font-bold" : "text-[var(--color-text-muted)]"}`}>
          <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px]">3</span>
          Processing
        </div>
        <span className="text-[var(--color-border)]">→</span>
        <div className={`flex items-center gap-2 ${step === "SUMMARY" ? "text-[var(--color-primary)] font-bold" : "text-[var(--color-text-muted)]"}`}>
          <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px]">4</span>
          Summary
        </div>
      </div>

      {/* STEP 1: UPLOAD */}
      {step === "UPLOAD" && (
        <div className="space-y-6">
          <Card padding="lg">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-[var(--color-primary)]/30 hover:border-[var(--color-primary)] bg-[var(--color-primary)]/5 rounded-[var(--radius-lg)] p-8 text-center space-y-4 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] mx-auto flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-[var(--color-primary)]">
                  Drag & Drop CSV file here
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Supports comma-separated `.csv` files up to 5MB
                </p>
              </div>

              <div>
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f);
                    }}
                    disabled={!modifiable}
                    className="hidden"
                  />
                  <Button size="sm" type="button" disabled={!modifiable}>
                    Select CSV File
                  </Button>
                </label>
              </div>
            </div>
          </Card>

          {/* Download Sample CSV Card */}
          <Card padding="md" className="bg-[var(--color-bg-card)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-display font-bold text-sm text-[var(--color-primary)]">
                  Need a CSV template format?
                </h4>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Download our pre-formatted template featuring required fields (`team_name`, `short_name`, `registration_number`).
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={downloadSampleCSVTemplate}>
                Download Sample Template (.csv)
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* STEP 2: PREVIEW & VALIDATE */}
      {step === "PREVIEW" && validationResult && (
        <div className="space-y-6">
          {/* Validation Metrics Header Banner */}
          <div className="grid sm:grid-cols-4 gap-3">
            <Card padding="sm" className="text-center">
              <span className="text-[11px] text-[var(--color-text-subtle)] font-display uppercase">Total Parsed Rows</span>
              <p className="font-display font-extrabold text-xl text-[var(--color-text)]">{validationResult.totalCount}</p>
            </Card>
            <Card padding="sm" className="text-center border-green-500/30 bg-green-500/5">
              <span className="text-[11px] text-green-700 font-display uppercase font-semibold">Valid Rows</span>
              <p className="font-display font-extrabold text-xl text-green-700">{validationResult.validCount}</p>
            </Card>
            <Card padding="sm" className="text-center border-red-500/30 bg-red-500/5">
              <span className="text-[11px] text-red-700 font-display uppercase font-semibold">Invalid / Error Rows</span>
              <p className="font-display font-extrabold text-xl text-red-700">{validationResult.invalidCount}</p>
            </Card>
            <Card padding="sm" className="text-center border-amber-500/30 bg-amber-500/5">
              <span className="text-[11px] text-amber-700 font-display uppercase font-semibold">Duplicate Warnings</span>
              <p className="font-display font-extrabold text-xl text-amber-700">{validationResult.warningCount}</p>
            </Card>
          </div>

          {/* Filter Tabs & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterTab("ALL")}
                className={`px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wider ${
                  filterTab === "ALL" ? "bg-[var(--color-primary)] text-white font-bold" : "bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
              >
                All Rows ({validationResult.totalCount})
              </button>
              <button
                onClick={() => setFilterTab("VALID")}
                className={`px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wider ${
                  filterTab === "VALID" ? "bg-green-700 text-white font-bold" : "bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
              >
                Valid Only ({validationResult.validCount})
              </button>
              <button
                onClick={() => setFilterTab("ERRORS")}
                className={`px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wider ${
                  filterTab === "ERRORS" ? "bg-red-700 text-white font-bold" : "bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
              >
                Errors Only ({validationResult.invalidCount})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              {validationResult.invalidCount > 0 && validationResult.validCount > 0 && (
                <Button size="sm" variant="secondary" onClick={() => handleConfirmImport(true)}>
                  Import {validationResult.validCount} Valid Rows Only
                </Button>
              )}
              <Button
                size="sm"
                disabled={validationResult.validCount === 0 || !modifiable}
                onClick={() => handleConfirmImport(false)}
              >
                Confirm & Import ({validationResult.validCount})
              </Button>
            </div>
          </div>

          {/* Interactive Preview Table */}
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Row #</TableHead>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Short Code</TableHead>
                  <TableHead>Reg Number</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Validation Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPreviewRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-xs text-[var(--color-text-muted)]">
                      No rows match the selected filter tab.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPreviewRows.map((row) => (
                    <TableRow key={row.rowIndex} className={!row.isValid ? "bg-red-500/5" : undefined}>
                      <TableCell className="font-mono text-xs font-bold text-[var(--color-text-muted)]">
                        #{row.rowIndex}
                      </TableCell>
                      <TableCell className="font-semibold text-xs text-[var(--color-primary)] font-display">
                        {row.raw.team_name || "—"}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {row.raw.short_name || "—"}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-[var(--color-text-muted)]">
                        {row.raw.registration_number || "Auto"}
                      </TableCell>
                      <TableCell className="text-xs text-[var(--color-text-muted)]">
                        {row.raw.manager_name || "—"}
                      </TableCell>
                      <TableCell>
                        {row.isValid ? (
                          <Badge variant="success" size="sm" dot>Valid</Badge>
                        ) : (
                          <div className="space-y-1">
                            <Badge variant="error" size="sm" dot>
                              Error
                            </Badge>
                            {row.errors.map((err, idx) => (
                              <p key={idx} className="text-[11px] text-red-600 font-semibold leading-tight">
                                • {err}
                              </p>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* STEP 3: IMPORTING PROGRESS */}
      {step === "IMPORTING" && (
        <Card padding="lg">
          <div className="py-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] mx-auto flex items-center justify-center animate-spin">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[var(--color-primary)]">
                Importing Team Records...
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Transactionally registering team profiles and contact details.
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-[var(--color-bg-muted)] overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-all duration-300"
                style={{ width: `${importProgress}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: SUMMARY */}
      {step === "SUMMARY" && importedResult && (
        <Card padding="lg">
          <div className="py-8 text-center space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-600 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl text-[var(--color-primary)]">
                Bulk Import Successful!
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                The registered clubs have been added to the tournament directory.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-[var(--color-border)]">
              <div>
                <span className="text-[11px] text-[var(--color-text-subtle)] font-display uppercase">Teams Imported</span>
                <p className="font-display font-extrabold text-2xl text-green-700">{importedResult.imported}</p>
              </div>
              <div>
                <span className="text-[11px] text-[var(--color-text-subtle)] font-display uppercase">Rows Skipped</span>
                <p className="font-display font-extrabold text-2xl text-[var(--color-text-muted)]">{importedResult.skipped}</p>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Import Another File
              </Button>
              <Link href={`/admin/tournaments/${id}/teams`}>
                <Button size="sm">View Tournament Teams Directory</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
