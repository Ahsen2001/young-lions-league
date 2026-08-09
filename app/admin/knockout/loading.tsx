import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function AdminKnockoutLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
