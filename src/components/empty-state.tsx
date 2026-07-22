import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon = "📭", title, description, action, className }: EmptyStateProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-4xl mb-4">{icon}</span>
        <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>}
        {action && <div className="mt-2">{action}</div>}
      </CardContent>
    </Card>
  )
}
