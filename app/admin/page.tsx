import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-[var(--color-primary)] mb-2">
        Dashboard
      </h1>
      <p className="text-[var(--color-text-muted)]">
        Admin dashboard — coming in a future sprint.
      </p>
    </div>
  );
}
