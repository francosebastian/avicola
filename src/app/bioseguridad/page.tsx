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
import { createRegistroVisitaSchema, createChecklistBioseguridadSchema } from "@/lib/validations/bioseguridad"
import { Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Galpon = { id: string; nombre: string }

const visitas = [
  { nombre: "Juan Pérez", empresa: "NutriAVES S.A.", fecha: "20 Jul 2026", vehiculo: "ABC-123", cuarentena: "ok", desinfectado: true },
  { nombre: "María García", empresa: "Veterinaria Campo", fecha: "18 Jul 2026", vehiculo: "DEF-456", cuarentena: "peligro", desinfectado: true },
  { nombre: "Carlos López", empresa: "INTA", fecha: "15 Jul 2026", vehiculo: "GHI-789", cuarentena: "ok", desinfectado: true },
  { nombre: "Ana Martínez", empresa: "Distribuidora Avícola S.A.", fecha: "14 Jul 2026", vehiculo: "JKL-012", cuarentena: "ok", desinfectado: true },
  { nombre: "Pedro Sánchez", empresa: "Fábrica de Alimentos", fecha: "12 Jul 2026", vehiculo: "MNO-345", cuarentena: "pendiente", desinfectado: false },
]

const items = [
  { key: "pediluviosActivos", label: "Pediluvios con desinfectante" },
  { key: "cortinasBuenEstado", label: "Cortinas sanitarias operativas" },
  { key: "mallasAvesSilvestres", label: "Mallas antipájaros intactas" },
  { key: "ausenciaRoedores", label: "Sin evidencia de roedores" },
  { key: "ausenciaMoscasExcesivas", label: "Control de moscas activo" },
  { key: "rodaluvioFuncional", label: "Rodaluvio funcional" },
  { key: "cercoPerimetralIntacto", label: "Cerco perimetral en buen estado" },
]

export default function BioseguridadPage() {
  const router = useRouter()
  const [galpones, setGalpones] = useState<Galpon[]>([])
  const [selectedGalpon, setSelectedGalpon] = useState("")
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({})
  const [visitaOpen, setVisitaOpen] = useState(false)

  const visitaForm = useForm({ resolver: zodResolver(createRegistroVisitaSchema) })

  useEffect(() => {
    fetch("/api/galpones").then(r => r.json())
      .then(data => setGalpones(data.data || data || []))
      .catch(() => {})
  }, [])

  function toggleCheck(item: string) {
    setChecklistState(prev => ({ ...prev, [item]: !prev[item] }))
  }

  async function onSubmitChecklist() {
    if (!selectedGalpon) {
      toast.error("Seleccione un galpón")
      return
    }
    const body = {
      galponId: selectedGalpon,
      fecha: new Date().toISOString().split("T")[0],
      ...checklistState,
    }

    const res = await fetch("/api/bioseguridad/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Error al guardar checklist")
      return
    }

    toast.success("Checklist guardado correctamente")
    router.refresh()
  }

  async function onVisitaSubmit(data: any) {
    const res = await fetch("/api/bioseguridad/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Error al registrar visita")
      return
    }
    toast.success("Visita registrada correctamente")
    visitaForm.reset()
    setVisitaOpen(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bioseguridad y Accesos</h1>
          <p className="text-muted-foreground text-sm">Control de visitas y checklist diario de bioseguridad</p>
        </div>
        <Dialog open={visitaOpen} onOpenChange={setVisitaOpen}>
          <DialogTrigger>
            <Button type="button">Registrar Visita</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Registrar Visita</DialogTitle></DialogHeader>
            <form onSubmit={visitaForm.handleSubmit(onVisitaSubmit)} className="space-y-4">
              <div>
                <label htmlFor="vis-visitanteNombre" className="text-sm font-medium">Nombre del Visitante</label>
                <Input id="vis-visitanteNombre" className="mt-1" {...visitaForm.register("visitanteNombre")} />
                {visitaForm.formState.errors.visitanteNombre && <p className="text-sm text-red-600 mt-1">{visitaForm.formState.errors.visitanteNombre.message as string}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vis-visitanteEmpresa" className="text-sm font-medium">Empresa</label>
                  <Input id="vis-visitanteEmpresa" className="mt-1" {...visitaForm.register("visitanteEmpresa")} />
                </div>
                <div>
                  <label htmlFor="vis-visitanteRut" className="text-sm font-medium">RUT</label>
                  <Input id="vis-visitanteRut" className="mt-1" {...visitaForm.register("visitanteRut")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vis-ultimaVisitaOtraGranja" className="text-sm font-medium">Última Visita Otra Granja</label>
                  <Input id="vis-ultimaVisitaOtraGranja" type="date" className="mt-1" {...visitaForm.register("ultimaVisitaOtraGranja")} />
                </div>
                <div>
                  <label htmlFor="vis-vehiculoPlaca" className="text-sm font-medium">Vehículo / Placa</label>
                  <Input id="vis-vehiculoPlaca" className="mt-1" {...visitaForm.register("vehiculoPlaca")} />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...visitaForm.register("periodoCuarentenaCumplido")} />
                  Cuarentena cumplida
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...visitaForm.register("vehiculoDesinfectado")} />
                  Vehículo desinfectado
                </label>
              </div>
              <div>
                <label htmlFor="vis-autorizadoPor" className="text-sm font-medium">Autorizado por</label>
                <Input id="vis-autorizadoPor" className="mt-1" {...visitaForm.register("autorizadoPor")} />
              </div>
              <div>
                <label htmlFor="vis-observaciones" className="text-sm font-medium">Observaciones</label>
                <textarea id="vis-observaciones" className="w-full mt-1 rounded-md border p-2 text-sm bg-background" rows={2} {...visitaForm.register("observaciones")} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setVisitaOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={visitaForm.formState.isSubmitting}>
                  {visitaForm.formState.isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Registro de Visitas</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Nombre</th><th className="p-3 font-medium">Empresa</th><th className="p-3 font-medium">Fecha</th>
                <th className="p-3 font-medium">Vehículo</th><th className="p-3 font-medium">Cuarentena</th><th className="p-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {visitas.map((v, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 font-medium">{v.nombre}</td>
                  <td className="p-3 text-sm">{v.empresa}</td>
                  <td className="p-3 text-sm">{v.fecha}</td>
                  <td className="p-3 text-sm">{v.vehiculo} {v.desinfectado ? "✓" : "✗"}</td>
                  <td className="p-3">
                    <Badge variant={v.cuarentena === "ok" ? "secondary" : v.cuarentena === "peligro" ? "destructive" : "outline"}>
                      {v.cuarentena === "ok" ? "Cuarentena OK" : v.cuarentena === "peligro" ? "<48h" : "Pendiente"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Button type="button" variant="ghost" size="sm">Ver</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Checklist Diario de Bioseguridad por Galpón</CardTitle>
            <div className="flex items-center gap-2">
              <select
                className="rounded-md border p-2 text-sm bg-background"
                value={selectedGalpon}
                onChange={(e) => {
                  setSelectedGalpon(e.target.value)
                  setChecklistState({})
                }}
              >
                <option value="">Seleccionar galpón...</option>
                {galpones.map(g => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))}
              </select>
              <Button type="button" disabled={!selectedGalpon} onClick={onSubmitChecklist}>Guardar Checklist</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedGalpon ? (
            <p className="text-sm text-muted-foreground text-center py-4">Seleccione un galpón para comenzar el checklist</p>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                  <span className="text-sm">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => toggleCheck(item.key)}
                    className={`inline-flex size-8 items-center justify-center rounded-md border transition-colors cursor-pointer ${
                      checklistState[item.key]
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {checklistState[item.key] ? <Check className="size-4" /> : <X className="size-3 text-gray-400" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
