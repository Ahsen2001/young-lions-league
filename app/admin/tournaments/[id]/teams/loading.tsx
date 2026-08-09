import { SkeletonTable } from "@/components/ui/Skeleton";

export default function TeamsLoading() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <SkeletonTable rows={6} />
    </div>
  );
}
