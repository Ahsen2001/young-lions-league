import { PageContainer, Stack } from "@/components/layout";

export const metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <PageContainer>
        <Stack>
          <p className="font-display text-sm tracking-widest text-secondary uppercase">Administration</p>
          <h1 className="text-4xl font-bold text-primary">Dashboard foundation</h1>
          <p className="text-primary/75">Administrative features will be added in their scheduled sprints.</p>
        </Stack>
      </PageContainer>
    </main>
  );
}
