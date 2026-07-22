"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { createControlCalidadHuevoSchema } from "@/lib/validations/calidad"

type Lote = { id: string; codigoLote: string; lineaGenetica: string }

const clasificaciones = [
  { nombre: "Jumbo", peso: "≥ 68 g", produccion: 15, color: "bg-green-700" },
  { nombre: "Super", peso: "65 – 67 g", produccion: 36, color: "bg-green-500" },
  { nombre: "Extra", peso: "61 – 64 g", produccion: 30, color: "bg-green-300" },
  { nombre: "Primera", peso: "55 – 60 g", produccion: 12, color: "bg-yellow-400" },
  { nombre: "Segunda", peso: "50 – 54 g", produccion: 5, color: "bg-orange-500" },
  { nombre: "Tercera", peso: "< 50 g", produccion: 2, color: "bg-red-500" },
]

const calidadData = [
  { fecha: "20 Jul 2026", lote: "H-032", peso: 63.2, haugh: 82, yema: 8, cascara: 3.8 },
  { fecha: "20 Jul 2026", lote: "H-033", peso: 60.5, haugh: 79, yema: 7, cascara: 3.5 },
  { fecha: "20 Jul 2026", lote: "H-035", peso: 65.8, haugh: 84, yema: 9, cascara: 4.0 },
  { fecha: "19 Jul 2026", lote: "H-032", peso: 62.9, haugh: 81, yema: 8, cascara: 3.7 },
  { fecha: "19 Jul 2026", lote: "H-033", peso: 60.8, haugh: 80, yema: 7, cascara: 3.6 },
  { fecha: "18 Jul 2026", lote: "H-032", peso: 63.5, haugh: 83, yema: 8, cascara: 3.9 },
]

const trazabilidadData = [
  { envase: "ENV-001-A", lote: "H-032", seccion: "Galpón 1 - A", postura: "20 Jul 2026", clasif: "Super", destino: "Supermercado XYZ" },
  { envase: "ENV-001-B", lote: "H-032", seccion: "Galpón 1 - A", postura: "20 Jul 2026", clasif: "Jumbo", destino: "Supermercado XYZ" },
  { envase: "ENV-002-A", lote: "H-033", seccion: "Galpón 1 - B", postura: "20 Jul 2026", clasif: "Extra", destino: "Distribuidora ABC" },
  { envase: "ENV-002-B", lote: "H-033", seccion: "Galpón 1 - B", postura: "20 Jul 2026", clasif: "Primera", destino: "Distribuidora ABC" },
  { envase: "ENV-003-A", lote: "H-035", seccion: "Galpón 2 - Sur", postura: "19 Jul 2026", clasif: "Super", destino: "Hotel Gourmet S.A." },
  { envase: "ENV-003-B", lote: "H-035", seccion: "Galpón 2 - Sur", postura: "19 Jul 2026", clasif: "Extra", destino: "Hotel Gourmet S.A." },
  { envase: "ENV-004-A", lote: "H-032", seccion: "Galpón 1 - A", postura: "19 Jul 2026", clasif: "Segunda", destino: "Industria Alimenticia" },
  { envase: "ENV-005-A", lote: "H-034", seccion: "Galpón 2 - Norte", postura: "18 Jul 2026", clasif: "Tercera", destino: "Planta de pasteurización" },
]

