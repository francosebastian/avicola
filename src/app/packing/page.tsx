"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Link from "next/link"
import { z } from "zod"

const categorias = [
  { id: "cajasJumboXxl", label: "Jumbo XXL", peso: "> 78 g", uds: 100, stockKey: "jumbo_xxl" },
  { id: "cajasJumbo", label: "Jumbo", peso: "74 – 78 g", uds: 100, stockKey: "jumbo" },
  { id: "cajasSuper", label: "Súper", peso: "68 – 73 g", uds: 100, stockKey: "super" },
  { id: "cajasExtra", label: "Extra", peso: "61 – 67 g", uds: 180, stockKey: "extra" },
  { id: "cajasPrimera", label: "Primera", peso: "54 – 60 g", uds: 180, stockKey: "primera" },
  { id: "cajasSegunda", label: "Segunda", peso: "45 – 53 g", uds: 180, stockKey: "segunda" },
  { id: "cajasTercera", label: "Tercera", peso: "< 44 g", uds: 180, stockKey: "tercera" },
  { id: "cajasDescarteX", label: "Descarte X", peso: "defectos estéticos", uds: 100, stockKey: "descarte_x" },
  { id: "cajasTrizados", label: "Trizados", peso: "huevos trizados", uds: 100, stockKey: "trizados" },
]

const schema = z.object({
  loteId: z.string().uuid().optional(),
  seccionId: z.string().uuid(),
  fecha: z.string().optional(),
  huevosRotosKg: z.number().nonnegative().default(0).optional(),
  cajasDescarteX: z.number().int().nonnegative().default(0).optional(),
  cajasTrizados: z.number().int().nonnegative().default(0).optional(),
  cajasJumboXxl: z.number().int().nonnegative().default(0).optional(),
  cajasJumbo: z.number().int().nonnegative().default(0).optional(),
  cajasSuper: z.number().int().nonnegative().default(0).optional(),
  cajasExtra: z.number().int().nonnegative().default(0).optional(),
  cajasPrimera: z.number().int().nonnegative().default(0).optional(),
  cajasSegunda: z.number().int().nonnegative().default(0).optional(),
  cajasTercera: z.number().int().nonnegative().default(0).optional(),
})

type FormData = z.infer<typeof schema>

