import PageContainer from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { MatchStatusBadge } from "@/components/ui/StatusBadge";

export const metadata = {
  title: "Match Results",
};

const resultsList = [
  { id: 101, home: "Oddamavadi FC", homeScore: 3, awayScore: 1, away: "Battu Strikers", date: "Sun, Aug 10", status: "completed" },
  { id: 102, home: "Young Lions XI", homeScore: 2, awayScore: 2, away: "Mavadi United", date: "Sun, Aug 10", status: "completed" },
  { id: 103, home: "Coastal Warriors", homeScore: 1, awayScore: 0, away: "Eastern Heroes", date: "Sat, Aug 09", status: "completed" },
];

export default function PublicResultsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Official Match Results"
        subtitle="Confirmed scores and match outcomes"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Results" },
        ]}
      />

      <div className="space-y-4">
        {resultsList.map((m) => (
          <Card key={m.id} padding="md">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center justify-center gap-4 flex-1">
                <span className="font-display font-bold text-base text-right flex-1">{m.home}</span>
                <div className="px-3 py-1 bg-[var(--color-primary)] text-white font-display font-bold text-lg rounded-[var(--radius-sm)] shrink-0">
                  {m.homeScore} - {m.awayScore}
                </div>
                <span className="font-display font-bold text-base flex-1">{m.away}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <span>{m.date}</span>
                <MatchStatusBadge status={m.status as any} size="sm" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
