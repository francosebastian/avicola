"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createRegistroDiarioSchema } from "@/lib/validations/produccion"

type Seccion = { id: string; nombre: string; galpon: { nombre: string } }
type LoteInfo = {
  id: string
  codigoLote: string
  lineaGenetica: string
  cantidadInicial: number
  avesVivas: number
  postura: number
  edadSemanas: number
  galpon: string | null
  seccion: string | null
}

export default function ProduccionPage() {
  const router = useRouter()
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [lotes, setLotes] = useState<LoteInfo[]>([])
  const [loteSeleccionado, setLoteSeleccionado] = useState<LoteInfo | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: zodResolver(createRegistroDiarioSchema),
  })

  useEffect(() => {
    Promise.all([
      fetch("/api/secciones").then(r => r.json()),
      fetch("/api/lotes").then(r => r.json()),
    ]).then(([secData, lotData]) => {
      setSecciones(secData || [])
      setLotes(lotData.data || lotData || [])
    }).catch(() => toast.error("Error al cargar datos"))
  }, [])

  const seccionId = watch("seccionId")
  useEffect(() => {
    if (seccionId && secciones.length > 0 && lotes.length > 0) {
      const seccion = secciones.find(s => s.id === seccionId)
      if (!seccion?.nombre) { setLoteSeleccionado(null); return }
      const encontrado = lotes.find(l => l.seccion === seccion.nombre && l.galpon === seccion.galpon?.nombre) ?? null
      setLoteSeleccionado(encontrado)
    } else {
      setLoteSeleccionado(null)
    }
  }, [seccionId, secciones, lotes])

  const hoy = new Date().toLocaleDateString("es-CL", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  })

  async function onSubmit(data: any) {
    const body: Record<string, unknown> = {
      ...data,
      fecha: new Date().toISOString().split("T")[0],
      loteId: loteSeleccionado?.id ?? data.loteId,
    }
    for (const key of Object.keys(body)) {
      if (["avesVivas", "bajasDia", "huevosProducidos", "huevosJumbo", "huevosSuper", "huevosExtra", "huevosPrimera", "huevosSegunda", "huevosTercera", "huevosSubproducto"].includes(key)) {
        body[key] = body[key] === "" ? undefined : Number(body[key])
      }
      if (["consumoAlimentoKg", "consumoAguaLitros", "temperaturaMin", "temperaturaMax"].includes(key)) {
        body[key] = body[key] === "" ? undefined : Number(body[key])
      }
    }

    const res = await fetch("/api/produccion/registro-diario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Error al guardar registro")
      return
    }

    toast.success("Registro diario guardado correctamente")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Registro Diario de Producción</h1>
          <p className="text-muted-foreground text-sm">
            Registro por sección — {hoy}
          </p>
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
                <select id="galpon" className="w-full mt-1 rounded-md border p-2 text-sm bg-background">
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
                  {secciones.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                      {lotes.find(l => l.seccion === s.nombre && l.galpon === s.galpon?.nombre)
                        ? ` — ${lotes.find(l => l.seccion === s.nombre && l.galpon === s.galpon?.nombre)?.codigoLote}`
                        : ""}
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
                <span className="text-muted-foreground">Lote:</span>
                <span className="font-medium">{loteSeleccionado.codigoLote}</span>
                <span className="text-muted-foreground">Línea:</span>
                <span className="font-medium">{loteSeleccionado.lineaGenetica}</span>
                <span className="text-muted-foreground">Edad:</span>
                <span className="font-medium">{loteSeleccionado.edadSemanas} semanas</span>
                <span className="text-muted-foreground">Aves iniciales:</span>
                <span className="font-medium">{loteSeleccionado.cantidadInicial.toLocaleString()}</span>
                <span className="text-muted-foreground">Aves vivas:</span>
                <span className="font-medium">{(loteSeleccionado.avesVivas ?? 0).toLocaleString()}</span>
                <span className="text-muted-foreground">Postura esperada:</span>
                <span className="font-medium">{loteSeleccionado.postura > 0 ? `${loteSeleccionado.postura}%` : "—"}</span>
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
            <div>
              <label htmlFor="avesVivas" className="text-sm font-medium">Aves Vivas</label>
              <Input id="avesVivas" type="number" className="mt-1 text-lg" {...register("avesVivas", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.avesVivas && <p className="text-sm text-red-600 mt-1">{errors.avesVivas.message as string}</p>}
            </div>
            <div>
              <label htmlFor="bajasDia" className="text-sm font-medium">Bajas del Día</label>
              <Input id="bajasDia" type="number" className="mt-1 text-lg" {...register("bajasDia", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.bajasDia && <p className="text-sm text-red-600 mt-1">{errors.bajasDia.message as string}</p>}
            </div>
            <div>
              <label htmlFor="huevosProducidos" className="text-sm font-medium">Huevos Producidos</label>
              <Input id="huevosProducidos" type="number" className="mt-1 text-lg" {...register("huevosProducidos", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.huevosProducidos && <p className="text-sm text-red-600 mt-1">{errors.huevosProducidos.message as string}</p>}
            </div>
            <div>
              <label htmlFor="consumoAlimentoKg" className="text-sm font-medium">Consumo Alimento (kg)</label>
              <Input id="consumoAlimentoKg" type="number" step="0.1" className="mt-1 text-lg" {...register("consumoAlimentoKg", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.consumoAlimentoKg && <p className="text-sm text-red-600 mt-1">{errors.consumoAlimentoKg.message as string}</p>}
            </div>
            <div>
              <label htmlFor="consumoAguaLitros" className="text-sm font-medium">Consumo Agua (litros)</label>
              <Input id="consumoAguaLitros" type="number" step="0.1" className="mt-1 text-lg" {...register("consumoAguaLitros", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.consumoAguaLitros && <p className="text-sm text-red-600 mt-1">{errors.consumoAguaLitros.message as string}</p>}
            </div>
            <div>
              <label htmlFor="temperaturaMin" className="text-sm font-medium">Temp. Mínima (°C)</label>
              <Input id="temperaturaMin" type="number" step="0.1" className="mt-1 text-lg" {...register("temperaturaMin", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.temperaturaMin && <p className="text-sm text-red-600 mt-1">{errors.temperaturaMin.message as string}</p>}
            </div>
            <div>
              <label htmlFor="temperaturaMax" className="text-sm font-medium">Temp. Máxima (°C)</label>
              <Input id="temperaturaMax" type="number" step="0.1" className="mt-1 text-lg" {...register("temperaturaMax", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.temperaturaMax && <p className="text-sm text-red-600 mt-1">{errors.temperaturaMax.message as string}</p>}
            </div>
          </div>

          <h3 className="text-sm font-medium mt-6 mb-3">Clasificación de Huevos</h3>
          <div className="grid grid-cols-7 gap-4">
            {[
              { id: "huevosJumbo", label: "Jumbo" },
              { id: "huevosSuper", label: "Súper" },
              { id: "huevosExtra", label: "Extra" },
              { id: "huevosPrimera", label: "Primera" },
              { id: "huevosSegunda", label: "Segunda" },
              { id: "huevosTercera", label: "Tercera" },
              { id: "huevosSubproducto", label: "Subproducto" },
            ].map(({ id, label }) => (
              <div key={id}>
                <label htmlFor={id} className="text-xs text-muted-foreground">{label}</label>
                <Input id={id} type="number" className="mt-1" {...register(id as any, { setValueAs: v => v === "" ? undefined : Number(v) })} />
                {errors[id as keyof typeof errors] && <p className="text-xs text-red-600 mt-1">{String(errors[id as keyof typeof errors]?.message || "")}</p>}
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
    </form>
  )
}
