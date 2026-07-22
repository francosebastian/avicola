import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="flex gap-2">
        {[1,2,3].map(i => (
          <Skeleton key={i} className="h-9 w-28 rounded-md" />
        ))}
        <div className="flex-1" />
        <Skeleton className="h-9 w-48 rounded-md" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => (
          <div key={i} className="rounded-lg border p-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border p-4 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-4 pb-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        {[1,2,3,4,5,6].map(i => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      <div className="rounded-lg border p-4 space-y-4">
        <Skeleton className="h-5 w-52" />
        <div className="flex gap-4 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        {[1,2,3,4].map(i => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
