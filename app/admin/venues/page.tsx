import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "Admin Venues Management",
};

export default function AdminVenuesPage() {
  return (
    <div>
      <PageHeader
        title="Venues & Grounds Management"
        subtitle="Manage stadium locations, pitch assignments, and availability"
      />
    </div>
  );
}
