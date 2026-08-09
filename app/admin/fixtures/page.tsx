import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Admin Fixtures Generator",
};

export default function AdminFixturesPage() {
  return (
    <div>
      <PageHeader
        title="Fixture Generator & Scheduling"
        subtitle="Auto-generate round robin group fixtures and match dates"
        actions={<Button size="sm">⚡ Generate Fixtures</Button>}
      />
    </div>
  );
}
