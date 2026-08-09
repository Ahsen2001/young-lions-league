import PageContainer from "@/components/layout/PageContainer";
import { SkeletonGrid, Skeleton } from "@/components/ui/Skeleton";

export default function PublicLoading() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="space-y-2 mb-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="h-1 w-16 bg-[var(--color-accent)] rounded-full mt-2" />
        </div>
        <SkeletonGrid count={6} columns={3} />
      </div>
    </PageContainer>
  );
}
