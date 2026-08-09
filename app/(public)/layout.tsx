import type { ReactNode } from "react";

import { SiteFooter, SiteHeader } from "@/components/layout";

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
