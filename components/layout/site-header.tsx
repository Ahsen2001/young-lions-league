import Link from "next/link";

import { PageContainer } from "./page-container";

export function SiteHeader() {
  return (
    <header className="border-b-4 border-accent bg-primary text-white">
      <PageContainer className="flex min-h-16 items-center justify-between py-3">
        <Link className="font-display text-xl font-bold tracking-wide uppercase" href="/">Young Lions</Link>
        <span className="text-sm font-semibold">Oddamavadi</span>
      </PageContainer>
    </header>
  );
}