export default function PackingPage() {
  const [tab, setTab] = useState<"registro" | "inventario">("registro")
  const [secciones, setSecciones] = useState<any[]>([])
  const [lotes, setLotes] = useState<any[]>([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmData, setConfirmData] = useState<Record<string, any>>({})
  const [inventario, setInventario] = useState<any[]>([])
  const [galponId, setGalponId] = useState("")
  const [filaId, setFilaId] = useState("")

  const { register, handleSubmit, watch, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { huevosRotosKg: 0, cajasDescarteX: 0, cajasTrizados: 0 },
  })

  const galpones = useMemo(() => {
    const map = new Map<string, { id: string; nombre: string }>()
    for (const s of secciones) {
      if (s.galponId) map.set(s.galponId, { id: s.galponId, nombre: s.galpon?.nombre })
    }
    return [...map.values()].sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [secciones])

  const filas = secciones.filter((s: any) => s.galponId === galponId)

  function onGalponChange(id: string) {
    setGalponId(id)
    setFilaId("")
    setValue("seccionId", "" as any)
    setValue("loteId", "" as any)
  }

  function onFilaChange(secId: string) {
    setFilaId(secId)
    setValue("seccionId", secId)
    const lote = lotes.find((l: any) => l.seccionId === secId)
    setValue("loteId", lote?.id || "")
  }

  useEffect(() => {
    Promise.all([
      fetch("/api/secciones").then(r => r.json()),
      fetch("/api/lotes").then(r => r.json()),
    ]).then(([sec, lot]) => {
      setSecciones(sec || [])
      setLotes(lot.data || lot || [])
    }).catch(() => toast.error("Error al cargar datos"))
  }, [])

  useEffect(() => {
    if (tab !== "inventario") return
    fetch("/api/packing/inventario?limit=100")
      .then(r => r.json())
      .then(json => setInventario(json.data || []))
      .catch(() => toast.error("Error al cargar inventario"))
  }, [tab])

  const vals = watch()

  const totalCajas = categorias.reduce((s, c) => s + (Number((vals as any)[c.id]) || 0), 0)
  const totalUnidades = categorias.reduce((s, c) => s + (Number((vals as any)[c.id]) || 0) * c.uds, 0)

  function onPreSubmit(data: FormData) {
    if (!data.seccionId || !lotes.find((l: any) => l.id === data.loteId)) {
      toast.error("Seleccione galpón y fila con un lote asignado")
      return
    }
    const body: Record<string, any> = { ...data }
    for (const k of Object.keys(body)) {
      if (k === "loteId" || k === "seccionId" || k === "fecha") continue
      if (typeof body[k] === "string" && body[k] !== "") body[k] = Number(body[k])
      if (body[k] === "" || body[k] === undefined || Number.isNaN(body[k])) body[k] = 0
    }
    body.fecha = new Date().toISOString().split("T")[0]
    setConfirmData(body)
    setShowConfirm(true)
  }

  async function onConfirmSave() {
    setShowConfirm(false)
    const res = await fetch("/api/packing/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(confirmData),
    })
    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Error al guardar")
      return
    }
    toast.success("Packing registrado correctamente")
    reset()
    if (filaId) {
      setValue("seccionId", filaId)
      const lote = lotes.find((l: any) => l.seccionId === filaId)
      setValue("loteId", lote?.id || "")
    }
    routerRefresh()
  }

  function routerRefresh() {
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Packing y Clasificación de Huevos</h1>
          <p className="text-muted-foreground text-sm">Registro por cajas — {new Date().toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/despacho"><Button variant="outline">Ir a Despachos</Button></Link>
          <Button onClick={handleSubmit(onPreSubmit)}>Confirmar Packing</Button>
        </div>
      </div>

      <div className="flex gap-2 border-b pb-2">
        <button onClick={() => setTab("registro")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "registro" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>Registro</button>
        <button onClick={() => setTab("inventario")} className={`px-4 py-2 text-sm font-medium rounded-t-md ${tab === "inventario" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>Inventario</button>
      </div>

      {tab === "registro" && (
        <form onSubmit={handleSubmit(onPreSubmit)}>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader><CardTitle>Seleccionar Origen</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Galpón</label>
                    <select
                      className="w-full mt-1 rounded-md border p-2 text-sm bg-background"
                      value={galponId}
                      onChange={(e) => onGalponChange(e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      {galpones.map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Fila</label>
                    <select
                      className="w-full mt-1 rounded-md border p-2 text-sm bg-background"
                      value={filaId}
                      onChange={(e) => onFilaChange(e.target.value)}
                      disabled={!galponId}
                    >
                      <option value="">Seleccionar...</option>
                      {filas.map((s: any) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>No Clasificados</CardTitle></CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium">Huevos Rotos (kg)</label>
                  <p className="text-xs text-muted-foreground mb-1">Huevos que van a la fosa — se pesan en kg</p>
                  <Input type="number" step="0.1" className="mt-1" {...register("huevosRotosKg", { setValueAs: (v: any) => v === "" ? 0 : Number(v) })} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Clasificación por Cajas</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full mb-4">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="p-2 font-medium">Categoría</th>
                    <th className="p-2 font-medium">Peso</th>
                    <th className="p-2 font-medium">Cajas</th>
                    <th className="p-2 font-medium">uds/caja</th>
                    <th className="p-2 font-medium">Total uds</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((cat) => {
                    const cajas = Number((vals as any)[cat.id]) || 0
                    return (
                      <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="p-2 font-medium">{cat.label}</td>
                        <td className="p-2 text-sm text-muted-foreground">{cat.peso}</td>
                        <td className="p-2 w-24">
                          <Input type="number" min={0} {...register(cat.id as any, { setValueAs: (v: any) => v === "" ? 0 : Number(v) })} />
                        </td>
                        <td className="p-2 text-sm">{cat.uds}</td>
                        <td className="p-2 font-medium">{(cajas * cat.uds).toLocaleString()}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="p-3 rounded-lg border text-center">
                  <p className="text-muted-foreground">Total Cajas</p>
                  <p className="text-2xl font-bold">{totalCajas}</p>
                </div>
                <div className="p-3 rounded-lg border text-center">
                  <p className="text-muted-foreground">Total Unidades Clasificadas</p>
                  <p className="text-2xl font-bold text-green-700">{totalUnidades.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg border text-center">
                  <p className="text-muted-foreground">Huevos Rotos</p>
                  <p className="text-2xl font-bold text-amber-600">{Number(vals.huevosRotosKg ?? 0).toFixed(1)} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {tab === "inventario" && (
        <Card>
          <CardHeader><CardTitle>Inventario Acumulado de Packing</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-3 font-medium">Categoría</th>
                  <th className="p-3 font-medium">Stock Cajas</th>
                  <th className="p-3 font-medium">Stock Unidades</th>
                  <th className="p-3 font-medium">Formato</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat) => {
                  const stock = inventario.find((i: any) => i.categoria === cat.stockKey)
                  return (
                    <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-3 font-medium">{cat.label}</td>
                      <td className="p-3">{Number(stock?.stockCajas ?? 0).toLocaleString()}</td>
                      <td className="p-3">{Number(stock?.stockUnidades ?? 0).toLocaleString()}</td>
                      <td className="p-3 text-sm text-muted-foreground">{cat.uds} uds/caja</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirmar Packing</DialogTitle></DialogHeader>
          <div className="space-y-2 text-sm">
            {[
              ["Lote", lotes.find((l: any) => l.id === confirmData.loteId)?.codigoLote],
              ["Sección", secciones.find((s: any) => s.id === confirmData.seccionId)?.nombre],
              ["Huevos Rotos (kg)", confirmData.huevosRotosKg],
              ...categorias.map(c => [`${c.label} (cajas)`, confirmData[c.id]]),
              ["Total Cajas", totalCajas],
              ["Total Unidades", totalUnidades],
            ].filter(([, v]) => v && Number(v) > 0).map(([k, v]) => (
              <div key={k as string} className="flex justify-between border-b pb-1">
                <span className="text-muted-foreground">{k as string}</span>
                <span className="font-medium">{String(v)}</span>
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancelar</Button>
            <Button onClick={onConfirmSave}>Confirmar y Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
