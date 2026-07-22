import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="flex gap-2">
        {[1,2,3,4].map(i => (
          <Skeleton key={i} className="h-9 w-28 rounded-md" />
        ))}
      </div>
      <div className="space-y-3">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="rounded-lg border p-4 flex items-start gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border p-4 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-4 pb-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
        {[1,2,3,4,5,6,7,8].map(i => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