export default function CalidadPage() {
  const router = useRouter()
  const [lotes, setLotes] = useState<Lote[]>([])
  const [search, setSearch] = useState("")

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(createControlCalidadHuevoSchema),
  })

  useEffect(() => {
    fetch("/api/lotes").then(r => r.json())
      .then(data => setLotes(data.data || data || []))
      .catch(() => {})
  }, [])

  const filtered = trazabilidadData.filter(t =>
    t.envase.toLowerCase().includes(search.toLowerCase()) ||
    t.lote.toLowerCase().includes(search.toLowerCase())
  )

  async function onSubmit(data: any) {
    const body: Record<string, unknown> = { ...data }
    for (const key of ["muestraId", "pesoPromedioGramos", "unidadHaugh", "colorYema", "resistenciaCascaraKgf", "phClara", "phYema", "camaraAireMm"] as const) {
      if (key in body) {
        body[key] = body[key] === "" ? undefined : Number(body[key])
      }
    }

    const res = await fetch("/api/calidad/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Error al guardar control de calidad")
      return
    }

    toast.success("Control de calidad guardado correctamente")
    reset()
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calidad de Huevo y Trazabilidad</h1>
        <p className="text-muted-foreground text-sm">Clasificación, control de calidad interna y trazabilidad de envases</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Clasificación por Peso</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            {clasificaciones.map((c, i) => (
              <div key={i} className="rounded-lg border p-4 text-center">
                <div className={`mx-auto mb-2 size-3 rounded-full ${c.color}`} />
                <p className="font-semibold text-lg">{c.nombre}</p>
                <p className="text-xs text-muted-foreground">{c.peso}</p>
                <p className="text-sm font-medium mt-1">{c.produccion}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Control de Calidad — Nuevo Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="loteId" className="text-sm font-medium">Lote</label>
                <select id="loteId" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" {...register("loteId")}>
                  <option value="">Seleccionar...</option>
                  {lotes.map(l => <option key={l.id} value={l.id}>{l.codigoLote} — {l.lineaGenetica}</option>)}
                </select>
                {errors.loteId && <p className="text-sm text-red-600 mt-1">{errors.loteId.message as string}</p>}
              </div>
              <div>
                <label htmlFor="fecha" className="text-sm font-medium">Fecha</label>
                <Input id="fecha" type="date" className="mt-1" {...register("fecha")} />
                {errors.fecha && <p className="text-sm text-red-600 mt-1">{errors.fecha.message as string}</p>}
              </div>
              <div>
                <label htmlFor="muestraId" className="text-sm font-medium">N° Muestra</label>
                <Input id="muestraId" type="number" className="mt-1" {...register("muestraId", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label htmlFor="pesoPromedioGramos" className="text-sm font-medium">Peso Promedio (g)</label>
                <Input id="pesoPromedioGramos" type="number" step="0.1" className="mt-1" {...register("pesoPromedioGramos", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              </div>
              <div>
                <label htmlFor="unidadHaugh" className="text-sm font-medium">Unidad Haugh</label>
                <Input id="unidadHaugh" type="number" step="0.1" className="mt-1" {...register("unidadHaugh", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              </div>
              <div>
                <label htmlFor="colorYema" className="text-sm font-medium">Color Yema (Roche)</label>
                <Input id="colorYema" type="number" className="mt-1" {...register("colorYema", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              </div>
              <div>
                <label htmlFor="resistenciaCascaraKgf" className="text-sm font-medium">Resistencia (kg/cm²)</label>
                <Input id="resistenciaCascaraKgf" type="number" step="0.1" className="mt-1" {...register("resistenciaCascaraKgf", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="phClara" className="text-sm font-medium">pH Clara</label>
                <Input id="phClara" type="number" step="0.1" className="mt-1" {...register("phClara", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              </div>
              <div>
                <label htmlFor="phYema" className="text-sm font-medium">pH Yema</label>
                <Input id="phYema" type="number" step="0.1" className="mt-1" {...register("phYema", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              </div>
              <div>
                <label htmlFor="camaraAireMm" className="text-sm font-medium">Cámara de Aire (mm)</label>
                <Input id="camaraAireMm" type="number" step="0.1" className="mt-1" {...register("camaraAireMm", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              </div>
            </div>
            <div>
              <label htmlFor="observaciones" className="text-sm font-medium">Observaciones</label>
              <textarea id="observaciones" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" rows={2} {...register("observaciones")} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Control de Calidad"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Controles de Calidad Recientes</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Lote</th><th className="p-3 font-medium">Peso Prom.</th>
                <th className="p-3 font-medium">Unidad Haugh</th><th className="p-3 font-medium">Color Yema</th><th className="p-3 font-medium">Resistencia</th>
              </tr>
            </thead>
            <tbody>
              {calidadData.map((c, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 text-sm">{c.fecha}</td>
                  <td className="p-3 font-medium">{c.lote}</td>
                  <td className="p-3">{c.peso} g</td>
                  <td className="p-3">{c.haugh}</td>
                  <td className="p-3">{c.yema} (Roche)</td>
                  <td className="p-3">{c.cascara} kg/cm²</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Trazabilidad</CardTitle>
            <div className="relative w-56">
              <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar envase o lote..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Código Envase</th><th className="p-3 font-medium">Lote</th><th className="p-3 font-medium">Sección</th>
                <th className="p-3 font-medium">Fecha Postura</th><th className="p-3 font-medium">Clasificación</th><th className="p-3 font-medium">Destino</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 font-mono text-xs font-medium">{t.envase}</td>
                  <td className="p-3">{t.lote}</td>
                  <td className="p-3 text-sm">{t.seccion}</td>
                  <td className="p-3 text-sm">{t.postura}</td>
                  <td className="p-3"><Badge variant="secondary">{t.clasif}</Badge></td>
                  <td className="p-3 text-sm">{t.destino}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Sin resultados para &quot;{search}&quot;</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
