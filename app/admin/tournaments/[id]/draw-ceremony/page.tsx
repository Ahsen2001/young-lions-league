"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDrawCeremonyRedirect({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/draw/${params.id}`);
  }, [params.id, router]);

  return (
    <div className="min-h-screen bg-[#234F2D] flex items-center justify-center text-white font-display text-lg">
      Redirecting to Live Draw Ceremony…
    </div>
  );
}
