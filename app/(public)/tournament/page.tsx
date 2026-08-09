import PageContainer from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { TournamentStatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Tournament Overview",
};

export default function PublicTournamentPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Official Tournament Overview"
        subtitle="Young Lions Super League 2025 · Season Info & Format Rules"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Tournament" },
        ]}
      />

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h2 className="font-display text-xl font-bold text-[var(--color-primary)]">
                League Structure & Regulations
              </h2>
              <TournamentStatusBadge status="TOURNAMENT_IN_PROGRESS" />
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">
              The Young Lions Football League operates on a combined Group Stage and Knockout format. 16 teams compete across 4 groups, with top teams advancing to the quarterfinals.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-[var(--color-bg-muted)] rounded-[var(--radius-sm)]">
                <span className="text-xs font-display uppercase tracking-widest text-[var(--color-text-subtle)] block">
                  Total Teams
                </span>
                <span className="font-display text-lg font-bold text-[var(--color-primary)]">
                  16 Registered
                </span>
              </div>
              <div className="p-3 bg-[var(--color-bg-muted)] rounded-[var(--radius-sm)]">
                <span className="text-xs font-display uppercase tracking-widest text-[var(--color-text-subtle)] block">
                  Venue
                </span>
                <span className="font-display text-lg font-bold text-[var(--color-primary)]">
                  Oddamavadi Grounds
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-3">
            <h3 className="font-display text-base font-bold text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">
              Tournament Details
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Season</span>
                <Badge variant="primary" size="sm">2025</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Format</span>
                <span className="font-semibold text-[var(--color-text)]">Group + Knockout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Match Duration</span>
                <span className="font-semibold text-[var(--color-text)]">90 Minutes</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}
