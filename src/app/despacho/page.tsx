"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createDespachoSchema } from "@/lib/validations/despacho"
import { z } from "zod"

const CATEGORY_LABELS: Record<string, string> = {
  jumbo_xxl: "Jumbo XXL",
  jumbo: "Jumbo",
  super: "Súper",
  extra: "Extra",
  primera: "Primera",
  segunda: "Segunda",
  tercera: "Tercera",
  descarte_x: "Descarte X",
  trizados: "Trizados",
}

type Formato = { categoria: string; unidadesPorCaja: number; activo: boolean }
type Stock = { categoria: string; stockCajas: number; stockUnidades: number }
type DetalleItem = { categoria: string; cantidadCajas: number }
type BalanceItem = { categoria: string; apertura: number; entradas: number; salidas: number; cierre: number; diferencia: number }
type DespachoItem = {
  id: string
  fecha: string
  horaSalida: string
  chofer: string
  destino: string
  numeroGuia?: string | null
  detalle: { categoria: string; cantidadCajas: number; cantidadUnidades?: number | null }[]
}

export default function DespachoPage() {
  const [tab, setTab] = useState<"registro" | "historial" | "balance">("registro")
  const [formatos, setFormatos] = useState<Formato[]>([])
  const [inventario, setInventario] = useState<Stock[]>([])
  const [despachos, setDespachos] = useState<DespachoItem[]>([])
  const [balance, setBalance] = useState<BalanceItem[]>([])
  const [detalle, setDetalle] = useState<DetalleItem[]>([])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createDespachoSchema),
  })

  useEffect(() => {
    Promise.all([
      fetch("/api/packing/formato-cajas?limit=100").then(r => r.json()),
      fetch("/api/packing/inventario?limit=100").then(r => r.json()),
    ]).then(([fmt, inv]) => {
      const activos: Formato[] = (fmt.data || []).filter((f: Formato) => f.activo)
      setFormatos(activos)
      setDetalle(activos.map(f => ({ categoria: f.categoria, cantidadCajas: 0 })))
      setInventario(inv.data || [])
    }).catch(() => toast.error("Error al cargar datos"))
  }, [])

  async function loadInventario() {
    try {
      const res = await fetch("/api/packing/inventario?limit=100")
      const json = await res.json()
      setInventario(json.data || [])
    } catch {
      toast.error("Error al cargar inventario")
    }
  }

  function uds(categoria: string) {
    return formatos.find(f => f.categoria === categoria)?.unidadesPorCaja ?? 100
  }

  function stock(categoria: string) {
    return inventario.find(i => i.categoria === categoria)?.stockCajas ?? 0
  }

  function updateCajas(categoria: string, value: string) {
    setDetalle(prev => prev.map(d =>
      d.categoria === categoria ? { ...d, cantidadCajas: parseInt(value) || 0 } : d
    ))
  }

  async function onSubmit(data: z.infer<typeof createDespachoSchema>) {
    const detalleValido = detalle.filter(d => d.cantidadCajas > 0)
    if (detalleValido.length === 0) {
      toast.error("Debe agregar al menos un producto con cajas > 0")
      return
    }
    const sinStock = detalleValido.find(d => d.cantidadCajas > stock(d.categoria))
    if (sinStock) {
      toast.error(`Stock insuficiente para ${CATEGORY_LABELS[sinStock.categoria] || sinStock.categoria}`)
      return
    }

    const body = {
      ...data,
      fecha: data.fecha || new Date().toISOString().split("T")[0],
      detalle: detalleValido,
    }

    const res = await fetch("/api/despacho/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Error al registrar despacho")
      return
    }

    toast.success("Despacho registrado correctamente")
    setDetalle(prev => prev.map(d => ({ ...d, cantidadCajas: 0 })))
    await loadInventario()
  }

  useEffect(() => {
    if (tab === "historial") {
      let cancelled = false
      fetch("/api/despacho/registro?limit=100")
        .then(r => r.json())
        .then(json => { if (!cancelled) setDespachos(json.data || []) })
        .catch(() => toast.error("Error al cargar historial"))
      return () => { cancelled = true }
    }
    if (tab === "balance") {
      let cancelled = false
      fetch("/api/despacho/balance-diario")
        .then(r => r.json())
        .then(json => { if (!cancelled) setBalance(json.items || []) })
        .catch(() => toast.error("Error al cargar balance"))
      return () => { cancelled = true }
    }
  }, [tab])

  function fmtFecha(f: string) {
    const d = new Date(f)
    return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })
  }

  function fmtHora(h: string) {
    const d = new Date(h)
    return d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Despacho y Salidas de Packing</h1>
        <p className="text-muted-foreground text-sm">Registro de guías de despacho con descuento automático de inventario</p>
      </div>

      <div className="flex gap-2 border-b pb-2">
        <button type="button" onClick={() => setTab("registro")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "registro" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Nuevo Despacho</button>
        <button type="button" onClick={() => setTab("historial")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "historial" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Historial</button>
        <button type="button" onClick={() => setTab("balance")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "balance" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Balance Diario</button>
      </div>

      {tab === "registro" && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-6">
            <Card className="col-span-2">
              <CardHeader><CardTitle>Registrar Despacho</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="chofer" className="text-sm font-medium">Chofer / Quién retira <span className="text-red-500">*</span></label>
                    <Input id="chofer" placeholder="Nombre completo" className="mt-1" {...register("chofer")} />
                    {errors.chofer && <p className="text-sm text-red-600 mt-1">{errors.chofer.message as string}</p>}
                  </div>
                  <div>
                    <label htmlFor="destino" className="text-sm font-medium">Destino <span className="text-red-500">*</span></label>
                    <Input id="destino" placeholder="Ej: Supermercado XYZ — Bodega Central" className="mt-1" {...register("destino")} />
                    {errors.destino && <p className="text-sm text-red-600 mt-1">{errors.destino.message as string}</p>}
                  </div>
                  <div>
                    <label htmlFor="numeroGuia" className="text-sm font-medium">N° Guía</label>
                    <Input id="numeroGuia" placeholder="Ej: GD-2026-07-20-003" className="mt-1" {...register("numeroGuia")} />
                    {errors.numeroGuia && <p className="text-sm text-red-600 mt-1">{errors.numeroGuia.message as string}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="vehiculoPatente" className="text-sm font-medium">Vehículo / Patente</label>
                    <Input id="vehiculoPatente" placeholder="Ej: ABC-123" className="mt-1" {...register("vehiculoPatente")} />
                    {errors.vehiculoPatente && <p className="text-sm text-red-600 mt-1">{errors.vehiculoPatente.message as string}</p>}
                  </div>
                  <div>
                    <label htmlFor="fecha" className="text-sm font-medium">Fecha de Salida</label>
                    <Input id="fecha" type="date" className="mt-1" {...register("fecha")} />
                    {errors.fecha && <p className="text-sm text-red-600 mt-1">{errors.fecha.message as string}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader><CardTitle>Productos a Despachar</CardTitle></CardHeader>
              <CardContent>
                <table className="w-full mb-4">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="p-2 font-medium">Categoría</th>
                      <th className="p-2 font-medium">Stock Disponible</th>
                      <th className="p-2 font-medium">Cajas a Despachar</th>
                      <th className="p-2 font-medium">Unidades</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalle.map((item) => (
                      <tr key={item.categoria} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="p-2 font-medium">{CATEGORY_LABELS[item.categoria] || item.categoria}</td>
                        <td className="p-2">{stock(item.categoria)} cajas ({(stock(item.categoria) * uds(item.categoria)).toLocaleString()} uds)</td>
                        <td className="p-2">
                          <Input
                            type="number"
                            placeholder="0"
                            className="w-24"
                            value={item.cantidadCajas || ""}
                            onChange={(e) => updateCajas(item.categoria, e.target.value)}
                          />
                        </td>
                        <td className="p-2 text-sm text-muted-foreground">
                          {(item.cantidadCajas * uds(item.categoria)).toLocaleString()} uds
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-xs text-muted-foreground">
                  Las unidades se calculan automáticamente según el formato real de cada categoría.
                  Al confirmar, el stock se descuenta automáticamente del inventario de packing.
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <label htmlFor="observaciones" className="sr-only">Observaciones</label>
                  <textarea id="observaciones" className="flex-1 rounded-md border p-2 text-sm bg-background" rows={2} placeholder="Observaciones (opcional)" {...register("observaciones")} />
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Registrar Despacho y Descontar Stock"}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      )}

      {tab === "historial" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historial de Despachos</CardTitle>
              <Badge variant="outline">{despachos.length} registros</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Hora</th><th className="p-3 font-medium">Chofer</th>
                  <th className="p-3 font-medium">Destino</th><th className="p-3 font-medium">N° Guía</th><th className="p-3 font-medium">Cajas</th><th className="p-3 font-medium">Unidades</th>
                </tr>
              </thead>
              <tbody>
                {despachos.map((d) => (
                  <tr key={d.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 text-sm">{fmtFecha(d.fecha)}</td>
                    <td className="p-3 text-sm">{fmtHora(d.horaSalida)}</td>
                    <td className="p-3 font-medium">{d.chofer}</td>
                    <td className="p-3 text-sm max-w-[220px] truncate" title={d.destino}>{d.destino}</td>
                    <td className="p-3 font-mono text-xs">{d.numeroGuia || "—"}</td>
                    <td className="p-3">{d.detalle.reduce((s, x) => s + x.cantidadCajas, 0)}</td>
                    <td className="p-3">{d.detalle.reduce((s, x) => s + (x.cantidadUnidades || 0), 0).toLocaleString()}</td>
                  </tr>
                ))}
                {despachos.length === 0 && (
                  <tr><td colSpan={7} className="p-6 text-center text-sm text-muted-foreground">Sin despachos registrados</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {tab === "balance" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Balance Diario</CardTitle>
              <Badge variant="outline">Entradas vs Salidas</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-3 font-medium">Categoría</th>
                  <th className="p-3 font-medium">Stock Apertura</th>
                  <th className="p-3 font-medium">Entradas (Packing)</th>
                  <th className="p-3 font-medium">Salidas (Despacho)</th>
                  <th className="p-3 font-medium">Stock Cierre</th>
                  <th className="p-3 font-medium">Diferencia</th>
                </tr>
              </thead>
              <tbody>
                {balance.map((item) => (
                  <tr key={item.categoria} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 font-medium">{CATEGORY_LABELS[item.categoria] || item.categoria}</td>
                    <td className="p-3">{item.apertura} cajas</td>
                    <td className="p-3 text-green-700">+{item.entradas}</td>
                    <td className="p-3 text-red-600">-{item.salidas}</td>
                    <td className="p-3 font-medium">{item.cierre} cajas</td>
                    <td className="p-3">{item.diferencia >= 0 ? `+${item.diferencia}` : item.diferencia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
