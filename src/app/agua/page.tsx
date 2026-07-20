"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { AlertTriangle } from "lucide-react"

const aguaData = [
  { dia: "07 Jul", real: 228, esperado: 220 }, { dia: "08 Jul", real: 232, esperado: 220 },
  { dia: "09 Jul", real: 218, esperado: 220 }, { dia: "10 Jul", real: 225, esperado: 220 },
  { dia: "11 Jul", real: 230, esperado: 220 }, { dia: "12 Jul", real: 215, esperado: 220 },
  { dia: "13 Jul", real: 222, esperado: 220 }, { dia: "14 Jul", real: 219, esperado: 220 },
  { dia: "15 Jul", real: 225, esperado: 220 }, { dia: "16 Jul", real: 210, esperado: 220 },
  { dia: "17 Jul", real: 208, esperado: 220 }, { dia: "18 Jul", real: 205, esperado: 220 },
  { dia: "19 Jul", real: 212, esperado: 220 }, { dia: "20 Jul", real: 215, esperado: 220 },
]

const lecturasDiarias = [
  { fecha: "20 Jul 2026", seccion: "Galpón 1 - A", litrosAve: 215, total: 1050 },
  { fecha: "20 Jul 2026", seccion: "Galpón 1 - B", litrosAve: 208, total: 1024 },
  { fecha: "20 Jul 2026", seccion: "Galpón 2 - A", litrosAve: 222, total: 1080 },
  { fecha: "19 Jul 2026", seccion: "Galpón 1 - A", litrosAve: 212, total: 1036 },
  { fecha: "19 Jul 2026", seccion: "Galpón 1 - B", litrosAve: 205, total: 1009 },
  { fecha: "19 Jul 2026", seccion: "Galpón 2 - A", litrosAve: 218, total: 1060 },
  { fecha: "18 Jul 2026", seccion: "Galpón 1 - A", litrosAve: 210, total: 1025 },
]

const ultimos = lecturasDiarias.filter(l => l.fecha === "20 Jul 2026")
const promedioHoy = Math.round(ultimos.reduce((s, l) => s + l.litrosAve, 0) / ultimos.length)
const totalHoy = ultimos.reduce((s, l) => s + l.total, 0)

export default function AguaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Monitoreo de Consumo de Agua</h1>
        <p className="text-muted-foreground text-sm">Control diario de consumo y detección de anormalidades</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Litros / Ave / Día</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{promedioHoy}</p><p className="text-xs text-muted-foreground">Promedio últimas lecturas</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Hoy</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{totalHoy.toLocaleString()} L</p><p className="text-xs text-muted-foreground">Suma todas las secciones</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">vs Esperado</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-amber-600">220 L</p><p className="text-xs text-muted-foreground">Diferencia: {(promedioHoy - 220) > 0 ? "+" : ""}{(promedioHoy - 220)} L</p></CardContent></Card>
      </div>

      {promedioHoy < 176 && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="size-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-700">Alerta: Consumo de agua crítico</p>
              <p className="text-sm text-red-600">El consumo ha caído más del 20% respecto al esperado (220 L/ave/día). Verificar bebederos y salud de las aves.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Consumo de Agua — Últimos 14 Días</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aguaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis unit=" L" domain={[180, 250]} />
              <Tooltip formatter={(v) => `${v} L/ave`} />
              <Legend />
              <Line type="monotone" dataKey="esperado" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Esperado" />
              <Line type="monotone" dataKey="real" stroke="var(--color-chart-2)" strokeWidth={3} name="Real" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Lecturas Diarias</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Sección</th><th className="p-3 font-medium">L / Ave / Día</th><th className="p-3 font-medium">Total (L)</th><th className="p-3 font-medium">vs Esperado</th>
              </tr>
            </thead>
            <tbody>
              {lecturasDiarias.map((l, i) => {
                const diff = l.litrosAve - 220
                const alerta = diff < -44
                return (
                  <tr key={i} className={`border-b last:border-0 hover:bg-muted/50 ${alerta ? "bg-red-50" : ""}`}>
                    <td className="p-3 text-sm">{l.fecha}</td>
                    <td className="p-3">{l.seccion}</td>
                    <td className="p-3 font-medium">{l.litrosAve}</td>
                    <td className="p-3">{l.total.toLocaleString()}</td>
                    <td className="p-3">
                      <Badge variant={diff < -44 ? "destructive" : diff < -22 ? "default" : "secondary"}>
                        {diff > 0 ? "+" : ""}{diff}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
