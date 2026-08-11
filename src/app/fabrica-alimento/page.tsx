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
import { z } from "zod"

type RecepcionForm = z.infer<typeof createRecepcionInsumoSchema>
type FabricacionForm = z.infer<typeof createFabricacionAlimentoSchema>

const INSUMOS = [
  "Maíz", "Soya", "Conchuela", "Nutrameal", "Harinilla", "Núcleo Ponedora", "Núcleo Pollita",
  "Fosfato Bicálcico", "Sal", "Lisina", "Metionina", "Monsigran", "Biomin", "Mycofix",
]

const DESTINOS = [
  {
    id: "galpon-1",
    nombre: "Galpón 1",
    silos: [
      { id: "silo-1", nombre: "Silo 1 (A)" },
      { id: "silo-2", nombre: "Silo 2 (B)" },
    ],
  },
  {
    id: "galpon-2",
    nombre: "Galpón 2",
    silos: [
      { id: "silo-1", nombre: "Silo 1 (A)" },
      { id: "silo-2", nombre: "Silo 2 (B)" },
    ],
  },
  {
    id: "recria",
    nombre: "Recría",
    silos: [
      { id: "silo-1", nombre: "Silo 1 (A)" },
      { id: "silo-2", nombre: "Silo 2 (B)" },
    ],
  },
]

type StockItem = { tipo: string; stock: number; minimo: number; unidad: string }
type RecepcionRow = { id: string; fechaLlegada: string; proveedor: string; tipoInsumo: string; cantidadKg: number; numeroLote: string; numeroGuia: string; vehiculo: string | null }
type FabricacionRow = { id: string; fecha: string; formulaId: string; cantidadProducidaKg: number; loteFabricacion: string; destino: string | null }

