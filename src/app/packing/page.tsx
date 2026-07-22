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
import Link from "next/link"
import { createRegistroPackingSchema } from "@/lib/validations/packing"

type Seccion = { id: string; nombre: string; galpon: { nombre: string } }
type Lote = { id: string; codigoLote: string; lineaGenetica: string }

const formatos: Record<string, { label: string; uds: number }> = {
  jumbo: { label: "Jumbo (≥68g)", uds: 180 },
  super: { label: "Super (65-67g)", uds: 100 },
  extra: { label: "Extra (61-64g)", uds: 180 },
  primera: { label: "Primera (55-60g)", uds: 180 },
  segunda: { label: "Segunda (50-54g)", uds: 180 },
  tercera: { label: "Tercera (<50g)", uds: 180 },
}

export default function PackingPage() {
  const router = useRouter()
  const [tab, setTab] = useState<"registro" | "inventario">("registro")
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [lotes, setLotes] = useState<Lote[]>([])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createRegistroPackingSchema),
  })

  useEffect(() => {
    Promise.all([
      fetch("/api/secciones").then(r => r.json()),
      fetch("/api/lotes").then(r => r.json()),
    ]).then(([secData, lotData]) => {
      setSecciones(secData.data || secData || [])
      setLotes(lotData.data || lotData || [])
    }).catch(() => toast.error("Error al cargar datos"))
  }, [])

  async function onSubmit(data: any) {
    const body: Record<string, unknown> = { ...data }
    for (const key of Object.keys(body)) {
      if (["huevosSucio", "huevosRoto", "huevosDescarte", "cajasJumbo", "cajasSuper", "cajasExtra", "cajasPrimera", "cajasSegunda", "cajasTercera"].includes(key)) {
        body[key] = body[key] === "" ? 0 : Number(body[key])
      }
    }

    const res = await fetch("/api/packing/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Error al guardar registro de packing")
      return
    }

    toast.success("Packing registrado correctamente")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Packing y Clasificación de Huevos</h1>
          <p className="text-muted-foreground text-sm">Registro diario por cajas</p>
        </div>
        <div className="flex gap-2">
          <Link href="/despacho"><Button type="button" variant="outline">Ir a Despachos</Button></Link>
        </div>
      </div>

      <div className="flex gap-2 border-b pb-2">
        <button type="button" onClick={() => setTab("registro")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "registro" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Registro de Packing</button>
        <button type="button" onClick={() => setTab("inventario")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "inventario" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>Inventario Acumulado</button>
      </div>

      {tab === "registro" && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Seleccionar Origen</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="loteId" className="text-sm font-medium">Lote</label>
                    <select id="loteId" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" {...register("loteId")}>
                      <option value="">Seleccionar...</option>
                      {lotes.map(l => (
                        <option key={l.id} value={l.id}>{l.codigoLote} — {l.lineaGenetica}</option>
                      ))}
                    </select>
                    {errors.loteId && <p className="text-sm text-red-600 mt-1">{errors.loteId.message as string}</p>}
                  </div>
                  <div>
                    <label htmlFor="seccionId" className="text-sm font-medium">Sección</label>
                    <select id="seccionId" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" {...register("seccionId")}>
                      <option value="">Seleccionar...</option>
                      {secciones.map(s => (
                        <option key={s.id} value={s.id}>{s.galpon?.nombre || ""} — {s.nombre}</option>
                      ))}
                    </select>
                    {errors.seccionId && <p className="text-sm text-red-600 mt-1">{errors.seccionId.message as string}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="fecha" className="text-sm font-medium">Fecha</label>
                  <Input id="fecha" type="date" className="mt-1" {...register("fecha")} />
                  {errors.fecha && <p className="text-sm text-red-600 mt-1">{errors.fecha.message as string}</p>}
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
                    <label htmlFor="huevosSucio" className="text-sm">Huevos Sucios (uds)</label>
                    <Input id="huevosSucio" type="number" className="mt-1" {...register("huevosSucio", { setValueAs: v => v === "" ? 0 : Number(v) })} />
                    {errors.huevosSucio && <p className="text-xs text-red-600 mt-1">{errors.huevosSucio.message as string}</p>}
                  </div>
                  <div>
                    <label htmlFor="huevosRoto" className="text-sm">Huevos Rotos (uds)</label>
                    <Input id="huevosRoto" type="number" className="mt-1" {...register("huevosRoto", { setValueAs: v => v === "" ? 0 : Number(v) })} />
                    {errors.huevosRoto && <p className="text-xs text-red-600 mt-1">{errors.huevosRoto.message as string}</p>}
                  </div>
                  <div>
                    <label htmlFor="huevosDescarte" className="text-sm">Descarte (uds)</label>
                    <Input id="huevosDescarte" type="number" className="mt-1" {...register("huevosDescarte", { setValueAs: v => v === "" ? 0 : Number(v) })} />
                    {errors.huevosDescarte && <p className="text-xs text-red-600 mt-1">{errors.huevosDescarte.message as string}</p>}
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-lg border border-green-200 bg-green-50">
                  <h3 className="font-semibold text-sm text-green-700">Clasificación por Cajas</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(formatos).map(([key, f]) => {
                      const fieldName = `cajas${key.charAt(0).toUpperCase() + key.slice(1)}`
                      return (
                        <div key={key}>
                          <label htmlFor={fieldName} className="text-sm">{f.label}</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input id={fieldName} type="number" placeholder="cajas" className="flex-1" {...register(fieldName as any, { setValueAs: v => v === "" ? 0 : Number(v) })} />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">×{f.uds}</span>
                          </div>
                          {errors[fieldName as keyof typeof errors] && (
                            <p className="text-xs text-red-600 mt-1">{errors[fieldName as keyof typeof errors]?.message as string}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-lg border">
                  <h3 className="font-semibold text-sm">Totales del Día</h3>
                  <div className="space-y-3">
                    <div className="text-center py-4 border-b">
                      <p className="text-sm text-muted-foreground">Total Clasificado</p>
                      <p className="text-4xl font-bold text-green-700">— uds</p>
                      <p className="text-xs text-muted-foreground mt-1">Los totales se calculan al guardar</p>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      Al confirmar, se suman cajas y unidades al inventario acumulado de packing.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Confirmar Packing"}</Button>
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
        </form>
      )}

      {tab === "inventario" && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inventario Acumulado de Packing</CardTitle>
                <Badge variant="outline">Actualizado: —</Badge>
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
                      <td className="p-3 text-green-700">—</td>
                      <td className="p-3 text-red-600">—</td>
                      <td className="p-3 font-medium">Disponible</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
