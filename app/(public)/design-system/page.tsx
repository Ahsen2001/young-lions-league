"use client";

import { notFound } from "next/navigation";
import { useState } from "react";

// UI components
import {
  Button,
  IconButton,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  TournamentStatusBadge,
  MatchStatusBadge,
  PageHeader,
  SectionHeader,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Dialog,
  AlertDialog,
  DropdownMenu,
  Tabs,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Pagination,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonCard,
  SkeletonRow,
  Spinner,
  toast,
} from "@/components/ui";
import type { TournamentStatus } from "@/types";

/* ── Dev guard ───────────────────────────────────────────────────────── */
if (process.env.NODE_ENV === "production") {
  notFound();
}

/* ── Section wrapper ─────────────────────────────────────────────────── */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-5 pb-3 border-b-2 border-[var(--color-border)]">
        <span className="font-display text-xs tracking-widest uppercase text-[var(--color-secondary)] font-semibold">
          Design System
        </span>
        <h2 className="font-display text-2xl font-bold text-[var(--color-primary)]">
          {title}
        </h2>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Demo({
  label,
  children,
  bg = "card",
}: {
  label?: string;
  children: React.ReactNode;
  bg?: "card" | "muted" | "dark";
}) {
  const bgCls =
    bg === "card"
      ? "bg-[var(--color-bg-card)]"
      : bg === "muted"
      ? "bg-[var(--color-bg-muted)]"
      : "bg-[var(--color-primary)]";
  return (
    <div>
      {label && (
        <p className="mb-2 text-xs font-display tracking-widest uppercase text-[var(--color-text-subtle)]">
          {label}
        </p>
      )}
      <div
        className={`${bgCls} border border-[var(--color-border)] rounded-[var(--radius-md)] p-5`}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Sample data ─────────────────────────────────────────────────────── */
const teamData = [
  { id: 1, name: "Oddamavadi FC", group: "A", w: 3, d: 1, l: 0, pts: 10 },
  { id: 2, name: "Young Lions XI", group: "A", w: 2, d: 1, l: 1, pts: 7 },
  { id: 3, name: "Coastal Warriors", group: "B", w: 2, d: 0, l: 2, pts: 6 },
  { id: 4, name: "Green Eagles", group: "B", w: 1, d: 2, l: 1, pts: 5 },
  { id: 5, name: "Red Storm", group: "C", w: 1, d: 0, l: 3, pts: 3 },
];

const tournamentStatuses: TournamentStatus[] = [
  "DRAFT",
  "REGISTRATION_OPEN",
  "READY_FOR_DRAW",
  "DRAW_IN_PROGRESS",
  "DRAW_COMPLETED",
  "DRAW_LOCKED",
  "FIXTURES_GENERATED",
  "TOURNAMENT_IN_PROGRESS",
  "GROUP_STAGE_COMPLETED",
  "KNOCKOUT_IN_PROGRESS",
  "FINAL_READY",
  "COMPLETED",
];

/* ── Page ────────────────────────────────────────────────────────────── */
export default function DesignSystemPage() {
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  // Form state
  const [checkA, setCheckA] = useState(false);
  const [checkB, setCheckB] = useState(true);
  const [radioVal, setRadioVal] = useState("group");
  const [selectVal, setSelectVal] = useState("");
  const [inputVal, setInputVal] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);

  // Tabs state
  const [sortCol, setSortCol] = useState<string | null>(null);

  const navItems = [
    "colors",
    "typography",
    "buttons",
    "cards",
    "badges",
    "forms",
    "overlays",
    "tabs",
    "table",
    "pagination",
    "feedback",
    "loading",
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* ── Header ── */}
      <header className="bg-[var(--color-primary)] text-white sticky top-0 z-40 border-b-4 border-[var(--color-accent)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-xs tracking-widest uppercase text-[var(--color-accent)] font-semibold">
              Development Only
            </p>
            <h1 className="font-display text-xl font-bold tracking-wide">
              Young Lions — Design System
            </h1>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 text-xs font-display tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            Sprint 0 · Task 2
          </span>
        </div>

        {/* Nav pills */}
        <div className="max-w-6xl mx-auto px-6 pb-3 flex gap-2 overflow-x-auto scrollbar-none">
          {navItems.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 font-display text-[10px] tracking-widest uppercase text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-full px-3 py-1 transition-colors"
            >
              {id}
            </a>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-20">
        {/* ══════════════════════════════════════════════════════════════
            COLORS
        ══════════════════════════════════════════════════════════════ */}
        <Section id="colors" title="Color Tokens">
          <Demo label="Brand Palette">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Primary", hex: "#234F2D", var: "--color-primary", textLight: true },
                { name: "Secondary", hex: "#A0AF2A", var: "--color-secondary", textLight: true },
                { name: "Background", hex: "#F8F7F1", var: "--color-bg", textLight: false },
                { name: "Accent", hex: "#E1B32C", var: "--color-accent", textLight: false },
              ].map(({ name, hex, var: v, textLight }) => (
                <div key={name} className="flex flex-col">
                  <div
                    className="h-20 rounded-[var(--radius-md)] mb-2 border border-[var(--color-border)]"
                    style={{ backgroundColor: `var(${v})` }}
                  />
                  <p className="font-display text-xs tracking-wide font-semibold text-[var(--color-text)]">
                    {name}
                  </p>
                  <p className="font-mono text-[10px] text-[var(--color-text-subtle)]">{hex}</p>
                </div>
              ))}
            </div>
          </Demo>

          <Demo label="Status Colors">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Success", bg: "var(--color-success)", text: "#fff" },
                { name: "Warning", bg: "var(--color-warning)", text: "#fff" },
                { name: "Error", bg: "var(--color-error)", text: "#fff" },
                { name: "Info", bg: "var(--color-info)", text: "#fff" },
              ].map(({ name, bg, text }) => (
                <div
                  key={name}
                  className="h-14 rounded-[var(--radius-md)] flex items-center justify-center"
                  style={{ background: `var(${bg.slice(4, -1)})`, color: text }}
                >
                  <span className="font-display text-xs tracking-widest uppercase font-semibold">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </Demo>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            TYPOGRAPHY
        ══════════════════════════════════════════════════════════════ */}
        <Section id="typography" title="Typography">
          <Demo label="Oswald — Display font">
            <div className="space-y-3">
              {[
                { size: "text-4xl", label: "4xl / 700", text: "YOUNG LIONS LEAGUE", weight: "font-bold" },
                { size: "text-3xl", label: "3xl / 600", text: "Group Stage Results", weight: "font-semibold" },
                { size: "text-2xl", label: "2xl / 500", text: "Fixture Schedule — Week 4", weight: "font-medium" },
                { size: "text-xl", label: "xl / 400", text: "Standings Table", weight: "font-normal" },
                { size: "text-sm", label: "sm / Uppercase label", text: "MATCH STATUS", weight: "font-semibold tracking-widest uppercase" },
              ].map(({ size, label, text, weight }) => (
                <div key={label} className="flex items-baseline gap-4 flex-wrap">
                  <span className="font-display text-[10px] tracking-widest uppercase text-[var(--color-text-subtle)] w-32 shrink-0">
                    {label}
                  </span>
                  <span className={`font-display ${size} ${weight} text-[var(--color-text)]`}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </Demo>

          <Demo label="Inter — Body font">
            <div className="space-y-3">
              {[
                { size: "text-base", label: "Base / 400", text: "The Young Lions Sports Club is dedicated to fostering athletic excellence and community spirit in Oddamavadi." },
                { size: "text-sm", label: "sm / 400", text: "Match results are updated in real-time. Contact the admin for disputes." },
                { size: "text-xs", label: "xs / Muted", text: "Last updated 5 minutes ago · Season 2025", className: "text-[var(--color-text-muted)]" },
              ].map(({ size, label, text, className: cls }) => (
                <div key={label} className="flex items-start gap-4 flex-wrap">
                  <span className="font-display text-[10px] tracking-widest uppercase text-[var(--color-text-subtle)] w-32 shrink-0 mt-0.5">
                    {label}
                  </span>
                  <p className={`font-body ${size} ${cls ?? "text-[var(--color-text)]"} max-w-lg`}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </Demo>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            BUTTONS
        ══════════════════════════════════════════════════════════════ */}
        <Section id="buttons" title="Buttons">
          <Demo label="Variants">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </Demo>

          <Demo label="Sizes">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </Demo>

          <Demo label="States">
            <div className="flex flex-wrap items-center gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button variant="accent" loading>
                Saving…
              </Button>
            </div>
          </Demo>

          <Demo label="Full width">
            <Button fullWidth>Full Width Primary</Button>
          </Demo>

          <Demo label="IconButton">
            <div className="flex flex-wrap items-center gap-3">
              {(["primary", "secondary", "outline", "ghost", "accent", "destructive"] as const).map((v) => (
                <IconButton key={v} variant={v} aria-label={`${v} icon action`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </IconButton>
              ))}
              <IconButton size="sm" aria-label="small icon">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </IconButton>
              <IconButton size="lg" aria-label="large icon">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </IconButton>
            </div>
          </Demo>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            CARDS
        ══════════════════════════════════════════════════════════════ */}
        <Section id="cards" title="Cards">
          <Demo label="Padding presets">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card padding="sm">
                <p className="text-xs text-[var(--color-text-muted)]">Padding sm</p>
              </Card>
              <Card padding="md">
                <p className="text-xs text-[var(--color-text-muted)]">Padding md (default)</p>
              </Card>
              <Card padding="lg">
                <p className="text-xs text-[var(--color-text-muted)]">Padding lg</p>
              </Card>
            </div>
          </Demo>

          <Demo label="Compound Card (Header · Body · Footer)">
            <Card padding="none" className="max-w-md">
              <CardHeader>
                <div>
                  <p className="font-display text-sm font-semibold tracking-wide text-[var(--color-text)]">
                    Group A Results
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">Week 3 · 4 matches played</p>
                </div>
                <TournamentStatusBadge status="TOURNAMENT_IN_PROGRESS" />
              </CardHeader>
              <CardBody>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Oddamavadi FC leads Group A with 10 points after 4 matches.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm" variant="outline">
                  View All
                </Button>
                <Button size="sm">Details</Button>
              </CardFooter>
            </Card>
          </Demo>

          <Demo label="Hoverable cards">
            <div className="grid sm:grid-cols-3 gap-4">
              {["Oddamavadi FC", "Young Lions XI", "Green Eagles"].map((name) => (
                <Card key={name} hoverable padding="md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                      <span className="font-display text-sm font-bold text-[var(--color-primary)]">
                        {name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-display text-sm font-semibold tracking-wide text-[var(--color-text)]">
                        {name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">Hover me</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Demo>

          {/* PageHeader in a Card demo */}
          <Demo label="PageHeader component">
            <PageHeader
              title="Tournament Dashboard"
              subtitle="Manage fixtures, teams, and standings for the current season."
              breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Admin", href: "/admin" },
                { label: "Tournament" },
              ]}
              actions={
                <>
                  <Button variant="outline" size="sm">Export</Button>
                  <Button size="sm">+ New Fixture</Button>
                </>
              }
            />
          </Demo>

          <Demo label="SectionHeader component">
            <SectionHeader
              title="Group Stage Standings"
              subtitle="Updated after each match result is confirmed"
              action={<Button variant="ghost" size="sm">See all groups →</Button>}
            />
            <p className="text-sm text-[var(--color-text-muted)] mt-2">Section content goes here…</p>
          </Demo>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            BADGES
        ══════════════════════════════════════════════════════════════ */}
        <Section id="badges" title="Badges">
          <Demo label="Badge variants">
            <div className="flex flex-wrap gap-2">
              {(["primary", "secondary", "accent", "success", "warning", "error", "info", "neutral"] as const).map(
                (v) => (
                  <Badge key={v} variant={v}>
                    {v}
                  </Badge>
                )
              )}
            </div>
          </Demo>

          <Demo label="With dot indicator">
            <div className="flex flex-wrap gap-2">
              {(["primary", "success", "warning", "error"] as const).map((v) => (
                <Badge key={v} variant={v} dot>
                  {v} with dot
                </Badge>
              ))}
            </div>
          </Demo>

          <Demo label="Sizes">
            <div className="flex flex-wrap items-center gap-2">
              <Badge size="sm">Small badge</Badge>
              <Badge size="md">Medium badge</Badge>
            </div>
          </Demo>

          <Demo label="TournamentStatusBadge">
            <div className="flex flex-wrap gap-2">
              {tournamentStatuses.map((s) => (
                <TournamentStatusBadge key={s} status={s} />
              ))}
            </div>
          </Demo>

          <Demo label="MatchStatusBadge">
            <div className="flex flex-wrap gap-2">
              {(["scheduled", "in_progress", "completed", "cancelled", "postponed"] as const).map(
                (s) => (
                  <MatchStatusBadge key={s} status={s} />
                )
              )}
            </div>
          </Demo>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            FORMS
        ══════════════════════════════════════════════════════════════ */}
        <Section id="forms" title="Form Components">
          <div className="grid sm:grid-cols-2 gap-6">
            <Demo label="Input — default">
              <Input
                label="Team name"
                placeholder="e.g. Oddamavadi FC"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                hint="Enter the full registered team name."
              />
            </Demo>

            <Demo label="Input — with icon">
              <Input
                label="Search teams"
                placeholder="Search…"
                leadingIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                }
              />
            </Demo>

            <Demo label="Input — error state">
              <Input
                label="Email address"
                placeholder="admin@example.com"
                type="email"
                defaultValue="invalid-email"
                error="Please enter a valid email address."
                required
              />
            </Demo>

            <Demo label="Input — disabled">
              <Input
                label="Tournament ID"
                value="TRN-2025-001"
                disabled
                hint="Auto-generated, read-only."
              />
            </Demo>

            <Demo label="Textarea">
              <Textarea
                label="Match notes"
                placeholder="Enter any notes about this match…"
                hint="Optional. Max 500 characters."
              />
            </Demo>

            <Demo label="Textarea — error">
              <Textarea
                label="Referee report"
                error="This field is required before confirming the result."
                required
              />
            </Demo>

            <Demo label="Select">
              <Select
                label="Tournament format"
                placeholder="Choose format…"
                value={selectVal}
                onValueChange={setSelectVal}
                options={[
                  { value: "round_robin", label: "Round Robin" },
                  { value: "knockout", label: "Knockout" },
                  { value: "group_knockout", label: "Group + Knockout" },
                  { value: "league", label: "League Table" },
                ]}
                hint="Determines how fixtures are generated."
              />
            </Demo>

            <Demo label="Select — grouped">
              <Select
                label="Venue"
                groups={[
                  {
                    label: "Main Grounds",
                    options: [
                      { value: "ground_a", label: "Ground A — Main Pitch" },
                      { value: "ground_b", label: "Ground B — Training Pitch" },
                    ],
                  },
                  {
                    label: "Away Venues",
                    options: [
                      { value: "sports_complex", label: "District Sports Complex" },
                      { value: "school_ground", label: "School Ground" },
                    ],
                  },
                ]}
              />
            </Demo>
          </div>

          <Demo label="Checkbox">
            <div className="space-y-3">
              <Checkbox
                label="Confirm all teams are registered"
                description="At least 8 teams are required to proceed with the draw."
                checked={checkA}
                onCheckedChange={(v) => setCheckA(v as boolean)}
              />
              <Checkbox
                label="Enable live score updates"
                checked={checkB}
                onCheckedChange={(v) => setCheckB(v as boolean)}
              />
              <Checkbox
                label="Indeterminate state"
                checked="indeterminate"
              />
              <Checkbox
                label="Disabled unchecked"
                disabled
              />
              <Checkbox
                label="Checkbox with error"
                error="You must accept the terms to continue."
              />
            </div>
          </Demo>

          <Demo label="RadioGroup — vertical">
            <RadioGroup
              label="Tournament format"
              value={radioVal}
              onValueChange={setRadioVal}
              options={[
                {
                  value: "group",
                  label: "Group Stage + Knockout",
                  description: "Teams play in groups, top teams advance to knockout rounds.",
                },
                {
                  value: "league",
                  label: "Full League",
                  description: "All teams play each other. Winner determined by points.",
                },
                {
                  value: "knockout",
                  label: "Knockout Only",
                  description: "Single-elimination from the first round.",
                  disabled: true,
                },
              ]}
            />
          </Demo>

          <Demo label="RadioGroup — horizontal">
            <RadioGroup
              label="Match duration"
              orientation="horizontal"
              options={[
                { value: "45", label: "45 min" },
                { value: "60", label: "60 min" },
                { value: "90", label: "90 min" },
              ]}
            />
          </Demo>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            OVERLAYS
        ══════════════════════════════════════════════════════════════ */}
        <Section id="overlays" title="Overlays">
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Dialog */}
            <Demo label="Dialog">
              <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Trigger asChild>
                  <Button variant="outline" fullWidth>
                    Open Dialog
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Header>
                    <div>
                      <Dialog.Title className="font-display text-lg font-semibold tracking-wide text-[var(--color-text)]">
                        Edit Team Details
                      </Dialog.Title>
                      <Dialog.Description className="text-sm text-[var(--color-text-muted)] mt-1">
                        Update the team information below.
                      </Dialog.Description>
                    </div>
                    <Dialog.CloseButton />
                  </Dialog.Header>
                  <Dialog.Body>
                    <div className="space-y-4">
                      <Input label="Team name" placeholder="e.g. Oddamavadi FC" />
                      <Input label="Manager" placeholder="Manager name" />
                      <Select
                        label="Group"
                        options={["A", "B", "C", "D"].map((g) => ({ value: g, label: `Group ${g}` }))}
                      />
                    </div>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.Close asChild>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button
                      size="sm"
                      onClick={() => {
                        setDialogOpen(false);
                        toast.success("Team updated successfully.", "Changes saved to database.");
                      }}
                    >
                      Save changes
                    </Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Root>
            </Demo>

            {/* AlertDialog */}
            <Demo label="AlertDialog (destructive)">
              <AlertDialog.Root open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialog.Trigger asChild>
                  <Button variant="destructive" fullWidth>
                    Delete Team
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                  <AlertDialog.Header destructive>
                    <AlertDialog.Title className="font-display text-base font-semibold tracking-wide text-[var(--color-text)]">
                      Delete Oddamavadi FC?
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-sm text-[var(--color-text-muted)] mt-1">
                      This will permanently remove the team and all associated fixtures. This action cannot be
                      undone.
                    </AlertDialog.Description>
                  </AlertDialog.Header>
                  <AlertDialog.Footer>
                    <AlertDialog.CancelButton />
                    <AlertDialog.ConfirmButton
                      destructive
                      onClick={() =>
                        toast.error("Team deleted.", "Oddamavadi FC has been removed.")
                      }
                    >
                      Delete team
                    </AlertDialog.ConfirmButton>
                  </AlertDialog.Footer>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </Demo>

            {/* DropdownMenu */}
            <Demo label="DropdownMenu">
              <div className="flex justify-center">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button variant="outline">
                      Actions ▾
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Label>Match Actions</DropdownMenu.Label>
                    <DropdownMenu.Item
                      icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                      onSelect={() => toast.info("Edit fixture opened.")}
                    >
                      Edit fixture
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                      onSelect={() => toast.info("Reschedule opened.")}
                    >
                      Reschedule
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
                      onSelect={() => toast.success("Report exported.")}
                    >
                      Export result
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item
                      destructive
                      icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                    >
                      Cancel fixture
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
            </Demo>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            TABS
        ══════════════════════════════════════════════════════════════ */}
        <Section id="tabs" title="Tabs">
          <Demo label="Underline style (default)">
            <Tabs.Root defaultValue="standings">
              <Tabs.List>
                <Tabs.Trigger value="standings">Standings</Tabs.Trigger>
                <Tabs.Trigger value="fixtures">Fixtures</Tabs.Trigger>
                <Tabs.Trigger value="teams">Teams</Tabs.Trigger>
                <Tabs.Trigger value="stats" disabled>
                  Stats
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="standings">
                <p className="text-sm text-[var(--color-text-muted)]">Group standings table content.</p>
              </Tabs.Content>
              <Tabs.Content value="fixtures">
                <p className="text-sm text-[var(--color-text-muted)]">Upcoming and past fixtures list.</p>
              </Tabs.Content>
              <Tabs.Content value="teams">
                <p className="text-sm text-[var(--color-text-muted)]">All registered teams list.</p>
              </Tabs.Content>
            </Tabs.Root>
          </Demo>

          <Demo label="Pill style">
            <Tabs.Root defaultValue="group_a">
              <Tabs.List variant="pill">
                <Tabs.Trigger value="group_a" variant="pill">Group A</Tabs.Trigger>
                <Tabs.Trigger value="group_b" variant="pill">Group B</Tabs.Trigger>
                <Tabs.Trigger value="group_c" variant="pill">Group C</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="group_a">
                <p className="text-sm text-[var(--color-text-muted)]">Group A teams and results.</p>
              </Tabs.Content>
              <Tabs.Content value="group_b">
                <p className="text-sm text-[var(--color-text-muted)]">Group B teams and results.</p>
              </Tabs.Content>
              <Tabs.Content value="group_c">
                <p className="text-sm text-[var(--color-text-muted)]">Group C teams and results.</p>
              </Tabs.Content>
            </Tabs.Root>
          </Demo>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            TABLE
        ══════════════════════════════════════════════════════════════ */}
        <Section id="table" title="Table">
          <Demo label="Standings table (sortable headers)">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>#</TableHeader>
                  <TableHeader>Team</TableHeader>
                  <TableHeader align="center">Grp</TableHeader>
                  <TableHeader
                    align="center"
                    sort={sortCol === "w" ? "desc" : "none"}
                    onClick={() => setSortCol(sortCol === "w" ? null : "w")}
                  >
                    W
                  </TableHeader>
                  <TableHeader align="center">D</TableHeader>
                  <TableHeader align="center">L</TableHeader>
                  <TableHeader
                    align="center"
                    sort={sortCol === "pts" ? "desc" : "none"}
                    onClick={() => setSortCol(sortCol === "pts" ? null : "pts")}
                  >
                    Pts
                  </TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamData.map((team, i) => (
                  <TableRow key={team.id}>
                    <TableCell muted>{i + 1}</TableCell>
                    <TableCell>
                      <span className="font-display text-sm font-semibold tracking-wide text-[var(--color-primary)]">
                        {team.name}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <Badge variant="neutral" size="sm">
                        {team.group}
                      </Badge>
                    </TableCell>
                    <TableCell align="center">{team.w}</TableCell>
                    <TableCell align="center">{team.d}</TableCell>
                    <TableCell align="center">{team.l}</TableCell>
                    <TableCell align="center">
                      <span className="font-display font-bold text-[var(--color-primary)]">
                        {team.pts}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Demo>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            PAGINATION
        ══════════════════════════════════════════════════════════════ */}
        <Section id="pagination" title="Pagination">
          <Demo label="With items info">
            <Pagination
              currentPage={page}
              totalPages={12}
              onPageChange={setPage}
              totalItems={115}
              pageSize={10}
            />
          </Demo>
          <Demo label="Large page count (ellipsis)">
            <Pagination currentPage={6} totalPages={20} onPageChange={() => {}} />
          </Demo>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            FEEDBACK — EMPTY & ERROR
        ══════════════════════════════════════════════════════════════ */}
        <Section id="feedback" title="Feedback States">
          <div className="grid sm:grid-cols-2 gap-6">
            <Demo label="EmptyState">
              <EmptyState
                title="No fixtures scheduled"
                description="The draw hasn't been completed yet. Fixtures will appear here once groups are assigned."
                action={<Button size="sm">Trigger Draw</Button>}
              />
            </Demo>

            <Demo label="ErrorState">
              <ErrorState
                title="Could not load fixtures"
                description="There was a problem connecting to the database. Please try again."
                detail="Error: PGRST116 · connection timeout"
                action={
                  <Button
                    size="sm"
                    onClick={() => toast.error("Still failing.", "Check your Supabase connection.")}
                  >
                    Retry
                  </Button>
                }
              />
            </Demo>
          </div>

          {/* Toast section */}
          <Demo label="Toast notifications">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => toast.success("Result saved!", "Match result has been confirmed.")}
              >
                Success toast
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => toast.error("Save failed.", "Could not write to database.")}
              >
                Error toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.warning("Draw not verified.", "Please check group assignments.")}
              >
                Warning toast
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast.info("Registration open.", "Teams can now register for the tournament.")}
              >
                Info toast
              </Button>
            </div>
          </Demo>
        </Section>

        {/* ══════════════════════════════════════════════════════════════
            LOADING STATES
        ══════════════════════════════════════════════════════════════ */}
        <Section id="loading" title="Loading States">
          <Demo label="Spinner sizes">
            <div className="flex flex-wrap items-center gap-6">
              {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <Spinner size={size} className="text-[var(--color-primary)]" />
                  <span className="font-display text-[10px] tracking-widest uppercase text-[var(--color-text-subtle)]">
                    {size}
                  </span>
                </div>
              ))}
            </div>
          </Demo>

          <Demo label="Spinner color variants">
            <div className="flex flex-wrap items-center gap-5">
              <Spinner className="text-[var(--color-primary)]" />
              <Spinner className="text-[var(--color-secondary)]" />
              <Spinner className="text-[var(--color-accent)]" />
              <Spinner className="text-[var(--color-error)]" />
            </div>
          </Demo>

          <Demo label="Skeleton — inline">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </Demo>

          <Demo label="Skeleton — cards">
            <div className="grid sm:grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </Demo>

          <Demo label="Skeleton — table rows">
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] overflow-hidden">
              <div className="bg-[var(--color-primary)] h-10" />
              {[1, 2, 3, 4].map((i) => (
                <SkeletonRow key={i} columns={6} />
              ))}
            </div>
          </Demo>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] mt-20">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-[var(--color-text-subtle)]">
            Young Lions League — Design System · Sprint 0 Task 2 · Development only
          </p>
          <div className="flex gap-2">
            <Badge variant="primary" size="sm">22 components</Badge>
            <Badge variant="accent" size="sm">Next.js 16</Badge>
            <Badge variant="secondary" size="sm">Radix UI</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}
