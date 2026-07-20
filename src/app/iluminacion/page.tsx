"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const programaPlanificado = [
  { semana: 1, horasLuz: 24, intensidad: 30, encendido: "00:00", apagado: "00:00" },
  { semana: 2, horasLuz: 22, intensidad: 30, encendido: "02:00", apagado: "22:00" },
  { semana: 3, horasLuz: 20, intensidad: 35, encendido: "03:00", apagado: "21:00" },
  { semana: 4, horasLuz: 18, intensidad: 40, encendido: "04:00", apagado: "20:00" },
  { semana: 5, horasLuz: 16, intensidad: 45, encendido: "05:00", apagado: "19:00" },
  { semana: 6, horasLuz: 14, intensidad: 50, encendido: "05:30", apagado: "18:30" },
  { semana: 7, horasLuz: 12, intensidad: 55, encendido: "06:00", apagado: "18:00" },
  { semana: 8, horasLuz: 11, intensidad: 60, encendido: "06:00", apagado: "17:00" },
  { semana: 9, horasLuz: 11, intensidad: 65, encendido: "06:00", apagado: "17:00" },
  { semana: 10, horasLuz: 11, intensidad: 70, encendido: "06:00", apagado: "17:00" },
  { semana: 11, horasLuz: 11, intensidad: 75, encendido: "06:00", apagado: "17:00" },
  { semana: 12, horasLuz: 11, intensidad: 80, encendido: "06:00", apagado: "17:00" },
]

const registroReal = [
  { fecha: "20 Jul 2026", horasReales: 11.2, encendidoReal: "06:10", desviacion: 10, observaciones: "Retraso por corte eléctrico" },
  { fecha: "19 Jul 2026", horasReales: 11.0, encendidoReal: "06:00", desviacion: 0, observaciones: "Normal" },
  { fecha: "18 Jul 2026", horasReales: 10.5, encendidoReal: "06:00", desviacion: -30, observaciones: "Apagado manual por mantenimiento" },
  { fecha: "17 Jul 2026", horasReales: 11.0, encendidoReal: "06:00", desviacion: 0, observaciones: "Normal" },
  { fecha: "16 Jul 2026", horasReales: 12.5, encendidoReal: "05:30", desviacion: 90, observaciones: "Error de programación del timer" },
  { fecha: "15 Jul 2026", horasReales: 11.0, encendidoReal: "06:00", desviacion: 0, observaciones: "Normal" },
  { fecha: "14 Jul 2026", horasReales: 11.0, encendidoReal: "06:00", desviacion: 0, observaciones: "Normal" },
]

export default function IluminacionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Programa de Iluminación</h1>
        <p className="text-muted-foreground text-sm">Control de horas luz, intensidad y registro de desviaciones</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Programa Planificado — Recría (Semanas 1–12)</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Semana</th><th className="p-3 font-medium">Horas Luz</th><th className="p-3 font-medium">Intensidad (lux)</th><th className="p-3 font-medium">Encendido</th><th className="p-3 font-medium">Apagado</th>
              </tr>
            </thead>
            <tbody>
              {programaPlanificado.map((p, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 font-medium">Sem {p.semana}</td>
                  <td className="p-3">{p.horasLuz}h</td>
                  <td className="p-3">{p.intensidad} lux</td>
                  <td className="p-3 text-sm">{p.encendido}</td>
                  <td className="p-3 text-sm">{p.apagado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Registro Real de Iluminación</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Horas Reales</th><th className="p-3 font-medium">Encendido Real</th><th className="p-3 font-medium">Desviación</th><th className="p-3 font-medium">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {registroReal.map((r, i) => (
                <tr key={i} className={`border-b last:border-0 hover:bg-muted/50 ${Math.abs(r.desviacion) > 30 ? "bg-red-50" : ""}`}>
                  <td className="p-3 text-sm">{r.fecha}</td>
                  <td className="p-3 font-medium">{r.horasReales}h</td>
                  <td className="p-3 text-sm">{r.encendidoReal}</td>
                  <td className="p-3">
                    {Math.abs(r.desviacion) > 30 ? (
                      <Badge variant="destructive">
                        {r.desviacion > 0 ? "+" : ""}{r.desviacion} min
                      </Badge>
                    ) : (
                      <span className={`text-sm ${r.desviacion === 0 ? "text-green-600" : "text-amber-600"}`}>
                        {r.desviacion > 0 ? "+" : ""}{r.desviacion} min
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{r.observaciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
