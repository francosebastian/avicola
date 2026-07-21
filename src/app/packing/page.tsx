"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const formatos: Record<string, { label: string, uds: number }> = {
  jumbo: { label: "Jumbo (≥68g)", uds: 180 },
  super: { label: "Super (65-67g)", uds: 100 },
  extra: { label: "Extra (61-64g)", uds: 180 },
  primera: { label: "Primera (55-60g)", uds: 180 },
  segunda: { label: "Segunda (50-54g)", uds: 180 },
  tercera: { label: "Tercera (<50g)", uds: 180 },
}

export default function PackingPage() {
  const [tab, setTab] = useState<"registro" | "inventario">("registro")
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Packing y Clasificación de Huevos</h1>
          <p className="text-muted-foreground text-sm">Registro diario por cajas — Lunes 20 Julio 2026</p>
        </div>
        <div className="flex gap-2">
          <Link href="/despacho"><Button variant="outline">Ir a Despachos</Button></Link>
          <Button>Confirmar Packing</Button>
        </div>
      </div>

      <div className="flex gap-2 border-b pb-2">
        <button onClick={() => setTab("registro")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "registro" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Registro de Packing</button>
        <button onClick={() => setTab("inventario")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "inventario" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Inventario Acumulado</button>
      </div>

      {tab === "registro" && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Total Procesado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">4,520</p><p className="text-xs text-muted-foreground">unidades hoy</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Total Clasificado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-700">4,488</p><p className="text-xs text-muted-foreground">99.3% del total</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Merma</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-amber-600">32</p><p className="text-xs text-muted-foreground">sucio + roto + descarte</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">% Merma</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">0.7%</p><p className="text-xs text-muted-foreground text-green-700">objetivo: &lt;1.0% ✓</p></CardContent></Card>
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
              <CardHeader><CardTitle>Formato de Cajas</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-3 gap-2 text-sm">
                {Object.entries(formatos).map(([key, f]) => (
                  <div key={key} className="p-2 rounded border text-center">
                    <p className="font-medium text-xs">{f.label.split("(")[0].trim()}</p>
                    <p className="text-muted-foreground text-xs">{f.uds} uds/caja</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Registro por Cajas</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4 p-4 rounded-lg border border-red-200 bg-red-50">
                  <h3 className="font-semibold text-sm text-red-700">No Clasificables</h3>
                  <div>
                    <label className="text-sm">Huevos Sucios (uds)</label>
                    <Input type="number" defaultValue={12} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm">Huevos Rotos (uds)</label>
                    <Input type="number" defaultValue={15} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm">Descarte (uds)</label>
                    <Input type="number" defaultValue={5} className="mt-1" />
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-lg border border-green-200 bg-green-50">
                  <h3 className="font-semibold text-sm text-green-700">Clasificación por Cajas</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(formatos).map(([key, f]) => (
                      <div key={key}>
                        <label className="text-sm">{f.label}</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input type="number" placeholder="cajas" className="flex-1" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">×{f.uds}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-lg border">
                  <h3 className="font-semibold text-sm">Totales del Día</h3>
                  <div className="space-y-3">
                    <div className="text-center py-4 border-b">
                      <p className="text-sm text-muted-foreground">Total Clasificado</p>
                      <p className="text-4xl font-bold text-green-700">4,488 uds</p>
                      <p className="text-xs text-muted-foreground mt-1">equivalente a ~25 cajas</p>
                    </div>
                    <div className="text-center py-3">
                      <p className="text-sm text-muted-foreground">Merma del día</p>
                      <p className="text-xl font-bold text-amber-600">32 uds (0.7%)</p>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      Al confirmar, se suman cajas y unidades al inventario acumulado de packing.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium">Observaciones</label>
                <textarea className="w-full mt-1 rounded-md border p-2 text-sm bg-background" rows={2} placeholder="Ej: lotes de extra con alta producción hoy..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Últimos Registros de Packing</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Lote</th><th className="p-3 font-medium">Cajas</th>
                    <th className="p-3 font-medium">Unidades</th><th className="p-3 font-medium">Merma</th><th className="p-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { fecha: "20 Jul 2026", lote: "H-032", cajas: 25, uds: 4488, merma: 32, est: "confirmado" },
                    { fecha: "20 Jul 2026", lote: "H-033", cajas: 24, uds: 4300, merma: 50, est: "pendiente" },
                    { fecha: "19 Jul 2026", lote: "H-032", cajas: 25, uds: 4450, merma: 30, est: "confirmado" },
                    { fecha: "19 Jul 2026", lote: "H-033", cajas: 24, uds: 4290, merma: 30, est: "confirmado" },
                  ].map((r, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-3 text-sm">{r.fecha}</td>
                      <td className="p-3 font-medium">{r.lote}</td>
                      <td className="p-3">~{r.cajas}</td>
                      <td className="p-3">{r.uds.toLocaleString()}</td>
                      <td className="p-3 text-amber-600">{r.merma}</td>
                      <td className="p-3"><Badge variant={r.est === "confirmado" ? "default" : "secondary"}>{r.est}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}

      {tab === "inventario" && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inventario Acumulado de Packing</CardTitle>
                <Badge variant="outline">Actualizado: 20 Jul 2026 16:30</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="p-3 font-medium">Categoría</th><th className="p-3 font-medium">Stock Cajas</th>
                    <th className="p-3 font-medium">Stock Unidades</th><th className="p-3 font-medium">Formato</th>
                    <th className="p-3 font-medium">Entradas Hoy</th><th className="p-3 font-medium">Salidas Hoy</th><th className="p-3 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: "Super", cajas: 320, uds: 32000, fmt: "100 uds", entradas: 0, salidas: 0 },
                    { cat: "Extra", cajas: 280, uds: 50400, fmt: "180 uds", entradas: 0, salidas: 0 },
                    { cat: "Primera", cajas: 150, uds: 27000, fmt: "180 uds", entradas: 0, salidas: 0 },
                    { cat: "Jumbo", cajas: 85, uds: 15300, fmt: "180 uds", entradas: 0, salidas: 0 },
                    { cat: "Segunda", cajas: 45, uds: 8100, fmt: "180 uds", entradas: 0, salidas: 0 },
                    { cat: "Tercera", cajas: 20, uds: 3600, fmt: "180 uds", entradas: 0, salidas: 0 },
                  ].map((item, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-3 font-medium">{item.cat}</td>
                      <td className="p-3">{item.cajas.toLocaleString()}</td>
                      <td className="p-3">{item.uds.toLocaleString()}</td>
                      <td className="p-3 text-sm text-muted-foreground">{item.fmt}</td>
                      <td className="p-3 text-green-700">++</td>
                      <td className="p-3 text-red-600">--</td>
                      <td className="p-3 font-medium">Disponible</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground text-center p-4 bg-muted rounded-lg">
            <p>Entradas y salidas del día se actualizan automáticamente al confirmar packing o registrar despachos.</p>
          </div>
        </>
      )}
    </div>
  )
}
