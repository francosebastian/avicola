"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createRegistroVacunacionSchema, createRegistroTratamientoSchema } from "@/lib/validations/sanidad"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Lote = { id: string; codigoLote: string; lineaGenetica: string }

const tratamientos = [
  { tipo: "Vacunación", lote: "H-032", desc: "Newcastle + Bronquitis", fecha: "15 Jul 2026", via: "Ocular", retiro: "—", estado: "completado" },
  { tipo: "Tratamiento", lote: "H-033", desc: "Amoxicilina 20%", fecha: "18-22 Jul 2026", via: "Agua bebida", retiro: "5 días (27 Jul)", estado: "activo" },
  { tipo: "Vacunación", lote: "H-034", desc: "Enfermedad de Marek", fecha: "Programada: 01 Ago", via: "SC", retiro: "—", estado: "programada" },
]

export default function SanidadPage() {
  const router = useRouter()
  const [lotes, setLotes] = useState<Lote[]>([])
  const [vacDialogOpen, setVacDialogOpen] = useState(false)
  const [traDialogOpen, setTraDialogOpen] = useState(false)

  const vacForm = useForm({ resolver: zodResolver(createRegistroVacunacionSchema) })
  const traForm = useForm({ resolver: zodResolver(createRegistroTratamientoSchema) })

  useEffect(() => {
    fetch("/api/lotes").then(r => r.json())
      .then(data => setLotes(data.data || data || []))
      .catch(() => {})
  }, [])

  async function onVacSubmit(data: any) {
    const res = await fetch("/api/sanidad/vacunacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Error al registrar vacunación")
      return
    }
    toast.success("Vacunación registrada correctamente")
    vacForm.reset()
    setVacDialogOpen(false)
    router.refresh()
  }

  async function onTraSubmit(data: any) {
    const res = await fetch("/api/sanidad/tratamientos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Error al registrar tratamiento")
      return
    }
    toast.success("Tratamiento registrado correctamente")
    traForm.reset()
    setTraDialogOpen(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Módulo Sanitario y Bioseguridad</h1>
          <p className="text-muted-foreground text-sm">Vacunación, tratamientos, necropsias y control de accesos</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={vacDialogOpen} onOpenChange={setVacDialogOpen}>
            <DialogTrigger>
              <Button variant="outline" type="button">Registrar Vacunación</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Registrar Vacunación</DialogTitle></DialogHeader>
              <form onSubmit={vacForm.handleSubmit(onVacSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="vac-loteId" className="text-sm font-medium">Lote</label>
                  <select id="vac-loteId" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" {...vacForm.register("loteId")}>
                    <option value="">Seleccionar...</option>
                    {lotes.map(l => <option key={l.id} value={l.id}>{l.codigoLote} — {l.lineaGenetica}</option>)}
                  </select>
                  {vacForm.formState.errors.loteId && <p className="text-sm text-red-600 mt-1">{vacForm.formState.errors.loteId.message as string}</p>}
                </div>
                <div>
                  <label htmlFor="vac-tipoVacuna" className="text-sm font-medium">Tipo de Vacuna</label>
                  <Input id="vac-tipoVacuna" className="mt-1" {...vacForm.register("tipoVacuna")} />
                  {vacForm.formState.errors.tipoVacuna && <p className="text-sm text-red-600 mt-1">{vacForm.formState.errors.tipoVacuna.message as string}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vac-fechaAplicacion" className="text-sm font-medium">Fecha Aplicación</label>
                    <Input id="vac-fechaAplicacion" type="date" className="mt-1" {...vacForm.register("fechaAplicacion")} />
                    {vacForm.formState.errors.fechaAplicacion && <p className="text-sm text-red-600 mt-1">{vacForm.formState.errors.fechaAplicacion.message as string}</p>}
                  </div>
                  <div>
                    <label htmlFor="vac-viaAplicacion" className="text-sm font-medium">Vía</label>
                    <select id="vac-viaAplicacion" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" {...vacForm.register("viaAplicacion")}>
                      <option value="">Seleccionar...</option>
                      <option value="ocular">Ocular</option>
                      <option value="im">IM</option>
                      <option value="sc">SC</option>
                      <option value="agua_bebida">Agua de bebida</option>
                      <option value="subcutanea">Subcutánea</option>
                    </select>
                    {vacForm.formState.errors.viaAplicacion && <p className="text-sm text-red-600 mt-1">{vacForm.formState.errors.viaAplicacion.message as string}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vac-dosisMl" className="text-sm font-medium">Dosis (ml)</label>
                    <Input id="vac-dosisMl" type="number" step="0.1" className="mt-1" {...vacForm.register("dosisMl", { setValueAs: v => v === "" ? undefined : Number(v) })} />
                  </div>
                  <div>
                    <label htmlFor="vac-loteVacuna" className="text-sm font-medium">Lote Vacuna</label>
                    <Input id="vac-loteVacuna" className="mt-1" {...vacForm.register("loteVacuna")} />
                  </div>
                </div>
                <div>
                  <label htmlFor="vac-proveedorVacuna" className="text-sm font-medium">Proveedor</label>
                  <Input id="vac-proveedorVacuna" className="mt-1" {...vacForm.register("proveedorVacuna")} />
                </div>
                <div>
                  <label htmlFor="vac-aplicadoPor" className="text-sm font-medium">Aplicado por</label>
                  <Input id="vac-aplicadoPor" className="mt-1" {...vacForm.register("aplicadoPor")} />
                </div>
                <div>
                  <label htmlFor="vac-observaciones" className="text-sm font-medium">Observaciones</label>
                  <textarea id="vac-observaciones" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" rows={2} {...vacForm.register("observaciones")} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setVacDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={vacForm.formState.isSubmitting}>
                    {vacForm.formState.isSubmitting ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={traDialogOpen} onOpenChange={setTraDialogOpen}>
            <DialogTrigger>
              <Button variant="outline" type="button">Registrar Tratamiento</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Registrar Tratamiento</DialogTitle></DialogHeader>
              <form onSubmit={traForm.handleSubmit(onTraSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="tra-loteId" className="text-sm font-medium">Lote</label>
                  <select id="tra-loteId" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" {...traForm.register("loteId")}>
                    <option value="">Seleccionar...</option>
                    {lotes.map(l => <option key={l.id} value={l.id}>{l.codigoLote} — {l.lineaGenetica}</option>)}
                  </select>
                  {traForm.formState.errors.loteId && <p className="text-sm text-red-600 mt-1">{traForm.formState.errors.loteId.message as string}</p>}
                </div>
                <div>
                  <label htmlFor="tra-medicamento" className="text-sm font-medium">Medicamento</label>
                  <Input id="tra-medicamento" className="mt-1" {...traForm.register("medicamento")} />
                  {traForm.formState.errors.medicamento && <p className="text-sm text-red-600 mt-1">{traForm.formState.errors.medicamento.message as string}</p>}
                </div>
                <div>
                  <label htmlFor="tra-principioActivo" className="text-sm font-medium">Principio Activo</label>
                  <Input id="tra-principioActivo" className="mt-1" {...traForm.register("principioActivo")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tra-fechaInicio" className="text-sm font-medium">Fecha Inicio</label>
                    <Input id="tra-fechaInicio" type="date" className="mt-1" {...traForm.register("fechaInicio")} />
                    {traForm.formState.errors.fechaInicio && <p className="text-sm text-red-600 mt-1">{traForm.formState.errors.fechaInicio.message as string}</p>}
                  </div>
                  <div>
                    <label htmlFor="tra-fechaFin" className="text-sm font-medium">Fecha Fin</label>
                    <Input id="tra-fechaFin" type="date" className="mt-1" {...traForm.register("fechaFin")} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tra-dosis" className="text-sm font-medium">Dosis</label>
                    <Input id="tra-dosis" type="number" step="0.1" className="mt-1" {...traForm.register("dosis", { setValueAs: v => v === "" ? undefined : Number(v) })} />
                  </div>
                  <div>
                    <label htmlFor="tra-viaAplicacion" className="text-sm font-medium">Vía de Aplicación</label>
                    <Input id="tra-viaAplicacion" className="mt-1" {...traForm.register("viaAplicacion")} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tra-periodoRetiroHoras" className="text-sm font-medium">Período Retiro (horas)</label>
                    <Input id="tra-periodoRetiroHoras" type="number" className="mt-1" {...traForm.register("periodoRetiroHoras", { setValueAs: v => v === "" ? undefined : Number(v) })} />
                  </div>
                  <div>
                    <label htmlFor="tra-responsable" className="text-sm font-medium">Responsable</label>
                    <Input id="tra-responsable" className="mt-1" {...traForm.register("responsable")} />
                  </div>
                </div>
                <div>
                  <label htmlFor="tra-motivo" className="text-sm font-medium">Motivo</label>
                  <textarea id="tra-motivo" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" rows={2} {...traForm.register("motivo")} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setTraDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={traForm.formState.isSubmitting}>
                    {traForm.formState.isSubmitting ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button>+ Necropsia</Button>
        </div>
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardHeader><CardTitle className="text-red-700 flex items-center gap-2">Período de Retiro Activo</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-red-600"><strong>Lote H-033</strong> — Tratamiento con Amoxicilina finaliza el 22 Jul. Periodo de retiro de huevos hasta el <strong>27 Jul 2026</strong>.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Registro de Vacunaciones y Tratamientos</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Tipo</th><th className="p-3 font-medium">Lote</th><th className="p-3 font-medium">Producto</th>
                <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Vía</th><th className="p-3 font-medium">Fin Retiro</th><th className="p-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {tratamientos.map((t, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3"><Badge variant={t.tipo === "Vacunación" ? "secondary" : "default"}>{t.tipo}</Badge></td>
                  <td className="p-3 font-medium">{t.lote}</td>
                  <td className="p-3">{t.desc}</td>
                  <td className="p-3 text-sm">{t.fecha}</td>
                  <td className="p-3 text-sm">{t.via}</td>
                  <td className="p-3 text-sm">{t.retiro}</td>
                  <td className="p-3"><Badge variant={t.estado === "activo" ? "destructive" : t.estado === "programada" ? "outline" : "secondary"}>{t.estado}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Necropsias Recientes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[1,2,3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">Lote H-032 — {["Colibacilosis", "Ascitis", "Síndrome de mala absorción"][i-1]}</p>
                  <p className="text-xs text-muted-foreground">{["15 Jul", "12 Jul", "08 Jul"][i-1]} &bull; {["3", "2", "5"][i-1]} aves</p>
                </div>
                <Button type="button" variant="ghost" size="sm">Ver</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Últimas Visitas Registradas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg border">
              <div><p className="font-medium text-sm">Juan Pérez — NutriAVES S.A.</p><p className="text-xs text-muted-foreground">Hoy 10:30 &bull; Vehículo: ABC-123 &bull; Desinfectado</p></div>
              <Badge variant="outline" className="text-green-600">Cuarentena OK</Badge>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg border">
              <div><p className="font-medium text-sm">María García — Veterinaria Campo</p><p className="text-xs text-muted-foreground">18 Jul 15:00 &bull; Última visita otra granja: 17 Jul</p></div>
              <Badge variant="destructive">Cuarentena &lt;48h</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
