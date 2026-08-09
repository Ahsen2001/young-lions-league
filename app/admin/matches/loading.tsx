import { Skeleton, SkeletonMatchCard } from "@/components/ui/Skeleton";

export default function AdminMatchesLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonMatchCard key={i} />
        ))}
      </div>
    </div>
  );
}
