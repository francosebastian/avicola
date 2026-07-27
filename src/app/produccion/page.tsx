"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { createRegistroDiarioSchema } from "@/lib/validations/produccion"

type Seccion = { id: string; nombre: string; galpon: { nombre: string } }
type LoteInfo = {
  id: string; codigoLote: string; lineaGenetica: string
  cantidadInicial: number; avesVivas: number; postura: number; edadSemanas: number
  galpon: string | null; seccion: string | null
}

type UltimoRegistro = {
  avesVivas?: number; bajasDia?: number; huevosProducidos?: number
  consumoAlimentoKg?: number; consumoAguaLitros?: number
  temperaturaMin?: number; temperaturaMax?: number
}

function ProduccionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [lotes, setLotes] = useState<LoteInfo[]>([])
  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteInfo | null>(null)
  const [ultimoRegistro, setUltimoRegistro] = useState<UltimoRegistro | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [galponSel, setGalponSel] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmData, setConfirmData] = useState<Record<string, unknown>>({})

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, reset } = useForm({
    resolver: zodResolver(createRegistroDiarioSchema),
  })

  useEffect(() => {
    Promise.all([
      fetch("/api/secciones").then(r => r.json()),
      fetch("/api/lotes").then(r => r.json()),
    ]).then(([secData, lotData]) => {
      setSecciones(secData || [])
      setLotes(lotData.data || lotData || [])
      setDataLoaded(true)
    }).catch(() => toast.error("Error al cargar datos"))
  }, [])

  // Auto-select from QR scan
  useEffect(() => {
    if (!dataLoaded) return
    const galponQr = searchParams.get("galpon")
    const seccionQr = searchParams.get("seccion")
    if (galponQr && seccionQr) {
      setGalponSel(galponQr)
      const match = secciones.find(s => s.nombre === seccionQr && s.galpon?.nombre === galponQr)
      if (match) setValue("seccionId", match.id)
    }
  }, [dataLoaded, searchParams, secciones, setValue])

  // When seccion changes, find lote and load last registro
  const seccionId = watch("seccionId")
  useEffect(() => {
    if (seccionId && secciones.length > 0 && lotes.length > 0) {
      const seccion = secciones.find(s => s.id === seccionId)
      if (!seccion?.nombre) { setLoteSeleccionado(null); return }
      const encontrado = lotes.find(l => l.seccion === seccion.nombre && l.galpon === seccion.galpon?.nombre) ?? null
      setLoteSeleccionado(encontrado)

      if (encontrado) {
        // Fetch last 2 registros to show yesterday's values
        fetch(`/api/produccion/registro-diario?loteId=${encontrado.id}&limit=2`)
          .then(r => r.json())
          .then(res => {
            const registros = res.data || []
            if (registros.length > 0) {
              const ult = registros[0]
              setUltimoRegistro({
                avesVivas: ult.avesVivas ?? undefined,
                bajasDia: ult.bajasDia ?? undefined,
                huevosProducidos: ult.huevosProducidos ?? undefined,
                consumoAlimentoKg: ult.consumoAlimentoKg ? Number(ult.consumoAlimentoKg) : undefined,
                consumoAguaLitros: ult.consumoAguaLitros ? Number(ult.consumoAguaLitros) : undefined,
                temperaturaMin: ult.temperaturaMin ? Number(ult.temperaturaMin) : undefined,
                temperaturaMax: ult.temperaturaMax ? Number(ult.temperaturaMax) : undefined,
              })
            }
          })
          .catch(() => {})
      }
    } else {
      setLoteSeleccionado(null)
      setUltimoRegistro(null)
    }
  }, [seccionId, secciones, lotes])

  const hoy = new Date().toLocaleDateString("es-CL", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })

  function onPreSubmit(data: any) {
    const body: Record<string, unknown> = {
      ...data,
      fecha: new Date().toISOString().split("T")[0],
      loteId: loteSeleccionado?.id ?? data.loteId,
    }
    for (const key of Object.keys(body)) {
      if (["avesVivas", "bajasDia", "huevosProducidos"].includes(key)) {
        body[key] = body[key] === "" ? undefined : Number(body[key])
      }
      if (["consumoAlimentoKg", "consumoAguaLitros", "temperaturaMin", "temperaturaMax"].includes(key)) {
        body[key] = body[key] === "" ? undefined : Number(body[key])
      }
    }
    setConfirmData(body)
    setShowConfirm(true)
  }

  async function onConfirmSave() {
    setShowConfirm(false)
    const res = await fetch("/api/produccion/registro-diario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(confirmData),
    })
    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Error al guardar registro")
      return
    }
    toast.success("Registro diario guardado correctamente")
    reset()
    setUltimoRegistro(null)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onPreSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Registro Diario de Producción</h1>
          <p className="text-muted-foreground text-sm">Registro por sección — {hoy}</p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar Registro"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Seleccionar Sección</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="galpon" className="text-sm font-medium">Galpón</label>
                <select id="galpon" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" value={galponSel} onChange={(e) => { setGalponSel(e.target.value); setValue("seccionId", "") }}>
                  <option value="">Seleccionar...</option>
                  {[...new Map(secciones.map(s => [s.galpon?.nombre, s.galpon?.nombre])).values()].filter(Boolean).map(g => (
                    <option key={g} value={g!}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="seccionId" className="text-sm font-medium">Sección</label>
                <select id="seccionId" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" {...register("seccionId")}>
                  <option value="">Seleccionar...</option>
                  {secciones.filter(s => !galponSel || s.galpon?.nombre === galponSel).map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                      {lotes.find(l => l.seccion === s.nombre && l.galpon === s.galpon?.nombre)
                        ? ` — ${lotes.find(l => l.seccion === s.nombre && l.galpon === s.galpon?.nombre)?.codigoLote}` : ""}
                    </option>
                  ))}
                </select>
                {errors.seccionId && <p className="text-sm text-red-600 mt-1">{errors.seccionId.message as string}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Resumen del Lote</CardTitle></CardHeader>
          <CardContent>
            {loteSeleccionado ? (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Lote:</span><span className="font-medium">{loteSeleccionado.codigoLote}</span>
                <span className="text-muted-foreground">Línea:</span><span className="font-medium">{loteSeleccionado.lineaGenetica}</span>
                <span className="text-muted-foreground">Edad:</span><span className="font-medium">{loteSeleccionado.edadSemanas} semanas</span>
                <span className="text-muted-foreground">Aves iniciales:</span><span className="font-medium">{loteSeleccionado.cantidadInicial.toLocaleString()}</span>
                <span className="text-muted-foreground">Aves vivas (ayer):</span><span className="font-medium">{ultimoRegistro?.avesVivas?.toLocaleString() ?? "—"}</span>
                <span className="text-muted-foreground">Postura esperada:</span><span className="font-medium">{loteSeleccionado.postura > 0 ? `${loteSeleccionado.postura}%` : "—"}</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Seleccione un lote para ver su resumen</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Registro de Datos</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            {[
              { id: "avesVivas", label: "Aves Vivas", type: "number" },
              { id: "bajasDia", label: "Bajas del Día", type: "number" },
              { id: "huevosProducidos", label: "Huevos Producidos", type: "number" },
              { id: "consumoAlimentoKg", label: "Consumo Alimento (kg)", type: "number", step: "0.1" },
              { id: "consumoAguaLitros", label: "Consumo Agua (litros)", type: "number", step: "0.1" },
              { id: "temperaturaMin", label: "Temp. Mínima (°C)", type: "number", step: "0.1" },
              { id: "temperaturaMax", label: "Temp. Máxima (°C)", type: "number", step: "0.1" },
            ].map(({ id, label, type, step }) => (
              <div key={id}>
                <label htmlFor={id} className="text-sm font-medium">{label}</label>
                <div className="relative">
                  <Input id={id} type={type} step={step} className="mt-1 text-lg" {...register(id as any, { setValueAs: v => v === "" ? undefined : Number(v) })} />
                  {ultimoRegistro && (ultimoRegistro as any)[id] !== undefined && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                      ← {(ultimoRegistro as any)[id]}
                    </span>
                  )}
                </div>
                {errors[id as keyof typeof errors] && <p className="text-sm text-red-600 mt-1">{String(errors[id as keyof typeof errors]?.message || "")}</p>}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label htmlFor="observaciones" className="text-sm font-medium">Observaciones</label>
            <textarea id="observaciones" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" rows={3} placeholder="Ej: aves tranquilas, sin novedades..." {...register("observaciones")} />
            {errors.observaciones && <p className="text-sm text-red-600 mt-1">{errors.observaciones.message as string}</p>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirmar Registro Diario</DialogTitle></DialogHeader>
          <div className="space-y-2 text-sm">
            {[
              ["Sección", secciones.find(s => s.id === confirmData.seccionId as string)?.nombre],
              ["Lote", loteSeleccionado?.codigoLote],
              ["Fecha", new Date().toLocaleDateString("es-CL")],
              ["Aves Vivas", confirmData.avesVivas],
              ["Bajas del Día", confirmData.bajasDia],
              ["Huevos Producidos", confirmData.huevosProducidos],
              ["Consumo Alimento (kg)", confirmData.consumoAlimentoKg],
              ["Consumo Agua (litros)", confirmData.consumoAguaLitros],
              ["Temp. Mínima (°C)", confirmData.temperaturaMin],
              ["Temp. Máxima (°C)", confirmData.temperaturaMax],
              ["Observaciones", confirmData.observaciones || "—"],
            ]
              .filter(([, v]) => v !== undefined && v !== "")
              .map(([k, v]) => (
                <div key={k as string} className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">{k as string}</span>
                  <span className="font-medium">{String(v ?? "—")}</span>
                </div>
              ))}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancelar</Button>
            <Button onClick={onConfirmSave} disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Confirmar y Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}

export default function ProduccionPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-muted-foreground">Cargando...</div>}>
      <ProduccionForm />
    </Suspense>
  )
}
