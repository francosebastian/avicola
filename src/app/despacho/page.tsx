"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createDespachoSchema } from "@/lib/validations/despacho"

const formatos: Record<string, number> = {
  Jumbo: 180, Super: 100, Extra: 180,
  Primera: 180, Segunda: 180, Tercera: 180,
}

const categorias = ["Jumbo", "Super", "Extra", "Primera", "Segunda", "Tercera"]

const despachos = [
  { fecha: "20 Jul 2026", hora: "10:30", chofer: "Luis González", destino: "Supermercado XYZ — Bodega Central", guia: "GD-2026-07-20-001", items: [{cat:"Super", cajas:50}, {cat:"Extra", cajas:80}, {cat:"Primera", cajas:30}], totalCajas: 160, est: "despachado" },
  { fecha: "20 Jul 2026", hora: "14:00", chofer: "Pedro Ramírez", destino: "Distribuidora ABC — Renca", guia: "GD-2026-07-20-002", items: [{cat:"Jumbo", cajas:20}, {cat:"Extra", cajas:60}], totalCajas: 80, est: "despachado" },
  { fecha: "19 Jul 2026", hora: "09:00", chofer: "Mario Soto", destino: "Hotel Gourmet S.A. — Vitacura", guia: "GD-2026-07-19-001", items: [{cat:"Super", cajas:30}, {cat:"Primera", cajas:20}], totalCajas: 50, est: "despachado" },
  { fecha: "19 Jul 2026", hora: "16:30", chofer: "Luis González", destino: "Supermercado XYZ — Bodega Norte", guia: "GD-2026-07-19-002", items: [{cat:"Extra", cajas:100}], totalCajas: 100, est: "despachado" },
]

type DetalleItem = { categoria: string; cantidadCajas: number }

export default function DespachoPage() {
  const router = useRouter()
  const [tab, setTab] = useState<"registro" | "historial" | "balance">("registro")
  const [detalle, setDetalle] = useState<DetalleItem[]>(categorias.map(c => ({ categoria: c, cantidadCajas: 0 })))

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createDespachoSchema),
  })

  function updateCajas(categoria: string, value: string) {
    setDetalle(prev => prev.map(d =>
      d.categoria === categoria ? { ...d, cantidadCajas: parseInt(value) || 0 } : d
    ))
  }

  async function onSubmit(data: any) {
    const detalleValido = detalle.filter(d => d.cantidadCajas > 0)
    if (detalleValido.length === 0) {
      toast.error("Debe agregar al menos un producto con cajas > 0")
      return
    }

    const body = {
      ...data,
      detalle: detalleValido.map(d => ({
        categoria: d.categoria,
        cantidadCajas: d.cantidadCajas,
      })),
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
    router.refresh()
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
                    {detalle.map((item) => {
                      const stock = { Jumbo: 85, Super: 320, Extra: 280, Primera: 150, Segunda: 45, Tercera: 20 }[item.categoria] || 0
                      return (
                        <tr key={item.categoria} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="p-2 font-medium">{item.categoria}</td>
                          <td className="p-2">{stock} cajas ({(stock * formatos[item.categoria]).toLocaleString()} uds)</td>
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
                            {(item.cantidadCajas * formatos[item.categoria]).toLocaleString()} uds
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div className="text-xs text-muted-foreground">
                  Las unidades se calculan automáticamente según el formato de cada categoría (Super: 100 uds/caja, Extra/Primera: 180 uds/caja).
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
                  <th className="p-3 font-medium">Destino</th><th className="p-3 font-medium">N° Guía</th><th className="p-3 font-medium">Cajas</th><th className="p-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {despachos.map((d, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 text-sm">{d.fecha}</td>
                    <td className="p-3 text-sm">{d.hora}</td>
                    <td className="p-3 font-medium">{d.chofer}</td>
                    <td className="p-3 text-sm max-w-[200px] truncate" title={d.destino}>{d.destino}</td>
                    <td className="p-3 font-mono text-xs">{d.guia}</td>
                    <td className="p-3">{d.totalCajas}</td>
                    <td className="p-3"><Button type="button" variant="ghost" size="sm">Ver</Button></td>
                  </tr>
                ))}
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
                {[
                  { cat: "Super", apertura: 320, entradas: 36, salidas: 50, cierre: 306 },
                  { cat: "Extra", apertura: 280, entradas: 25, salidas: 140, cierre: 165 },
                  { cat: "Primera", apertura: 150, entradas: 12, salidas: 30, cierre: 132 },
                  { cat: "Jumbo", apertura: 85, entradas: 8, salidas: 20, cierre: 73 },
                  { cat: "Segunda", apertura: 45, entradas: 3, salidas: 0, cierre: 48 },
                  { cat: "Tercera", apertura: 20, entradas: 1, salidas: 0, cierre: 21 },
                ].map((item, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.cat}</td>
                    <td className="p-3">{item.apertura} cajas</td>
                    <td className="p-3 text-green-700">+{item.entradas}</td>
                    <td className="p-3 text-red-600">-{item.salidas}</td>
                    <td className="p-3 font-medium">{item.cierre} cajas</td>
                    <td className="p-3">{item.cierre - item.apertura >= 0 ? `+${item.cierre - item.apertura}` : item.cierre - item.apertura}</td>
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
