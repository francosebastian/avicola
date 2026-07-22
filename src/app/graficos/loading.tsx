import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="rounded-lg border p-4 space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-[280px] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
