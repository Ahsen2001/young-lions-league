import { SkeletonCard, SkeletonGrid } from "@/components/ui/Skeleton";

export default function AdminDrawControlLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 animate-pulse">
        <div className="h-10 bg-[var(--color-bg-card)] w-64 rounded-[var(--radius-md)]" />
        <div className="h-10 bg-[var(--color-bg-card)] w-48 rounded-[var(--radius-md)]" />
      </div>

      <SkeletonGrid columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SkeletonCard className="h-96" />
        </div>
        <div className="lg:col-span-2">
          <SkeletonGrid columns={2} />
        </div>
      </div>
    </div>
  );
}
