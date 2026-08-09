import Link from "next/link";

import { PageContainer, Stack } from "@/components/layout";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center py-16 text-center">
      <PageContainer size="sm">
        <Stack gap="lg" align="center">
          <p className="font-display text-lg font-bold tracking-[0.2em] text-secondary">404</p>
          <h1 className="text-5xl font-bold text-primary">Page not found</h1>
          <p className="text-primary/75">The page may have moved or is not part of the current competition.</p>
          <Link className="inline-flex min-h-11 items-center bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary/90" href="/">
            Return home
          </Link>
        </Stack>
      </PageContainer>
    </main>
  );
}
