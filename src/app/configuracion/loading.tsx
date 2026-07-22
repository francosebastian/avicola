import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-48 mt-2" />
      </div>
      <div className="flex gap-2 border-b pb-2">
        {[1,2,3,4].map(i => (
          <Skeleton key={i} className="h-9 w-32 rounded-t-md" />
        ))}
      </div>
      <div className="rounded-lg border p-4 space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-4 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        {[1,2,3,4,5].map(i => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      <div className="rounded-lg border p-4 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-4 pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        {[1,2,3,4,5,6,7].map(i => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      <div className="rounded-lg border p-4 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-4 pb-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-36" />
        </div>
        {[1,2,3,4,5].map(i => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
