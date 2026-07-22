import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="rounded-lg border">
        <div className="p-6 flex flex-col items-center space-y-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  )
}
