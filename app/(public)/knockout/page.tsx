import PageContainer from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Knockout Bracket",
};

export default function PublicKnockoutPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Knockout Stage Bracket"
        subtitle="Quarterfinals, Semifinals & Grand Final Progression"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Knockout" },
        ]}
      />

      <div className="grid md:grid-cols-3 gap-6">
        <Card padding="none">
          <CardHeader className="bg-[var(--color-primary)] text-white">
            <span className="font-display font-bold text-sm">Quarterfinal 1</span>
            <Badge variant="accent" size="sm">TBD</Badge>
          </CardHeader>
          <CardBody className="space-y-2">
            <div className="p-2 bg-[var(--color-bg-muted)] rounded flex justify-between font-display text-sm font-semibold">
              <span>Winner Group A</span>
              <span>-</span>
            </div>
            <div className="p-2 bg-[var(--color-bg-muted)] rounded flex justify-between font-display text-sm font-semibold">
              <span>Runner-up Group B</span>
              <span>-</span>
            </div>
          </CardBody>
        </Card>

        <Card padding="none">
          <CardHeader className="bg-[var(--color-primary)] text-white">
            <span className="font-display font-bold text-sm">Quarterfinal 2</span>
            <Badge variant="accent" size="sm">TBD</Badge>
          </CardHeader>
          <CardBody className="space-y-2">
            <div className="p-2 bg-[var(--color-bg-muted)] rounded flex justify-between font-display text-sm font-semibold">
              <span>Winner Group B</span>
              <span>-</span>
            </div>
            <div className="p-2 bg-[var(--color-bg-muted)] rounded flex justify-between font-display text-sm font-semibold">
              <span>Runner-up Group A</span>
              <span>-</span>
            </div>
          </CardBody>
        </Card>

        <Card padding="none">
          <CardHeader className="bg-[var(--color-accent)] text-[var(--color-primary)]">
            <span className="font-display font-bold text-sm">Grand Final</span>
            <Badge variant="primary" size="sm">Season Finale</Badge>
          </CardHeader>
          <CardBody className="space-y-2">
            <div className="p-2 bg-[var(--color-bg-muted)] rounded flex justify-between font-display text-sm font-semibold">
              <span>Winner Semifinal 1</span>
              <span>-</span>
            </div>
            <div className="p-2 bg-[var(--color-bg-muted)] rounded flex justify-between font-display text-sm font-semibold">
              <span>Winner Semifinal 2</span>
              <span>-</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}
