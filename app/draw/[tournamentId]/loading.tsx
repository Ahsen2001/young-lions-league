export default function DrawCeremonyLoading() {
  return (
    <div className="h-screen bg-[#234F2D] text-[#F8F7F1] flex flex-col justify-between p-6 sm:p-10 overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <div className="space-y-2">
          <div className="h-4 bg-white/20 w-48 rounded" />
          <div className="h-8 bg-white/30 w-72 rounded" />
        </div>
        <div className="h-10 bg-[#E1B32C]/30 w-36 rounded-full" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-auto">
        <div className="bg-white/10 rounded-2xl h-80 border border-white/10" />
        <div className="bg-[#F8F7F1]/10 rounded-2xl h-80 border border-white/10" />
        <div className="bg-[#F8F7F1]/10 rounded-2xl h-80 border border-white/10" />
      </div>

      {/* Footer Skeleton */}
      <div className="h-12 bg-white/10 rounded-xl" />
    </div>
  );
}
