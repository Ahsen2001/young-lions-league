import PageContainer from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Participating Teams",
};

const mockTeams = [
  { name: "Oddamavadi FC", group: "A", manager: "A. Rahman", status: "Active" },
  { name: "Young Lions XI", group: "A", manager: "K. Faris", status: "Active" },
  { name: "Coastal Warriors", group: "B", manager: "M. Naleer", status: "Active" },
  { name: "Green Eagles", group: "B", manager: "S. Hilmy", status: "Active" },
  { name: "Red Storm", group: "C", manager: "T. Rizwan", status: "Active" },
  { name: "Super Kings", group: "C", manager: "A. Aslam", status: "Active" },
];

export default function PublicTeamsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Participating Teams"
        subtitle="Explore all registered clubs in the 2025 Young Lions League"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Teams" },
        ]}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTeams.map((team) => (
          <Card key={team.name} hoverable padding="md">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[var(--color-primary)] text-white font-display font-bold text-base flex items-center justify-center shrink-0 border-2 border-[var(--color-accent)]">
                {team.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-base text-[var(--color-text)] truncate">
                  {team.name}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] truncate">
                  Manager: {team.manager}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="neutral" size="sm">Group {team.group}</Badge>
                  <Badge variant="success" size="sm">{team.status}</Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
