import { Skeleton, SkeletonMatchCard } from "@/components/ui/Skeleton";

export default function AdminFixturesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-36 rounded-[var(--radius-md)]" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonMatchCard key={i} />
        ))}
      </div>
    </div>
  );
}
