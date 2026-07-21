"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const insumos = [
  { tipo: "Maíz", stock: 12500, minimo: 2000, unidad: "kg" },
  { tipo: "Soya", stock: 8500, minimo: 1500, unidad: "kg" },
  { tipo: "Conchuela", stock: 3200, minimo: 800, unidad: "kg" },
  { tipo: "Vitaminas", stock: 450, minimo: 100, unidad: "kg" },
  { tipo: "Harinilla", stock: 6200, minimo: 1000, unidad: "kg" },
  { tipo: "Calcio", stock: 2800, minimo: 500, unidad: "kg" },
  { tipo: "Minerales", stock: 380, minimo: 100, unidad: "kg" },
]

export default function FabricaAlimentoPage() {
  const [tab, setTab] = useState<"recepcion" | "stock" | "fabricacion">("recepcion")
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fábrica de Alimentos y Traza de Insumos</h1>
        <p className="text-muted-foreground text-sm">Recepción de materia prima, stock de insumos y fabricación con descuento automático</p>
      </div>

      <div className="flex gap-2 border-b pb-2">
        <button onClick={() => setTab("recepcion")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "recepcion" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Recepción de Insumos</button>
        <button onClick={() => setTab("stock")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "stock" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Stock de Insumos</button>
        <button onClick={() => setTab("fabricacion")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "fabricacion" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Fabricación de Alimento</button>
      </div>

      {tab === "recepcion" && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Registrar Recepción de Insumos</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Fecha de Llegada</label>
                  <Input type="date" defaultValue="2026-07-20" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Proveedor</label>
                  <Input defaultValue="NutriAVES S.A." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Vehículo</label>
                  <Input defaultValue="Camión Mercedes Benz 1721" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Patente</label>
                  <Input defaultValue="ABC-123" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo de Insumo</label>
                  <select className="w-full mt-1 rounded-md border p-2 text-sm bg-background">
                    <option>Maíz</option>
                    <option>Soya</option>
                    <option>Conchuela</option>
                    <option>Vitaminas</option>
                    <option>Harinilla</option>
                    <option>Calcio</option>
                    <option>Minerales</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Cantidad (kg)</label>
                  <Input type="number" defaultValue={5000} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">N° Lote <span className="text-red-500">*</span></label>
                  <Input defaultValue="L-2026-07-20-001" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">N° Guía <span className="text-red-500">*</span></label>
                  <Input defaultValue="GD-4581-2026" className="mt-1" />
                </div>
                <div className="flex items-end">
                  <Button className="w-full">Registrar Recepción</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Historial de Recepciones</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Proveedor</th><th className="p-3 font-medium">Insumo</th>
                    <th className="p-3 font-medium">Kg</th><th className="p-3 font-medium">N° Lote</th><th className="p-3 font-medium">N° Guía</th><th className="p-3 font-medium">Vehículo</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { fecha: "20 Jul 2026", prov: "NutriAVES S.A.", insumo: "Maíz", kg: 15000, lote: "L-2026-07-20-001", guia: "GD-4581-2026", veh: "ABC-123" },
                    { fecha: "19 Jul 2026", prov: "AgroSoya Ltda.", insumo: "Soya", kg: 10000, lote: "L-2026-07-19-002", guia: "GD-4572-2026", veh: "DEF-456" },
                    { fecha: "18 Jul 2026", prov: "Minerales del Sur", insumo: "Conchuela", kg: 5000, lote: "L-2026-07-18-003", guia: "GD-4560-2026", veh: "GHI-789" },
                    { fecha: "16 Jul 2026", prov: "Vitafeed S.A.", insumo: "Vitaminas", kg: 500, lote: "L-2026-07-16-004", guia: "GD-4540-2026", veh: "JKL-012" },
                  ].map((r, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-3 text-sm">{r.fecha}</td>
                      <td className="p-3 text-sm">{r.prov}</td>
                      <td className="p-3"><Badge variant="secondary">{r.insumo}</Badge></td>
                      <td className="p-3">{r.kg.toLocaleString()}</td>
                      <td className="p-3 font-mono text-xs">{r.lote}</td>
                      <td className="p-3 font-mono text-xs">{r.guia}</td>
                      <td className="p-3 text-sm">{r.veh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "stock" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Stock Actual de Insumos</CardTitle>
              <Badge variant="outline" className="text-amber-600">{insumos.filter(i => i.stock <= i.minimo).length} insumos bajo mínimo</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-3 font-medium">Insumo</th><th className="p-3 font-medium">Stock Actual</th>
                  <th className="p-3 font-medium">Stock Mínimo</th><th className="p-3 font-medium">Diferencia</th><th className="p-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {insumos.map((ins, i) => {
                  const diff = ins.stock - ins.minimo
                  return (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-3 font-medium">{ins.tipo}</td>
                      <td className="p-3">{ins.stock.toLocaleString()} {ins.unidad}</td>
                      <td className="p-3">{ins.minimo.toLocaleString()} {ins.unidad}</td>
                      <td className="p-3">{diff >= 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()}</td>
                      <td className="p-3">
                        {diff <= 0 ? (
                          <Badge variant="destructive">Stock Bajo</Badge>
                        ) : diff < ins.minimo * 0.5 ? (
                          <Badge variant="secondary">Por Reponer</Badge>
                        ) : (
                          <Badge variant="default">OK</Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {tab === "fabricacion" && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Registrar Fabricación de Alimento</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Fórmula</label>
                  <select className="w-full mt-1 rounded-md border p-2 text-sm bg-background">
                    <option>Postura Fase 1 — Hy-Line Brown</option>
                    <option>Postura Fase 2 — Hy-Line Brown</option>
                    <option>Recría — Lohmann LSL</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Cantidad a Producir (kg)</label>
                  <Input type="number" defaultValue={20000} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">N° Lote Fabricación</label>
                  <Input defaultValue="FAB-2026-07-20-001" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Destino (Galpón)</label>
                  <select className="w-full mt-1 rounded-md border p-2 text-sm bg-background">
                    <option>Galpón 1</option>
                    <option>Galpón 2</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Destino (Sección)</label>
                  <select className="w-full mt-1 rounded-md border p-2 text-sm bg-background">
                    <option>Fila A</option>
                    <option>Fila B</option>
                    <option>Fila C</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">Fabricar y Descontar Stock</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vista Previa — Descuento Automático</CardTitle>
                <Badge>Fórmula: Postura Fase 1</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Para producir <strong>20,000 kg</strong> de alimento Postura Fase 1, se descontarán los siguientes insumos:
              </p>
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="p-3 font-medium">Insumo</th><th className="p-3 font-medium">% en Fórmula</th>
                    <th className="p-3 font-medium">Kg Requeridos</th><th className="p-3 font-medium">Stock Actual</th><th className="p-3 font-medium">Stock Final</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { insumo: "Maíz", pct: 62.5, req: 12500, stock: 12500 },
                    { insumo: "Soya", pct: 22.0, req: 4400, stock: 8500 },
                    { insumo: "Conchuela", pct: 8.5, req: 1700, stock: 3200 },
                    { insumo: "Vitaminas", pct: 0.5, req: 100, stock: 450 },
                    { insumo: "Minerales", pct: 1.5, req: 300, stock: 380 },
                    { insumo: "Calcio", pct: 5.0, req: 1000, stock: 2800 },
                  ].map((d, i) => {
                    const final = d.stock - d.req
                    const bajo = final <= 0
                    return (
                      <tr key={i} className={`border-b last:border-0 hover:bg-muted/50 ${bajo ? "bg-red-50" : ""}`}>
                        <td className="p-3 font-medium">{d.insumo}</td>
                        <td className="p-3">{d.pct}%</td>
                        <td className="p-3">{d.req.toLocaleString()} kg</td>
                        <td className="p-3">{d.stock.toLocaleString()} kg</td>
                        <td className={`p-3 font-medium ${bajo ? "text-red-600" : "text-green-700"}`}>
                          {bajo ? `¡Faltan ${Math.abs(final)} kg!` : `${final.toLocaleString()} kg`}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Historial de Fabricación</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Lote Fabricación</th><th className="p-3 font-medium">Fórmula</th>
                    <th className="p-3 font-medium">Kg</th><th className="p-3 font-medium">Destino</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { fecha: "20 Jul 2026", lote: "FAB-2026-07-20-001", formula: "Postura Fase 1", kg: 20000, destino: "Galpón 1 — Fila A" },
                    { fecha: "19 Jul 2026", lote: "FAB-2026-07-19-002", formula: "Postura Fase 1", kg: 15000, destino: "Galpón 1 — Fila B" },
                    { fecha: "19 Jul 2026", lote: "FAB-2026-07-19-003", formula: "Recría", kg: 8000, destino: "Galpón 2 — Ala Norte" },
                    { fecha: "18 Jul 2026", lote: "FAB-2026-07-18-004", formula: "Postura Fase 2", kg: 20000, destino: "Galpón 2 — Ala Sur" },
                  ].map((f, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-3 text-sm">{f.fecha}</td>
                      <td className="p-3 font-mono text-xs">{f.lote}</td>
                      <td className="p-3">{f.formula}</td>
                      <td className="p-3">{f.kg.toLocaleString()}</td>
                      <td className="p-3 text-sm">{f.destino}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
