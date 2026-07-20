"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Bell, Thermometer, Droplets, Wheat, Skull, Truck, Package } from "lucide-react"

const alertas = [
  { severidad: "Crítica" as const, mensaje: "Galpón 2 - Ala Sur: Temperatura 29.3°C supera umbral crítico (28°C)", timestamp: "20 Jul 2026 14:32", icono: Thermometer },
  { severidad: "Alta" as const, mensaje: "Stock de Amoxicilina por debajo del mínimo (12 / 20 uds)", timestamp: "20 Jul 2026 08:15", icono: Package },
  { severidad: "Alta" as const, mensaje: "Lote H-032: Postura 5% bajo objetivo durante 2 días consecutivos", timestamp: "20 Jul 2026 08:00", icono: Droplets },
  { severidad: "Media" as const, mensaje: "Consumo de alimento 8% por debajo de lo esperado en Galpón 1", timestamp: "19 Jul 2026 16:45", icono: Wheat },
  { severidad: "Media" as const, mensaje: "Mortalidad acumulada Lote H-030 alcanzó 2.9% (esperado 2.3%)", timestamp: "19 Jul 2026 07:30", icono: Skull },
  { severidad: "Baja" as const, mensaje: "Visita programada: María García — Pendiente chequeo cuarentena", timestamp: "18 Jul 2026 10:00", icono: Truck },
  { severidad: "Media" as const, mensaje: "NH₃ en Galpón 2 - Ala Sur alcanzó 5.8 ppm (tendencia ascendente)", timestamp: "18 Jul 2026 09:20", icono: Bell },
  { severidad: "Baja" as const, mensaje: "Mantenimiento preventivo de ventiladores programado para 25 Jul", timestamp: "17 Jul 2026 11:00", icono: Bell },
]

const configAlertas = [
  { tipo: "Temperatura máxima", umbralMin: 0, umbralMax: 28, activa: true, canales: "App + SMS" },
  { tipo: "Temperatura mínima", umbralMin: 16, umbralMax: 0, activa: true, canales: "App" },
  { tipo: "Humedad máxima", umbralMin: 0, umbralMax: 75, activa: true, canales: "App" },
  { tipo: "NH₃ máximo", umbralMin: 0, umbralMax: 10, activa: true, canales: "App + SMS" },
  { tipo: "Consumo agua -20%", umbralMin: 0, umbralMax: 0, activa: true, canales: "App + Email" },
  { tipo: "Postura bajo objetivo", umbralMin: 0, umbralMax: 0, activa: true, canales: "App" },
  { tipo: "Mortalidad diaria >0.5%", umbralMin: 0, umbralMax: 0, activa: false, canales: "Email" },
  { tipo: "Stock bajo inventario", umbralMin: 0, umbralMax: 0, activa: true, canales: "App" },
]

const severityStyles = {
  Crítica: "destructive" as const,
  Alta: "default" as const,
  Media: "secondary" as const,
  Baja: "outline" as const,
}

export default function AlertasPage() {
  const [activas, setActivas] = useState<Record<string, boolean>>(
    Object.fromEntries(configAlertas.map(a => [a.tipo, a.activa]))
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alertas y Notificaciones</h1>
        <p className="text-muted-foreground text-sm">Eventos activos y configuración de umbrales</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {alertas.map((a, i) => {
          const Icon = a.icono
          return (
            <Card key={i} className={a.severidad === "Crítica" ? "border-red-300 bg-red-50/50" : ""}>
              <CardContent className="flex items-start gap-4 py-4">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                  a.severidad === "Crítica" ? "bg-red-100 text-red-600" :
                  a.severidad === "Alta" ? "bg-orange-100 text-orange-600" :
                  a.severidad === "Media" ? "bg-yellow-100 text-yellow-600" :
                  "bg-blue-100 text-blue-600"
                }`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={severityStyles[a.severidad]}>{a.severidad}</Badge>
                    <span className="text-xs text-muted-foreground">{a.timestamp}</span>
                  </div>
                  <p className="text-sm">{a.mensaje}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>Configuración de Alertas</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Tipo de Alerta</th><th className="p-3 font-medium">Umbral Mín</th><th className="p-3 font-medium">Umbral Máx</th><th className="p-3 font-medium">Activa</th><th className="p-3 font-medium">Canales</th>
              </tr>
            </thead>
            <tbody>
              {configAlertas.map((c, i) => {
                const activa = activas[c.tipo]
                return (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 font-medium">{c.tipo}</td>
                    <td className="p-3">{c.umbralMin > 0 ? c.umbralMin : "—"}</td>
                    <td className="p-3">{c.umbralMax > 0 ? c.umbralMax : "—"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setActivas(prev => ({ ...prev, [c.tipo]: !prev[c.tipo] }))}
                        className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${
                          activa ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span className={`inline-block size-3.5 rounded-full bg-white transition-transform ${
                          activa ? "translate-x-[18px]" : "translate-x-1"
                        }`} />
                      </button>
                    </td>
                    <td className="p-3 text-sm">{c.canales}</td>
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