export default function FabricaAlimentoPage() {
  const router = useRouter()
  const [tab, setTab] = useState<"recepcion" | "stock" | "fabricacion">("recepcion")
  const [stock, setStock] = useState<StockItem[]>([])
  const [formulas, setFormulas] = useState<{ id: string; nombre: string }[]>([])
  const [recepciones, setRecepciones] = useState<RecepcionRow[]>([])
  const [fabricaciones, setFabricaciones] = useState<FabricacionRow[]>([])
  const [destinoId, setDestinoId] = useState("")
  const [siloId, setSiloId] = useState("")

  const recepcionForm = useForm({ resolver: zodResolver(createRecepcionInsumoSchema) })
  const fabricacionForm = useForm({ resolver: zodResolver(createFabricacionAlimentoSchema) })

  const destinoSel = DESTINOS.find(d => d.id === destinoId)

  useEffect(() => {
    fetch("/api/alimentacion/formulas?limit=100")
      .then(r => r.json())
      .then(j => setFormulas((j.data || []).filter((f: { activo?: boolean }) => f.activo)))
      .catch(() => toast.error("Error al cargar fórmulas"))
  }, [])

  useEffect(() => {
    if (tab === "recepcion") {
      let cancelled = false
      fetch("/api/fabrica/recepcion?limit=100")
        .then(r => r.json())
        .then(j => { if (!cancelled) setRecepciones((j.data || []) as RecepcionRow[]) })
        .catch(() => toast.error("Error al cargar recepciones"))
      return () => { cancelled = true }
    }
    if (tab === "stock") {
      let cancelled = false
      fetch("/api/fabrica/stock?limit=100")
        .then(r => r.json())
        .then(j => {
          if (!cancelled) {
            const rows = (j.data || j || []) as Array<{ tipoInsumo: string; stockActualKg: number; stockMinimoKg: number }>
            setStock(rows.map(r => ({ tipo: r.tipoInsumo, stock: Number(r.stockActualKg) || 0, minimo: Number(r.stockMinimoKg) || 0, unidad: "kg" })))
          }
        })
        .catch(() => toast.error("Error al cargar stock"))
      return () => { cancelled = true }
    }
    if (tab === "fabricacion") {
      let cancelled = false
      fetch("/api/fabrica/fabricacion?limit=100")
        .then(r => r.json())
        .then(j => { if (!cancelled) setFabricaciones((j.data || []) as FabricacionRow[]) })
        .catch(() => toast.error("Error al cargar fabricaciones"))
      return () => { cancelled = true }
    }
  }, [tab])

  async function onSubmitRecepcion(data: RecepcionForm) {
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
    try {
      const j = await (await fetch("/api/fabrica/recepcion?limit=100")).json()
      setRecepciones((j.data || []) as RecepcionRow[])
    } catch { /* noop */ }
  }

  async function onSubmitFabricacion(data: FabricacionForm) {
    if (!destinoSel || !siloId) {
      toast.error("Seleccione el destino y el silo")
      return
    }
    const siloSel = destinoSel.silos.find(s => s.id === siloId)
    if (!siloSel) {
      toast.error("Seleccione el silo")
      return
    }

    const body = {
      ...data,
      cantidadProducidaKg: Number(data.cantidadProducidaKg),
      destino: `${destinoSel.nombre} -> ${siloSel.nombre}`,
    }

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
    setDestinoId("")
    setSiloId("")
    router.refresh()
    try {
      const j = await (await fetch("/api/fabrica/fabricacion?limit=100")).json()
      setFabricaciones((j.data || []) as FabricacionRow[])
    } catch { /* noop */ }
  }

  function fmtFecha(f: string) {
    const d = new Date(f)
    return isNaN(d.getTime()) ? f : d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })
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
                    {INSUMOS.map(i => <option key={i} value={i}>{i}</option>)}
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
                  {recepciones.map(r => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-3 text-sm">{fmtFecha(r.fechaLlegada)}</td>
                      <td className="p-3 text-sm">{r.proveedor}</td>
                      <td className="p-3"><Badge variant="secondary">{r.tipoInsumo}</Badge></td>
                      <td className="p-3">{Number(r.cantidadKg).toLocaleString()}</td>
                      <td className="p-3 font-mono text-xs">{r.numeroLote}</td>
                      <td className="p-3 font-mono text-xs">{r.numeroGuia}</td>
                      <td className="p-3 text-sm">{r.vehiculo || "—"}</td>
                    </tr>
                  ))}
                  {recepciones.length === 0 && (
                    <tr><td colSpan={7} className="p-6 text-center text-sm text-muted-foreground">Sin recepciones registradas</td></tr>
                  )}
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
                    {formulas.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
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
                  <label htmlFor="destinoId" className="text-sm font-medium">Destino</label>
                  <select
                    id="destinoId"
                    className="w-full mt-1 rounded-md border p-2 text-sm bg-background"
                    value={destinoId}
                    onChange={(e) => { setDestinoId(e.target.value); setSiloId("") }}
                  >
                    <option value="">Seleccionar...</option>
                    {DESTINOS.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="siloId" className="text-sm font-medium">Silo</label>
                  <select
                    id="siloId"
                    className="w-full mt-1 rounded-md border p-2 text-sm bg-background"
                    value={siloId}
                    onChange={(e) => setSiloId(e.target.value)}
                    disabled={!destinoSel}
                  >
                    <option value="">Seleccionar...</option>
                    {(destinoSel?.silos || []).map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
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
                  {fabricaciones.map(f => (
                    <tr key={f.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-3 text-sm">{fmtFecha(f.fecha)}</td>
                      <td className="p-3 font-mono text-xs">{f.loteFabricacion}</td>
                      <td className="p-3">{formulas.find(x => x.id === f.formulaId)?.nombre || f.formulaId}</td>
                      <td className="p-3">{Number(f.cantidadProducidaKg).toLocaleString()}</td>
                      <td className="p-3 text-sm">{f.destino || "—"}</td>
                    </tr>
                  ))}
                  {fabricaciones.length === 0 && (
                    <tr><td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">Sin fabricaciones registradas</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  )
}
