"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { AlertTriangle } from "lucide-react"

const ambientalData = Array.from({ length: 48 }, (_, i) => ({
  hora: `${String(i).padStart(2, "0")}:00`,
  temperatura: 22 + Math.sin(i / 4) * 3 + (Math.random() - 0.5) * 1.5,
  humedad: 60 + Math.cos(i / 6) * 10 + (Math.random() - 0.5) * 3,
  amoniaco: 2 + Math.sin(i / 8) * 1.5 + (Math.random() - 0.5) * 0.8,
}))

const seccionesAmbiental = [
  { seccion: "Galpón 1 - Fila A", temperatura: 24.2, humedad: 65, amoniaco: 3.0, tempAlerta: false },
  { seccion: "Galpón 1 - Fila B", temperatura: 25.1, humedad: 68, amoniaco: 4.2, tempAlerta: false },
  { seccion: "Galpón 1 - Fila C", temperatura: 23.8, humedad: 62, amoniaco: 2.1, tempAlerta: false },
  { seccion: "Galpón 2 - Ala Norte", temperatura: 24.5, humedad: 66, amoniaco: 3.5, tempAlerta: false },
  { seccion: "Galpón 2 - Ala Sur", temperatura: 29.3, humedad: 72, amoniaco: 5.8, tempAlerta: true },
]

const horaActual = ambientalData[ambientalData.length - 1]

export default function AmbientalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Control Ambiental</h1>
        <p className="text-muted-foreground text-sm">Monitoreo de temperatura, humedad y amoniaco por sección</p>
      </div>

      {seccionesAmbiental.some(s => s.tempAlerta) && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="size-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-700">Alerta Crítica: Temperatura elevada</p>
              <p className="text-sm text-red-600">Galpón 2 - Ala Sur registra 29.3°C (umbral crítico &gt;28°C). Activar ventilación de emergencia.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Temp. Actual</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{horaActual.temperatura.toFixed(1)}°C</p><p className="text-xs text-muted-foreground">Promedio galpones</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Humedad</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{Math.round(horaActual.humedad)}%</p><p className="text-xs text-muted-foreground">Rango objetivo: 50-70%</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">NH₃</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-amber-600">{horaActual.amoniaco.toFixed(1)} ppm</p><p className="text-xs text-muted-foreground">Límite máximo: 10 ppm</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Variables Ambientales — Últimas 48 Horas</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={ambientalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" tick={{ fontSize: 10 }} interval={5} />
              <YAxis yAxisId="temp" domain={[15, 35]} label={{ value: "°C", angle: -90, position: "left" }} />
              <YAxis yAxisId="hum" orientation="right" domain={[30, 90]} label={{ value: "% / ppm", angle: 90, position: "right" }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="temp" type="monotone" dataKey="temperatura" stroke="#ef4444" strokeWidth={2} name="Temperatura °C" dot={false} />
              <Line yAxisId="hum" type="monotone" dataKey="humedad" stroke="#3b82f6" strokeWidth={2} name="Humedad %" dot={false} />
              <Line yAxisId="hum" type="monotone" dataKey="amoniaco" stroke="#f59e0b" strokeWidth={2} name="NH₃ ppm" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Lecturas Actuales por Sección</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Sección</th><th className="p-3 font-medium">Temperatura</th><th className="p-3 font-medium">Humedad</th><th className="p-3 font-medium">NH₃</th><th className="p-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {seccionesAmbiental.map((s, i) => (
                <tr key={i} className={`border-b last:border-0 hover:bg-muted/50 ${s.tempAlerta ? "bg-red-50" : ""}`}>
                  <td className="p-3 font-medium">{s.seccion}</td>
                  <td className="p-3">
                    <span className={s.temperatura > 28 ? "text-red-600 font-bold" : ""}>{s.temperatura}°C</span>
                  </td>
                  <td className="p-3">{s.humedad}%</td>
                  <td className="p-3">{s.amoniaco} ppm</td>
                  <td className="p-3">
                    {s.tempAlerta ? (
                      <Badge variant="destructive">Crítica</Badge>
                    ) : s.temperatura > 26 ? (
                      <Badge variant="default">Alerta</Badge>
                    ) : (
                      <Badge variant="secondary">Normal</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
