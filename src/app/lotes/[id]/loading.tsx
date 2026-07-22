import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="rounded-lg border p-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-lg border p-4 space-y-4">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-[280px] rounded-lg" />
        </div>
        <div className="rounded-lg border p-4 space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-[280px] rounded-lg" />
        </div>
      </div>
      <div className="rounded-lg border p-4 space-y-4">
        <Skeleton className="h-5 w-48" />
        {[1,2,3,4].map(i => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
