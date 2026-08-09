import { PageContainer, Stack } from "@/components/layout";

export default function HomePage() {
  return (
    <PageContainer as="section" className="py-16 sm:py-24">
      <Stack gap="lg">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-primary uppercase">
          Young Lions Sports Club Oddamavadi
        </p>
        <h1 className="max-w-4xl text-5xl leading-none font-bold text-primary sm:text-7xl">
          League Management System
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-primary/80">
          The official home for tournament schedules, results, standings, and knockout progress.
        </p>
      </Stack>
    </PageContainer>
  );
}
