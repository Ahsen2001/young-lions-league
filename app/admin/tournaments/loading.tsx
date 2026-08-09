import { Skeleton, SkeletonTournamentCard } from "@/components/ui/Skeleton";

export default function AdminTournamentsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-36 rounded-[var(--radius-md)]" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonTournamentCard key={i} />
        ))}
      </div>
    </div>
  );
}
