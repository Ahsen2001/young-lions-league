"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";

export default function AdminError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[AdminError]", error);
  }, [error]);

  return (
    <div className="py-12 px-4 flex items-center justify-center">
      <ErrorState
        title="Admin Portal Error"
        description="An error occurred while loading this admin section. Official competition records remain safe."
        detail={error.digest ? `Error Digest: ${error.digest}` : error.message}
        action={
          <div className="flex gap-3 justify-center">
            <Button size="sm" onClick={() => retry()}>
              Retry Request
            </Button>
            <a href="/admin">
              <Button size="sm" variant="outline">
                Back to Dashboard
              </Button>
            </a>
          </div>
        }
      />
    </div>
  );
}
