"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const consumoData = [
  { dia: "Lun", kg: 525 }, { dia: "Mar", kg: 510 },
  { dia: "Mié", kg: 538 }, { dia: "Jue", kg: 492 },
  { dia: "Vie", kg: 515 }, { dia: "Sáb", kg: 530 },
  { dia: "Dom", kg: 520 },
]

const formulas = [
  { nombre: "Postura Premium", tipo: "Completo", costo: 0.42, proteina: "18.5%", energia: "2,850 kcal" },
  { nombre: "Postura Estándar", tipo: "Completo", costo: 0.38, proteina: "17.0%", energia: "2,750 kcal" },
  { nombre: "Recría Inicial", tipo: "Concentrado", costo: 0.35, proteina: "20.0%", energia: "2,900 kcal" },
  { nombre: "Recría Crecimiento", tipo: "Concentrado", costo: 0.32, proteina: "16.0%", energia: "2,700 kcal" },
  { nombre: "Pre-postura", tipo: "Completo", costo: 0.40, proteina: "17.5%", energia: "2,800 kcal" },
  { nombre: "Núcleo Mineral", tipo: "Núcleo", costo: 0.85, proteina: "5.0%", energia: "1,200 kcal" },
]

const consumoDiario = [
  { fecha: "20 Jul 2026", tipo: "Postura Premium", kg: 525, formula: "Postura Premium", costo: 220.50 },
  { fecha: "19 Jul 2026", tipo: "Postura Premium", kg: 510, formula: "Postura Premium", costo: 214.20 },
  { fecha: "18 Jul 2026", tipo: "Postura Premium", kg: 538, formula: "Postura Premium", costo: 225.96 },
  { fecha: "17 Jul 2026", tipo: "Postura Premium", kg: 492, formula: "Postura Premium", costo: 206.64 },
  { fecha: "17 Jul 2026", tipo: "Recría Crecimiento", kg: 180, formula: "Recría Crec.", costo: 57.60 },
  { fecha: "16 Jul 2026", tipo: "Postura Premium", kg: 515, formula: "Postura Premium", costo: 216.30 },
  { fecha: "15 Jul 2026", tipo: "Postura Premium", kg: 530, formula: "Postura Premium", costo: 222.60 },
  { fecha: "14 Jul 2026", tipo: "Pre-postura", kg: 240, formula: "Pre-postura", costo: 96.00 },
]

export default function AlimentacionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alimentación y Nutrición</h1>
          <p className="text-muted-foreground text-sm">Monitoreo de consumo de alimento y formulación de raciones</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Consumo Hoy</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">525 kg</p><p className="text-xs text-muted-foreground">3.96 kg/100 aves</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Costo Alimento / Huevo</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-amber-600">$0.042</p><p className="text-xs text-muted-foreground">Objetivo: ≤ $0.040</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Conversión Alimenticia</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-green-700">2.08</p><p className="text-xs text-muted-foreground">kg alimento / kg huevo</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Consumo Diario de Alimento (7 días)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={consumoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis unit=" kg" />
              <Tooltip formatter={(v) => `${v} kg`} />
              <Bar dataKey="kg" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Fórmulas de Alimento</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-3 font-medium">Nombre</th><th className="p-3 font-medium">Tipo</th><th className="p-3 font-medium">Costo/kg</th><th className="p-3 font-medium">Proteína</th><th className="p-3 font-medium">Energía</th>
                </tr>
              </thead>
              <tbody>
                {formulas.map((f, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 font-medium">{f.nombre}</td>
                    <td className="p-3"><Badge variant="secondary">{f.tipo}</Badge></td>
                    <td className="p-3">${f.costo.toFixed(2)}</td>
                    <td className="p-3">{f.proteina}</td>
                    <td className="p-3">{f.energia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Registro de Consumo Diario</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Tipo</th><th className="p-3 font-medium">Cantidad</th><th className="p-3 font-medium">Fórmula</th><th className="p-3 font-medium">Costo</th>
                </tr>
              </thead>
              <tbody>
                {consumoDiario.map((c, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 text-sm">{c.fecha}</td>
                    <td className="p-3">{c.tipo}</td>
                    <td className="p-3">{c.kg} kg</td>
                    <td className="p-3 text-sm">{c.formula}</td>
                    <td className="p-3">${c.costo.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
