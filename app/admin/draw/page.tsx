import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Official Tournament Draw",
};

export default function AdminDrawPage() {
  return (
    <div>
      <PageHeader
        title="Official Group Draw Ceremony"
        subtitle="Perform live randomized group allocation with projector mode support"
        actions={
          <div className="flex gap-2">
            <Button variant="accent" size="sm">📺 Projector Mode</Button>
            <Button size="sm">Start Live Draw</Button>
          </div>
        }
      />

      <Card padding="none">
        <CardHeader className="bg-[var(--color-primary)] text-white">
          <span className="font-display font-bold text-base">Draw Pots Configuration</span>
          <Badge variant="accent" size="sm">16 Teams Ready</Badge>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-[var(--color-text-muted)]">
            Teams will be drawn sequentially into Groups A, B, C, and D. Group allocations are enforced server-side.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
