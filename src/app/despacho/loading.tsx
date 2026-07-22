import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>
      <div className="flex gap-2 border-b pb-2">
        {[1,2,3].map(i => (
          <Skeleton key={i} className="h-9 w-32 rounded-t-md" />
        ))}
      </div>
      <div className="rounded-lg border p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="h-5 w-48" />
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-3">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
        <div className="flex justify-end gap-3 pt-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  )
}
