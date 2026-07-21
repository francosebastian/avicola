"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function PackingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Packing y Clasificación de Huevos</h1>
          <p className="text-muted-foreground text-sm">Registro diario de packing — Lunes 20 Julio 2026</p>
        </div>
        <Button>Confirmar Packing</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Total Procesado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">4,520</p><p className="text-xs text-muted-foreground">huevos hoy</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Total Clasificado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-700">4,488</p><p className="text-xs text-muted-foreground">99.3% del total</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Merma</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-amber-600">32</p><p className="text-xs text-muted-foreground">sucio + roto + descarte</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">% Merma</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">0.7%</p><p className="text-xs text-muted-foreground">objetivo: &lt;1.0%</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Seleccionar Origen</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Lote</label>
                <select className="w-full mt-1 rounded-md border p-2 text-sm bg-background">
                  <option>H-032 — Hy-Line Brown</option>
                  <option>H-033 — Hy-Line Brown</option>
                  <option>H-035 — ISA Brown</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Sección</label>
                <select className="w-full mt-1 rounded-md border p-2 text-sm bg-background">
                  <option>Galpón 1 — Fila A</option>
                  <option>Galpón 1 — Fila B</option>
                  <option>Galpón 1 — Fila C</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Resumen Producción Lote H-032</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Registro diario hoy:</span><span className="font-medium">4,520 huevos</span>
              <span className="text-muted-foreground">Aves en postura:</span><span className="font-medium">4,885</span>
              <span className="text-muted-foreground">Tasa postura:</span><span className="font-medium">92.5%</span>
              <span className="text-muted-foreground">Clasificación esperada:</span><span className="font-medium">Jumbo 15% / Super 36% / Extra 30%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Registro de Clasificación</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-4 p-4 rounded-lg border border-red-200 bg-red-50">
              <h3 className="font-semibold text-sm text-red-700">No Clasificables</h3>
              <div>
                <label className="text-sm">Huevos Sucios</label>
                <Input type="number" defaultValue={12} className="mt-1" />
              </div>
              <div>
                <label className="text-sm">Huevos Rotos</label>
                <Input type="number" defaultValue={15} className="mt-1" />
              </div>
              <div>
                <label className="text-sm">Descarte</label>
                <Input type="number" defaultValue={5} className="mt-1" />
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-lg border border-green-200 bg-green-50">
              <h3 className="font-semibold text-sm text-green-700">Clasificación Estándar</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Jumbo (≥68g)</label>
                  <Input type="number" defaultValue={678} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm">Super (65-67g)</label>
                  <Input type="number" defaultValue={1627} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm">Extra (61-64g)</label>
                  <Input type="number" defaultValue={1356} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm">Primera (55-60g)</label>
                  <Input type="number" defaultValue={542} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm">Segunda (50-54g)</label>
                  <Input type="number" defaultValue={226} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm">Tercera (&lt;50g)</label>
                  <Input type="number" defaultValue={59} className="mt-1" />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-lg border">
              <h3 className="font-semibold text-sm">Totales</h3>
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">Total Clasificado</p>
                <p className="text-4xl font-bold text-green-700">4,488</p>
              </div>
              <div className="text-center py-4 border-t">
                <p className="text-sm text-muted-foreground">Diferencia con producción</p>
                <p className="text-xl font-bold text-amber-600">32 (merma)</p>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                La diferencia se descuenta automáticamente del inventario de huevos del lote.
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">Observaciones</label>
            <textarea className="w-full mt-1 rounded-md border p-2 text-sm bg-background" rows={2} placeholder="Ej: alta cantidad de huevos sucios por lluvia..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Últimos Registros de Packing</CardTitle>
            <Badge variant="outline">Hoy: 3 registros</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Lote</th><th className="p-3 font-medium">Sección</th>
                <th className="p-3 font-medium">Total</th><th className="p-3 font-medium">Clasificado</th><th className="p-3 font-medium">Merma</th><th className="p-3 font-medium">% Merma</th><th className="p-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {[
                { fecha: "20 Jul 2026", lote: "H-032", seccion: "G1-FA", total: 4520, clasif: 4488, merma: 32, pct: "0.7%", est: "confirmado" },
                { fecha: "20 Jul 2026", lote: "H-033", seccion: "G1-FB", total: 4350, clasif: 4300, merma: 50, pct: "1.1%", est: "pendiente" },
                { fecha: "19 Jul 2026", lote: "H-032", seccion: "G1-FA", total: 4480, clasif: 4450, merma: 30, pct: "0.7%", est: "confirmado" },
                { fecha: "19 Jul 2026", lote: "H-033", seccion: "G1-FB", total: 4320, clasif: 4290, merma: 30, pct: "0.7%", est: "confirmado" },
                { fecha: "18 Jul 2026", lote: "H-032", seccion: "G1-FA", total: 4510, clasif: 4478, merma: 32, pct: "0.7%", est: "confirmado" },
              ].map((r, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 text-sm">{r.fecha}</td>
                  <td className="p-3 font-medium">{r.lote}</td>
                  <td className="p-3 text-sm">{r.seccion}</td>
                  <td className="p-3">{r.total.toLocaleString()}</td>
                  <td className="p-3">{r.clasif.toLocaleString()}</td>
                  <td className="p-3 text-amber-600">{r.merma}</td>
                  <td className="p-3">{r.pct}</td>
                  <td className="p-3"><Badge variant={r.est === "confirmado" ? "default" : "secondary"}>{r.est}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
