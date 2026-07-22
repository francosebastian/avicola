import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="rounded-lg border p-4 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-lg border p-3 space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="grid grid-cols-2 gap-2">
                {[1,2,3,4].map(j => (
                  <Skeleton key={j} className="h-6 w-full rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border p-4 space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-4 pb-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        {[1,2,3,4,5].map(i => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
