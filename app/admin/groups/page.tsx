import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Admin Group Management",
};

export default function AdminGroupsPage() {
  return (
    <div>
      <PageHeader
        title="Group Stage Management"
        subtitle="Review group allocations and group capacity limits"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Card padding="none">
          <CardHeader>
            <span className="font-display font-bold text-base text-[var(--color-primary)]">Group A</span>
            <Badge variant="primary" size="sm">4 / 4 Teams</Badge>
          </CardHeader>
          <CardBody className="text-sm text-[var(--color-text-muted)] space-y-1">
            <p>1. Oddamavadi FC</p>
            <p>2. Young Lions XI</p>
            <p>3. Battu Strikers</p>
            <p>4. Mavadi United</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
