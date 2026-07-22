"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createLoteSchema } from "@/lib/validations/lotes"

type Seccion = { id: string; nombre: string; galpon: { nombre: string } }

export default function NuevoLotePage() {
  const router = useRouter()
  const [secciones, setSecciones] = useState<Seccion[]>([])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createLoteSchema),
  })

  useEffect(() => {
    fetch("/api/secciones")
      .then(res => { if (!res.ok) throw new Error(); return res.json() })
      .then(setSecciones)
      .catch(() => toast.error("Error al cargar secciones"))
  }, [])

  async function onSubmit(data: any) {
    const body = {
      ...data,
      cantidadInicial: Number(data.cantidadInicial),
      pesoInicialPromedio: data.pesoInicialPromedio ? Number(data.pesoInicialPromedio) : undefined,
      costoPollitaUnitario: data.costoPollitaUnitario ? Number(data.costoPollitaUnitario) : undefined,
    }

    const res = await fetch("/api/lotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Error al guardar el lote")
      return
    }

    toast.success("Lote creado correctamente")
    router.push("/lotes")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nuevo Lote</h1>
          <p className="text-muted-foreground text-sm">Registro de recepción de pollitas BB</p>
        </div>
        <Link href="/lotes">
          <Button variant="outline" type="button">Cancelar</Button>
        </Link>
      </div>

      <Card>
        <CardHeader><CardTitle>Información General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="codigoLote" className="text-sm font-medium">Código del Lote <span className="text-red-500">*</span></label>
              <Input id="codigoLote" placeholder="Ej: H-036" className="mt-1" {...register("codigoLote")} />
              {errors.codigoLote && <p className="text-sm text-red-600 mt-1">{errors.codigoLote.message as string}</p>}
              <p className="text-xs text-muted-foreground mt-1">Autogenerado o manual. Único en el sistema.</p>
            </div>
            <div>
              <label htmlFor="lineaGenetica" className="text-sm font-medium">Línea Genética <span className="text-red-500">*</span></label>
              <select id="lineaGenetica" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" {...register("lineaGenetica")}>
                <option value="">Seleccionar...</option>
                <option value="Hy-Line Brown">Hy-Line Brown</option>
                <option value="Hy-Line W36">Hy-Line W36</option>
                <option value="Lohmann LSL">Lohmann LSL</option>
                <option value="Lohmann Brown">Lohmann Brown</option>
                <option value="ISA Brown">ISA Brown</option>
                <option value="Bovans White">Bovans White</option>
              </select>
              {errors.lineaGenetica && <p className="text-sm text-red-600 mt-1">{errors.lineaGenetica.message as string}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="proveedorPollita" className="text-sm font-medium">Proveedor de Pollitas</label>
              <Input id="proveedorPollita" placeholder="Nombre del proveedor" className="mt-1" {...register("proveedorPollita")} />
            </div>
            <div>
              <label htmlFor="costoPollitaUnitario" className="text-sm font-medium">Costo por Pollita ($)</label>
              <Input id="costoPollitaUnitario" type="number" step="0.01" placeholder="Ej: 3850" className="mt-1" {...register("costoPollitaUnitario", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.costoPollitaUnitario && <p className="text-sm text-red-600 mt-1">{errors.costoPollitaUnitario.message as string}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recepción</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="fechaRecepcion" className="text-sm font-medium">Fecha de Recepción <span className="text-red-500">*</span></label>
              <Input id="fechaRecepcion" type="date" className="mt-1" {...register("fechaRecepcion")} />
              {errors.fechaRecepcion && <p className="text-sm text-red-600 mt-1">{errors.fechaRecepcion.message as string}</p>}
            </div>
            <div>
              <label htmlFor="fechaNacimiento" className="text-sm font-medium">Fecha de Nacimiento</label>
              <Input id="fechaNacimiento" type="date" className="mt-1" {...register("fechaNacimiento")} />
              {errors.fechaNacimiento && <p className="text-sm text-red-600 mt-1">{errors.fechaNacimiento.message as string}</p>}
            </div>
            <div>
              <label htmlFor="cantidadInicial" className="text-sm font-medium">Cantidad Inicial <span className="text-red-500">*</span></label>
              <Input id="cantidadInicial" type="number" placeholder="Ej: 5000" className="mt-1" {...register("cantidadInicial", { valueAsNumber: true })} />
              {errors.cantidadInicial && <p className="text-sm text-red-600 mt-1">{errors.cantidadInicial.message as string}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pesoInicialPromedio" className="text-sm font-medium">Peso Inicial Promedio (g)</label>
              <Input id="pesoInicialPromedio" type="number" step="0.1" placeholder="Ej: 35.2" className="mt-1" {...register("pesoInicialPromedio", { setValueAs: v => v === "" ? undefined : Number(v) })} />
              {errors.pesoInicialPromedio && <p className="text-sm text-red-600 mt-1">{errors.pesoInicialPromedio.message as string}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Ubicación</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="seccionId" className="text-sm font-medium">Sección <span className="text-red-500">*</span></label>
              <select id="seccionId" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" {...register("seccionId")}>
                <option value="">Seleccionar...</option>
                {secciones.map(s => (
                  <option key={s.id} value={s.id}>{s.galpon?.nombre || ""} — {s.nombre}</option>
                ))}
              </select>
              {errors.seccionId && <p className="text-sm text-red-600 mt-1">{errors.seccionId.message as string}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Programación Inicial</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">El sistema generará automáticamente la programación según la línea genética seleccionada.</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg border">
              <span className="text-muted-foreground">Próxima vacunación:</span>
              <p className="font-medium mt-1">Semana 1 — Marek + Newcastle</p>
            </div>
            <div className="p-3 rounded-lg border">
              <span className="text-muted-foreground">Cambio a recría:</span>
              <p className="font-medium mt-1">Semana 6 (automático)</p>
            </div>
            <div className="p-3 rounded-lg border">
              <span className="text-muted-foreground">Inicio postura esperado:</span>
              <p className="font-medium mt-1">Semana 18</p>
            </div>
            <div className="p-3 rounded-lg border">
              <span className="text-muted-foreground">Pico de postura esperado:</span>
              <p className="font-medium mt-1">Semana 26-28 (93-95%)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Link href="/lotes">
          <Button variant="outline" type="button">Cancelar</Button>
        </Link>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Crear Lote"}</Button>
      </div>
    </form>
  )
}
