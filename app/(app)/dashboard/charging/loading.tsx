import { Skeleton } from "@/components/ui/skeleton"

export default function ChargingLoading() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Context Bar Skeleton */}
      <div className="sticky top-16 z-40 border-b bg-background">
        <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-6 w-32 ml-auto" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 grid lg:grid-cols-5 gap-0">
        {/* Map Skeleton */}
        <div className="lg:col-span-3 bg-secondary/30 min-h-[400px]">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Panel Skeleton */}
        <div className="lg:col-span-2 border-l p-6 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          </div>

          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  )
}
