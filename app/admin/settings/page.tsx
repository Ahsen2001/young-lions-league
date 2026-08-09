import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = {
  title: "Admin System Settings",
};

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader
        title="League System Settings"
        subtitle="Global configuration, tie-breaker rules, points rules, and admin roles"
      />
    </div>
  );
}
