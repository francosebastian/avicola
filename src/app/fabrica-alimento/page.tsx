"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createRecepcionInsumoSchema, createFabricacionAlimentoSchema } from "@/lib/validations/alimentacion"

type StockItem = { tipo: string; stock: number; minimo: number; unidad: string }

export default function FabricaAlimentoPage() {
  const router = useRouter()
  const [tab, setTab] = useState<"recepcion" | "stock" | "fabricacion">("recepcion")
  const [stock, setStock] = useState<StockItem[]>([])

  const recepcionForm = useForm({ resolver: zodResolver(createRecepcionInsumoSchema) })
  const fabricacionForm = useForm({ resolver: zodResolver(createFabricacionAlimentoSchema) })

  useEffect(() => {
    if (tab === "stock") {
      fetch("/api/fabrica/stock")
        .then(r => r.json())
        .then(data => setStock(data.data || data || []))
        .catch(() => toast.error("Error al cargar stock"))
    }
  }, [tab])

  async function onSubmitRecepcion(data: any) {
    const body = { ...data, cantidadKg: Number(data.cantidadKg) }

    const res = await fetch("/api/fabrica/recepcion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Error al registrar recepción")
      return
    }

    toast.success("Recepción registrada correctamente")
    recepcionForm.reset()
    router.refresh()
  }

  async function onSubmitFabricacion(data: any) {
    const body = { ...data, cantidadProducidaKg: Number(data.cantidadProducidaKg) }

    const res = await fetch("/api/fabrica/fabricacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Error al registrar fabricación")
      return
    }

    toast.success("Fabricación registrada correctamente")
    fabricacionForm.reset()
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fábrica de Alimentos y Traza de Insumos</h1>
        <p className="text-muted-foreground text-sm">Recepción de materia prima, stock de insumos y fabricación con descuento automático</p>
      </div>

      <div className="flex gap-2 border-b pb-2">
        <button type="button" onClick={() => setTab("recepcion")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "recepcion" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Recepción de Insumos</button>
        <button type="button" onClick={() => setTab("stock")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "stock" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Stock de Insumos</button>
        <button type="button" onClick={() => setTab("fabricacion")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "fabricacion" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Fabricación de Alimento</button>
      </div>

      {tab === "recepcion" && (
        <form onSubmit={recepcionForm.handleSubmit(onSubmitRecepcion)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Registrar Recepción de Insumos</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="fechaLlegada" className="text-sm font-medium">Fecha de Llegada</label>
                  <Input id="fechaLlegada" type="date" className="mt-1" {...recepcionForm.register("fechaLlegada")} />
                  {recepcionForm.formState.errors.fechaLlegada && <p className="text-sm text-red-600 mt-1">{recepcionForm.formState.errors.fechaLlegada.message as string}</p>}
                </div>
                <div>
                  <label htmlFor="proveedor" className="text-sm font-medium">Proveedor</label>
                  <Input id="proveedor" className="mt-1" {...recepcionForm.register("proveedor")} />
                  {recepcionForm.formState.errors.proveedor && <p className="text-sm text-red-600 mt-1">{recepcionForm.formState.errors.proveedor.message as string}</p>}
                </div>
                <div>
                  <label htmlFor="vehiculo" className="text-sm font-medium">Vehículo</label>
                  <Input id="vehiculo" className="mt-1" {...recepcionForm.register("vehiculo")} />
                </div>
                <div>
                  <label htmlFor="patente" className="text-sm font-medium">Patente</label>
                  <Input id="patente" className="mt-1" {...recepcionForm.register("patente")} />
                </div>
                <div>
                  <label htmlFor="tipoInsumo" className="text-sm font-medium">Tipo de Insumo</label>
                  <select id="tipoInsumo" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" {...recepcionForm.register("tipoInsumo")}>
                    <option value="">Seleccionar...</option>
                    <option value="Maíz">Maíz</option>
                    <option value="Soya">Soya</option>
                    <option value="Conchuela">Conchuela</option>
                    <option value="Vitaminas">Vitaminas</option>
                    <option value="Harinilla">Harinilla</option>
                    <option value="Calcio">Calcio</option>
                    <option value="Minerales">Minerales</option>
                  </select>
                  {recepcionForm.formState.errors.tipoInsumo && <p className="text-sm text-red-600 mt-1">{recepcionForm.formState.errors.tipoInsumo.message as string}</p>}
                </div>
                <div>
                  <label htmlFor="cantidadKg" className="text-sm font-medium">Cantidad (kg)</label>
                  <Input id="cantidadKg" type="number" className="mt-1" {...recepcionForm.register("cantidadKg", { valueAsNumber: true })} />
                  {recepcionForm.formState.errors.cantidadKg && <p className="text-sm text-red-600 mt-1">{recepcionForm.formState.errors.cantidadKg.message as string}</p>}
                </div>
                <div>
                  <label htmlFor="numeroLote" className="text-sm font-medium">N° Lote <span className="text-red-500">*</span></label>
                  <Input id="numeroLote" className="mt-1" {...recepcionForm.register("numeroLote")} />
                  {recepcionForm.formState.errors.numeroLote && <p className="text-sm text-red-600 mt-1">{recepcionForm.formState.errors.numeroLote.message as string}</p>}
                </div>
                <div>
                  <label htmlFor="numeroGuia" className="text-sm font-medium">N° Guía <span className="text-red-500">*</span></label>
                  <Input id="numeroGuia" className="mt-1" {...recepcionForm.register("numeroGuia")} />
                  {recepcionForm.formState.errors.numeroGuia && <p className="text-sm text-red-600 mt-1">{recepcionForm.formState.errors.numeroGuia.message as string}</p>}
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={recepcionForm.formState.isSubmitting} className="w-full">
                    {recepcionForm.formState.isSubmitting ? "Guardando..." : "Registrar Recepción"}
                  </Button>
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
        </form>
      )}

      {tab === "stock" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Stock Actual de Insumos</CardTitle>
              <Badge variant="outline" className="text-amber-600">
                {stock.filter(i => i.stock <= i.minimo).length} insumos bajo mínimo
              </Badge>
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
                {stock.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Cargando stock...</td></tr>
                ) : stock.map((ins, i) => {
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
        <form onSubmit={fabricacionForm.handleSubmit(onSubmitFabricacion)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Registrar Fabricación de Alimento</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="formulaId" className="text-sm font-medium">Fórmula</label>
                  <select id="formulaId" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" {...fabricacionForm.register("formulaId")}>
                    <option value="">Seleccionar...</option>
                    <option value="1">Postura Fase 1 — Hy-Line Brown</option>
                    <option value="2">Postura Fase 2 — Hy-Line Brown</option>
                    <option value="3">Recría — Lohmann LSL</option>
                  </select>
                  {fabricacionForm.formState.errors.formulaId && <p className="text-sm text-red-600 mt-1">{fabricacionForm.formState.errors.formulaId.message as string}</p>}
                </div>
                <div>
                  <label htmlFor="cantidadProducidaKg" className="text-sm font-medium">Cantidad a Producir (kg)</label>
                  <Input id="cantidadProducidaKg" type="number" className="mt-1" {...fabricacionForm.register("cantidadProducidaKg", { valueAsNumber: true })} />
                  {fabricacionForm.formState.errors.cantidadProducidaKg && <p className="text-sm text-red-600 mt-1">{fabricacionForm.formState.errors.cantidadProducidaKg.message as string}</p>}
                </div>
                <div>
                  <label htmlFor="loteFabricacion" className="text-sm font-medium">N° Lote Fabricación</label>
                  <Input id="loteFabricacion" className="mt-1" {...fabricacionForm.register("loteFabricacion")} />
                  {fabricacionForm.formState.errors.loteFabricacion && <p className="text-sm text-red-600 mt-1">{fabricacionForm.formState.errors.loteFabricacion.message as string}</p>}
                </div>
                <div>
                  <label htmlFor="fecha" className="text-sm font-medium">Fecha</label>
                  <Input id="fecha" type="date" className="mt-1" {...fabricacionForm.register("fecha")} />
                  {fabricacionForm.formState.errors.fecha && <p className="text-sm text-red-600 mt-1">{fabricacionForm.formState.errors.fecha.message as string}</p>}
                </div>
                <div>
                  <label htmlFor="destinoGalponId" className="text-sm font-medium">Destino (Galpón)</label>
                  <select id="destinoGalponId" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" {...fabricacionForm.register("destinoGalponId")}>
                    <option value="">Seleccionar...</option>
                    <option value="1">Galpón 1</option>
                    <option value="2">Galpón 2</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="destinoSeccionId" className="text-sm font-medium">Destino (Sección)</label>
                  <select id="destinoSeccionId" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" {...fabricacionForm.register("destinoSeccionId")}>
                    <option value="">Seleccionar...</option>
                    <option value="1">Fila A</option>
                    <option value="2">Fila B</option>
                    <option value="3">Fila C</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={fabricacionForm.formState.isSubmitting} className="w-full">
                    {fabricacionForm.formState.isSubmitting ? "Guardando..." : "Fabricar y Descontar Stock"}
                  </Button>
                </div>
              </div>
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
        </form>
      )}
    </div>
  )
}
