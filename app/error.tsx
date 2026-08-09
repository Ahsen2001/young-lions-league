"use client";

import { ErrorState } from "@/components/ui";

export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState onRetry={reset} />;
}
