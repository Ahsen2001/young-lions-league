import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "Admin Knockout Progression",
};

export default function AdminKnockoutPage() {
  return (
    <div>
      <PageHeader
        title="Knockout Bracket Progression"
        subtitle="Manage qualified teams, seed knockout pairings, and schedule finals"
      />
    </div>
  );
}
