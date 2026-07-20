"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const posturaData = [
  { semana: 18, real: 5, teorica: 5 }, { semana: 20, real: 50, teorica: 48 },
  { semana: 22, real: 85, teorica: 82 }, { semana: 24, real: 92, teorica: 90 },
  { semana: 26, real: 93, teorica: 92 }, { semana: 28, real: 91, teorica: 92 },
  { semana: 30, real: 89, teorica: 91 }, { semana: 32, real: 90, teorica: 90 },
]

const clasificacionData = [
  { name: "Jumbo", value: 15 }, { name: "Super", value: 36 },
  { name: "Extra", value: 30 }, { name: "Primera", value: 12 },
  { name: "Segunda", value: 5 }, { name: "Tercera", value: 2 },
]

const COLORS = ["#166534", "#22c55e", "#86efac", "#fbbf24", "#f97316", "#ef4444"]

const alertas = [
  { tipo: "Crítica", mensaje: "Galpón 2 — Temperatura >28°C (29.3°C)", hora: "14:30" },
  { tipo: "Alta", mensaje: "Lote H-032 — Postura 5% bajo objetivo 2 días", hora: "08:15" },
  { tipo: "Media", mensaje: "Stock alimento postura bajo mínimo (320 kg)", hora: "07:00" },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard de Producción</h1>
          <p className="text-muted-foreground text-sm">Lunes, 20 Julio 2026 — Resumen general</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          🟢 3 lotes activos
        </Badge>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Postura Hoy</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-green-700">92.5%</p><p className="text-xs text-muted-foreground">↑ 0.7% vs ayer</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Huevos Hoy</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">4,520</p><p className="text-xs text-muted-foreground">Clasificados: 4,488</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Aves Vivas</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">14,655</p><p className="text-xs text-muted-foreground">3 lotes activos</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Mortalidad Acum.</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-amber-600">2.3%</p><p className="text-xs text-muted-foreground">Esperado: 2.1%</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Conversión Alim.</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">2.08</p><p className="text-xs text-muted-foreground">Rango óptimo: 2.0-2.2</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader><CardTitle>Curva de Postura — Lote H-032 (Hy-Line Brown)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={posturaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" label={{ value: "Semana", position: "bottom" }} />
                <YAxis domain={[0, 100]} label={{ value: "%", angle: -90, position: "left" }} />
                <Tooltip />
                <Line type="monotone" dataKey="teorica" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Teórica" />
                <Line type="monotone" dataKey="real" stroke="#166534" strokeWidth={3} name="Real" dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Clasificación del Día</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={clasificacionData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value">
                  {clasificacionData.map((_, i) => (<Cell key={i} fill={COLORS[i]} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Alertas Activas</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertas.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Badge variant={a.tipo === "Crítica" ? "destructive" : a.tipo === "Alta" ? "default" : "secondary"}>{a.tipo}</Badge>
                  <span>{a.mensaje}</span>
                </div>
                <span className="text-xs text-muted-foreground">{a.hora}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
