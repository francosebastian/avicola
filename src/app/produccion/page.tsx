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
type Lote = { id: string; codigoLote: string; lineaGenetica: string }

export default function ProduccionPage() {
  const router = useRouter()
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [lotes, setLotes] = useState<Lote[]>([])

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: zodResolver(createRegistroDiarioSchema),
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
          <p className="text-muted-foreground text-sm">Registro por sección</p>
        </div>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar Registro"}</Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Seleccionar Sección</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Resumen del Lote</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Lote seleccionado:</span>
              <span className="font-medium">{lotes.find(l => l.id === watch("loteId"))?.codigoLote || "—"}</span>
              <span className="text-muted-foreground">Sección:</span>
              <span className="font-medium">{secciones.find(s => s.id === watch("seccionId"))?.nombre || "—"}</span>
            </div>
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
            <div>
              <label htmlFor="huevosJumbo" className="text-xs text-muted-foreground">Jumbo</label>
              <Input id="huevosJumbo" type="number" className="mt-1" {...register("huevosJumbo", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.huevosJumbo && <p className="text-xs text-red-600 mt-1">{errors.huevosJumbo.message as string}</p>}
            </div>
            <div>
              <label htmlFor="huevosSuper" className="text-xs text-muted-foreground">Súper</label>
              <Input id="huevosSuper" type="number" className="mt-1" {...register("huevosSuper", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.huevosSuper && <p className="text-xs text-red-600 mt-1">{errors.huevosSuper.message as string}</p>}
            </div>
            <div>
              <label htmlFor="huevosExtra" className="text-xs text-muted-foreground">Extra</label>
              <Input id="huevosExtra" type="number" className="mt-1" {...register("huevosExtra", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.huevosExtra && <p className="text-xs text-red-600 mt-1">{errors.huevosExtra.message as string}</p>}
            </div>
            <div>
              <label htmlFor="huevosPrimera" className="text-xs text-muted-foreground">Primera</label>
              <Input id="huevosPrimera" type="number" className="mt-1" {...register("huevosPrimera", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.huevosPrimera && <p className="text-xs text-red-600 mt-1">{errors.huevosPrimera.message as string}</p>}
            </div>
            <div>
              <label htmlFor="huevosSegunda" className="text-xs text-muted-foreground">Segunda</label>
              <Input id="huevosSegunda" type="number" className="mt-1" {...register("huevosSegunda", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.huevosSegunda && <p className="text-xs text-red-600 mt-1">{errors.huevosSegunda.message as string}</p>}
            </div>
            <div>
              <label htmlFor="huevosTercera" className="text-xs text-muted-foreground">Tercera</label>
              <Input id="huevosTercera" type="number" className="mt-1" {...register("huevosTercera", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.huevosTercera && <p className="text-xs text-red-600 mt-1">{errors.huevosTercera.message as string}</p>}
            </div>
            <div>
              <label htmlFor="huevosSubproducto" className="text-xs text-muted-foreground">Subproducto</label>
              <Input id="huevosSubproducto" type="number" className="mt-1" {...register("huevosSubproducto", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.huevosSubproducto && <p className="text-xs text-red-600 mt-1">{errors.huevosSubproducto.message as string}</p>}
            </div>
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
