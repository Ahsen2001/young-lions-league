import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "Admin Standings Engine",
};

export default function AdminStandingsPage() {
  return (
    <div>
      <PageHeader
        title="Standings Calculation Engine"
        subtitle="Server-calculated table rankings, tie-breakers, and qualification"
      />
    </div>
  );
}
