"use client";

import { PageContainer, Stack } from "@/components/layout";

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="grid min-h-[60vh] place-items-center py-16 text-center" role="alert">
      <PageContainer size="sm">
        <Stack gap="lg" align="center">
          <p className="font-display text-sm font-bold tracking-widest text-secondary uppercase">Something went wrong</p>
          <h1 className="text-4xl font-bold text-primary">This page could not be loaded</h1>
          <p className="text-primary/75">Try the request again. Your navigation context has been preserved.</p>
          <button className="min-h-11 bg-primary px-6 py-3 font-bold text-white" onClick={onRetry} type="button">Try again</button>
        </Stack>
      </PageContainer>
    </main>
  );
}
