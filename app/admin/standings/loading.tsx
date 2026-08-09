import { Skeleton, SkeletonStandings } from "@/components/ui/Skeleton";

export default function AdminStandingsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-6">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-4 w-80" />
      </div>

      <SkeletonStandings rows={5} />
    </div>
  );
}
