"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const posturaData = [
  { semana: 18, real: 5, teorica: 5 }, { semana: 20, real: 50, teorica: 48 },
  { semana: 22, real: 85, teorica: 82 }, { semana: 24, real: 92, teorica: 90 },
  { semana: 26, real: 93, teorica: 92 }, { semana: 28, real: 91, teorica: 92 },
  { semana: 30, real: 89, teorica: 91 }, { semana: 32, real: 90, teorica: 90 },
]

const mortalidadData = [
  { semana: 18, bajas: 12 }, { semana: 20, bajas: 8 }, { semana: 22, bajas: 5 },
  { semana: 24, bajas: 4 }, { semana: 26, bajas: 3 }, { semana: 28, bajas: 6 },
  { semana: 30, bajas: 4 }, { semana: 32, bajas: 3 },
]

export default function LoteDetailPage() {
  const params = useParams()
  const id = params.id as string

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Lote {id}</h1>
            <Badge className="text-sm">postura</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Hy-Line Brown · Galpón 1 · Fila A · 32 semanas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Registro Diario</Button>
          <Button variant="outline">Eventos</Button>
          <Button>Resumen Económico</Button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Aves Iniciales</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">5,000</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Aves Vivas</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">4,885</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Postura</CardTitle></CardHeader><CardContent><p className="text-xl font-bold text-green-700">92.5%</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Mortalidad Acum.</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">2.3%</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Huevos Totales</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">152,400</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Huevos/Ave Alojada</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">30.5</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Curva de Postura</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={posturaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="teorica" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Teórica" />
                <Line type="monotone" dataKey="real" stroke="#166534" strokeWidth={3} name="Real" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Mortalidad Semanal</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mortalidadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bajas" fill="#ef4444" radius={[4, 4, 0, 0]} name="Bajas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Información del Lote</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                ["Código", id],
                ["Línea Genética", "Hy-Line Brown"],
                ["Proveedor Pollitas", "Avícola El Carmen"],
                ["Fecha Recepción", "15 Dic 2025"],
                ["Fecha Nacimiento", "12 Dic 2025"],
                ["Edad Actual", "32 semanas"],
                ["Galpón / Sección", "Galpón 1 / Fila A"],
                ["Costo Pollita Unitario", "$3,850"],
                ["Estado", "Postura (sem 18-90)"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Eventos del Lote</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { fecha: "20 Jul 2026", evento: "Registro diario", user: "Carlos (galponero)" },
                { fecha: "15 Jul 2026", evento: "Vacunación Newcastle + Bronquitis", user: "Dr. Vargas (vet)" },
                { fecha: "01 Jul 2026", evento: "Cambio a Postura Fase 2", user: "Sistema (automático)" },
                { fecha: "18 Jun 2026", evento: "Muestreo de peso corporal", user: "Pedro (supervisor)" },
                { fecha: "01 Jun 2026", evento: "Corte de pico preventivo", user: "Dr. Vargas (vet)" },
                { fecha: "10 May 2026", evento: "Cambio a Postura Fase 1", user: "Sistema (automático)" },
              ].map((e, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded-lg border text-sm">
                  <div><span className="font-medium">{e.evento}</span><p className="text-xs text-muted-foreground">{e.user}</p></div>
                  <span className="text-xs text-muted-foreground">{e.fecha}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
