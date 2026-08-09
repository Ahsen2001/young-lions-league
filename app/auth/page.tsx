import { PageContainer } from "@/components/layout";

export const metadata = { title: "Sign in" };

export default function AuthPage() {
  return (
    <main className="grid min-h-screen place-items-center py-12">
      <PageContainer size="sm">
        <h1 className="text-4xl font-bold text-primary">Authentication</h1>
        <p className="mt-4 text-primary/75">Authentication will be implemented in a future task.</p>
      </PageContainer>
    </main>
  );
}
