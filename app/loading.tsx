import { Skeleton } from "@/components/ui/Skeleton";

export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-bg)]">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="flex justify-center mb-4">
          <Skeleton circle className="w-16 h-16 bg-[var(--color-primary)]/20" />
        </div>
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>
    </div>
  );
}
