import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { TournamentStatusBadge } from "@/components/ui/StatusBadge";

export const metadata = {
  title: "Tournaments Management",
};

export default function AdminTournamentsPage() {
  return (
    <div>
      <PageHeader
        title="Tournament Management"
        subtitle="Create, configure, and manage all league competitions"
        actions={<Button size="sm">+ Create Tournament</Button>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card hoverable padding="none">
          <CardHeader>
            <div>
              <h3 className="font-display font-bold text-base text-[var(--color-primary)]">
                Young Lions Super League
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">Season 2025</p>
            </div>
            <TournamentStatusBadge status="group_stage" />
          </CardHeader>
          <CardBody>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
              16 Teams · 4 Groups · Oddamavadi Main Ground
            </p>
            <Button variant="outline" size="sm" fullWidth>
              Manage Tournament
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
