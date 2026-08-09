import { Skeleton, SkeletonTable } from "@/components/ui/Skeleton";

export default function AdminTeamsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-36 rounded-[var(--radius-md)]" />
      </div>

      <SkeletonTable columns={6} rows={6} />
    </div>
  );
}
