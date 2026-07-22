"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="max-w-md">
        <CardHeader><CardTitle>Error</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{error.message || "Ocurrió un error inesperado"}</p>
          <Button onClick={reset}>Reintentar</Button>
        </CardContent>
      </Card>
    </div>
  )
}
