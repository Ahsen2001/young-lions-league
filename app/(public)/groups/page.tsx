import PageContainer from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Group Stage Allocations",
};

const groupsData = [
  { group: "A", teams: ["Oddamavadi FC", "Young Lions XI", "Battu Strikers", "Mavadi United"] },
  { group: "B", teams: ["Coastal Warriors", "Green Eagles", "Eastern Heroes", "Valley Stars"] },
  { group: "C", teams: ["Red Storm", "Super Kings", "Royal Eleven", "Apex FC"] },
  { group: "D", teams: ["Lions Academy", "Pioneer FC", "Golden Boots", "City Rangers"] },
];

export default function PublicGroupsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Group Stage Draw Allocations"
        subtitle="Official Group Assignments for Season 2025"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Groups" },
        ]}
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {groupsData.map((g) => (
          <Card key={g.group} padding="none">
            <CardHeader className="bg-[var(--color-primary)] text-white">
              <div className="flex items-center justify-between w-full">
                <span className="font-display text-lg font-bold">Group {g.group}</span>
                <Badge variant="accent" size="sm">4 Teams</Badge>
              </div>
            </CardHeader>
            <CardBody className="p-0 divide-y divide-[var(--color-border)]">
              {g.teams.map((team, idx) => (
                <div key={team} className="px-4 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-bg-muted)] text-[var(--color-primary)] font-display text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-display font-semibold text-sm text-[var(--color-text)]">
                    {team}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
