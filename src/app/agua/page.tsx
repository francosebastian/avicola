"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type SerieItem = { fecha: string; realMl: number; esperadoMl: number; realTotalL: number; esperadoTotalL: number; aves: number }
type LecturaItem = { id: string; fecha: string; seccion: string; litrosAveMl: number; totalL: number; esperadoMl: number; aves: number }
type Resumen = { fecha: string | null; promedioHoyMl: number; esperadoHoyMl: number; totalHoyL: number; diferenciaMl: number; alerta: boolean }

function fmtDia(fecha: string) {
  const d = new Date(fecha + "T00:00:00")
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short" })
}

export default function AguaPage() {
  const [serie, setSerie] = useState<SerieItem[]>([])
  const [lecturas, setLecturas] = useState<LecturaItem[]>([])
  const [resumen, setResumen] = useState<Resumen | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/agua/metricas")
      .then(r => r.json())
      .then(j => {
        if (cancelled) return
        setSerie((j.serie || []) as SerieItem[])
        setLecturas((j.lecturas || []) as LecturaItem[])
        setResumen((j.resumen || null) as Resumen | null)
      })
      .catch(() => toast.error("Error al cargar métricas de agua"))
    return () => { cancelled = true }
  }, [])

  const chartData = serie.map(s => ({ dia: fmtDia(s.fecha), real: s.realMl, esperado: s.esperadoMl }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Monitoreo de Consumo de Agua</h1>
        <p className="text-muted-foreground text-sm">Control diario de consumo y detección de anormalidades</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">ml / Ave / Día</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{resumen ? resumen.promedioHoyMl : "—"}</p>
            <p className="text-xs text-muted-foreground">{resumen?.fecha ? fmtDia(resumen.fecha) : "Últimas lecturas"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Hoy</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{resumen ? resumen.totalHoyL.toLocaleString() : "—"} L</p>
            <p className="text-xs text-muted-foreground">Suma todas las secciones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">vs Esperado</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{resumen ? resumen.esperadoHoyMl : "—"} ml</p>
            <p className="text-xs text-muted-foreground">
              {resumen && `Diferencia: ${resumen.diferenciaMl > 0 ? "+" : ""}${resumen.diferenciaMl} ml`}
            </p>
          </CardContent>
        </Card>
      </div>

      {resumen?.alerta && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="size-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-700">Alerta: Consumo de agua crítico</p>
              <p className="text-sm text-red-600">
                El consumo cayó más del 20% respecto al esperado ({resumen.esperadoHoyMl} ml/ave/día). Verificar bebederos y salud de las aves.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Consumo de Agua — Últimos 14 Días (ml/ave/día)</CardTitle></CardHeader>
        <CardContent>
          {serie.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Sin datos de consumo en el período.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis unit=" ml" />
                <Tooltip formatter={(v) => `${v} ml/ave`} />
                <Legend />
                <Line type="monotone" dataKey="esperado" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Esperado (feed × 2)" />
                <Line type="monotone" dataKey="real" stroke="var(--color-chart-2)" strokeWidth={3} name="Real" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Lecturas Diarias</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Sección</th><th className="p-3 font-medium">ml / Ave / Día</th><th className="p-3 font-medium">Total (L)</th><th className="p-3 font-medium">vs Esperado</th>
              </tr>
            </thead>
            <tbody>
              {lecturas.map(l => {
                const diff = l.litrosAveMl - l.esperadoMl
                const alerta = diff < -Math.round(l.esperadoMl * 0.2)
                return (
                  <tr key={l.id} className={`border-b last:border-0 hover:bg-muted/50 ${alerta ? "bg-red-50" : ""}`}>
                    <td className="p-3 text-sm">{fmtDia(l.fecha)}</td>
                    <td className="p-3">{l.seccion}</td>
                    <td className="p-3 font-medium">{l.litrosAveMl}</td>
                    <td className="p-3">{l.totalL.toLocaleString()}</td>
                    <td className="p-3">
                      <Badge variant={alerta ? "destructive" : diff < 0 ? "default" : "secondary"}>
                        {diff > 0 ? "+" : ""}{diff} ml
                      </Badge>
                    </td>
                  </tr>
                )
              })}
              {lecturas.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">Sin lecturas registradas.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
