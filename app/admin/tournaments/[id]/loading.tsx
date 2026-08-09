import { SkeletonGrid, SkeletonCard } from "@/components/ui/Skeleton";

export default function TournamentDetailLoading() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <SkeletonCard className="h-28" />
      <SkeletonGrid count={4} />
      <SkeletonCard className="h-48" />
    </div>
  );
}
