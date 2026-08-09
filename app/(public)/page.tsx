import type { Metadata } from "next";
import PageContainer from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Young Lions Sports Club Oddamavadi — Official Football League Hub.",
};

export default function HomePage() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-secondary)] text-[var(--color-text-inverse)] font-display text-sm tracking-widest uppercase">
          Season 2025
        </span>
        <h1 className="font-display text-4xl sm:text-6xl font-bold text-[var(--color-primary)] leading-tight max-w-2xl">
          Young Lions Sports Club
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg max-w-xl">
          Official Football League Management &amp; Match Scheduling System —
          Oddamavadi
        </p>
        <div className="h-1 w-24 rounded-full bg-[var(--color-accent)]" />
        <p className="text-sm text-[var(--color-text-subtle)]">
          Tournament features coming soon. Check back for live fixtures,
          standings, and knockout results.
        </p>
      </div>
    </PageContainer>
  );
}
