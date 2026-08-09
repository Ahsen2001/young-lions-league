import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "Match Control Center",
};

export default function AdminMatchesPage() {
  return (
    <div>
      <PageHeader
        title="Match Results & Live Control"
        subtitle="Record official match scores, cards, and update live status"
      />
    </div>
  );
}
