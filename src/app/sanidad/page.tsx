"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const tratamientos = [
  { tipo: "Vacunación", lote: "H-032", desc: "Newcastle + Bronquitis", fecha: "15 Jul 2026", via: "Ocular", retiro: "—", estado: "completado" },
  { tipo: "Tratamiento", lote: "H-033", desc: "Amoxicilina 20%", fecha: "18-22 Jul 2026", via: "Agua bebida", retiro: "5 días (27 Jul)", estado: "activo" },
  { tipo: "Vacunación", lote: "H-034", desc: "Enfermedad de Marek", fecha: "Programada: 01 Ago", via: "SC", retiro: "—", estado: "programada" },
]

export default function SanidadPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Módulo Sanitario y Bioseguridad</h1>
          <p className="text-muted-foreground text-sm">Vacunación, tratamientos, necropsias y control de accesos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Registrar Vacunación</Button>
          <Button variant="outline">Registrar Tratamiento</Button>
          <Button>+ Necropsia</Button>
        </div>
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardHeader><CardTitle className="text-red-700 flex items-center gap-2">⚠️ Período de Retiro Activo</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-red-600"><strong>Lote H-033</strong> — Tratamiento con Amoxicilina finaliza el 22 Jul. Periodo de retiro de huevos hasta el <strong>27 Jul 2026</strong> (faltan 7 días).</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Registro de Vacunaciones y Tratamientos</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Tipo</th><th className="p-3 font-medium">Lote</th><th className="p-3 font-medium">Producto</th>
                <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Vía</th><th className="p-3 font-medium">Fin Retiro</th><th className="p-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {tratamientos.map((t, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3"><Badge variant={t.tipo === "Vacunación" ? "secondary" : "default"}>{t.tipo}</Badge></td>
                  <td className="p-3 font-medium">{t.lote}</td>
                  <td className="p-3">{t.desc}</td>
                  <td className="p-3 text-sm">{t.fecha}</td>
                  <td className="p-3 text-sm">{t.via}</td>
                  <td className="p-3 text-sm">{t.retiro}</td>
                  <td className="p-3"><Badge variant={t.estado === "activo" ? "destructive" : t.estado === "programada" ? "outline" : "secondary"}>{t.estado}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Necropsias Recientes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[1,2,3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">Lote H-032 — {["Colibacilosis", "Ascitis", "Síndrome de mala absorción"][i-1]}</p>
                  <p className="text-xs text-muted-foreground">{["15 Jul", "12 Jul", "08 Jul"][i-1]} • {["3", "2", "5"][i-1]} aves</p>
                </div>
                <Button variant="ghost" size="sm">Ver</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Últimas Visitas Registradas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg border">
              <div><p className="font-medium text-sm">Juan Pérez — NutriAVES S.A.</p><p className="text-xs text-muted-foreground">Hoy 10:30 • Vehículo: ABC-123 • Desinfectado</p></div>
              <Badge variant="outline" className="text-green-600">✓ Cuarentena OK</Badge>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg border">
              <div><p className="font-medium text-sm">María García — Veterinaria Campo</p><p className="text-xs text-muted-foreground">18 Jul 15:00 • Última visita otra granja: 17 Jul</p></div>
              <Badge variant="destructive">⚠️ Cuarentena &lt;48h</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
