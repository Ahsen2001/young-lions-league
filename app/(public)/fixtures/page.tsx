import PageContainer from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { MatchStatusBadge } from "@/components/ui/StatusBadge";

export const metadata = {
  title: "Match Fixtures",
};

const fixturesList = [
  { id: 1, home: "Oddamavadi FC", away: "Young Lions XI", time: "16:00", date: "Sat, Aug 16", venue: "Main Ground", status: "scheduled" },
  { id: 2, home: "Coastal Warriors", away: "Green Eagles", time: "17:30", date: "Sat, Aug 16", venue: "Ground B", status: "scheduled" },
  { id: 3, home: "Red Storm", away: "Super Kings", time: "16:00", date: "Sun, Aug 17", venue: "Main Ground", status: "scheduled" },
];

export default function PublicFixturesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Upcoming Match Fixtures"
        subtitle="Official Schedule for Season 2025"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Fixtures" },
        ]}
      />

      <div className="space-y-4">
        {fixturesList.map((m) => (
          <Card key={m.id} hoverable padding="md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <span className="font-display text-sm font-bold text-right flex-1">{m.home}</span>
                <span className="font-display text-xs bg-[var(--color-bg-muted)] px-2 py-1 rounded font-bold text-[var(--color-primary)]">VS</span>
                <span className="font-display text-sm font-bold flex-1">{m.away}</span>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-[var(--color-text-muted)]">
                <span>{m.date} · {m.time}</span>
                <span>({m.venue})</span>
                <MatchStatusBadge status={m.status as any} size="sm" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
