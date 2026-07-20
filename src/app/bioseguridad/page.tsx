"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Check, X } from "lucide-react"

const visitas = [
  { nombre: "Juan Pérez", empresa: "NutriAVES S.A.", fecha: "20 Jul 2026", vehiculo: "ABC-123", cuarentena: "ok", desinfectado: true },
  { nombre: "María García", empresa: "Veterinaria Campo", fecha: "18 Jul 2026", vehiculo: "DEF-456", cuarentena: "peligro", desinfectado: true },
  { nombre: "Carlos López", empresa: "INTA", fecha: "15 Jul 2026", vehiculo: "GHI-789", cuarentena: "ok", desinfectado: true },
  { nombre: "Ana Martínez", empresa: "Distribuidora Avícola S.A.", fecha: "14 Jul 2026", vehiculo: "JKL-012", cuarentena: "ok", desinfectado: true },
  { nombre: "Pedro Sánchez", empresa: "Fábrica de Alimentos", fecha: "12 Jul 2026", vehiculo: "MNO-345", cuarentena: "pendiente", desinfectado: false },
]

const checklistInicial = {
  pediluvios: false, cortinas: true, mallas: true,
  roedores: false, moscas: true, rodaluvio: false, cerco: true,
}

const galpones = ["Galpón 1 - A", "Galpón 1 - B", "Galpón 2 - Norte", "Galpón 2 - Sur"]

export default function BioseguridadPage() {
  const [checklist, setChecklist] = useState<Record<string, Record<string, boolean>>>(
    Object.fromEntries(galpones.map(g => [g, { ...checklistInicial }]))
  )

  const toggle = (galpon: string, item: string) => {
    setChecklist(prev => ({
      ...prev,
      [galpon]: { ...prev[galpon], [item]: !prev[galpon][item] },
    }))
  }

  const items = [
    { key: "pediluvios", label: "Pediluvios con desinfectante" },
    { key: "cortinas", label: "Cortinas sanitarias operativas" },
    { key: "mallas", label: "Mallas antipájaros intactas" },
    { key: "roedores", label: "Sin evidencia de roedores" },
    { key: "moscas", label: "Control de moscas activo" },
    { key: "rodaluvio", label: "Rodaluvio funcional" },
    { key: "cerco", label: "Cerco perimetral en buen estado" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bioseguridad y Accesos</h1>
        <p className="text-muted-foreground text-sm">Control de visitas y checklist diario de bioseguridad</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Registro de Visitas</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Nombre</th><th className="p-3 font-medium">Empresa</th><th className="p-3 font-medium">Fecha</th>
                <th className="p-3 font-medium">Vehículo</th><th className="p-3 font-medium">Cuarentena</th><th className="p-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {visitas.map((v, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 font-medium">{v.nombre}</td>
                  <td className="p-3 text-sm">{v.empresa}</td>
                  <td className="p-3 text-sm">{v.fecha}</td>
                  <td className="p-3 text-sm">{v.vehiculo} {v.desinfectado ? "✓" : "✗"}</td>
                  <td className="p-3">
                    <Badge variant={v.cuarentena === "ok" ? "secondary" : v.cuarentena === "peligro" ? "destructive" : "outline"}>
                      {v.cuarentena === "ok" ? "✓ Cuarentena OK" : v.cuarentena === "peligro" ? "⚠️ &lt;48h" : "⏳ Pendiente"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">Ver</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Checklist Diario de Bioseguridad por Galpón</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-3 font-medium min-w-52">Ítem</th>
                  {galpones.map(g => (
                    <th key={g} className="p-3 font-medium text-center">{g}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.key} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 text-sm">{item.label}</td>
                    {galpones.map(g => (
                      <td key={g} className="p-3 text-center">
                        <button
                          onClick={() => toggle(g, item.key)}
                          className={`inline-flex size-7 items-center justify-center rounded-md border transition-colors cursor-pointer ${
                            checklist[g][item.key]
                              ? "bg-green-600 text-white border-green-600"
                              : "bg-white border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {checklist[g][item.key] ? <Check className="size-4" /> : <X className="size-3 text-gray-400" />}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
