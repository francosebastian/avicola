"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })

const TIPO_LABELS: Record<string, string> = {
  postura_1: "Postura",
  postura_2: "Postura",
  recria: "Recría",
  cria: "Cría",
}

type Formula = { id: string; nombre: string; tipoAlimento: string; costoKgEstimado: number | null; proteinaBruta: number | null; energiaMetabolizable: number | null; activo: boolean }
type Resumen = { fecha: string | null; consumoHoyKg: number; huevosHoy: number; avesHoy: number; costoKg: number; costoHuevoCLP: number; conversion: number; kgPor100Aves: number }
type RegistroRow = { id: string; fecha: string; seccion: string; tipo: string; kg: number; costo: number }
type SerieItem = { dia: string; kg: number }

function fmtDia(fecha: string) {
  const d = new Date(fecha + "T00:00:00")
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short" })
}

export default function AlimentacionPage() {
  const [serie, setSerie] = useState<SerieItem[]>([])
  const [registros, setRegistros] = useState<RegistroRow[]>([])
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [formulas, setFormulas] = useState<Formula[]>([])
  const [editFormula, setEditFormula] = useState<Formula | null>(null)
  const [editCosto, setEditCosto] = useState("")
  const [guardando, setGuardando] = useState(false)
  const [crearOpen, setCrearOpen] = useState(false)
  const [nueva, setNueva] = useState({ nombre: "", tipoAlimento: "", costoKg: "", proteina: "", energia: "" })
  const [ingredientes, setIngredientes] = useState<{ ingrediente: string; porcentaje: string }[]>([]) 

  function cargarDatos() {
    return fetch("/api/alimentacion/metricas")
      .then(r => r.json())
      .then(j => {
        setSerie((j.serie || []) as SerieItem[])
        setRegistros((j.registros || []) as RegistroRow[])
        setResumen((j.resumen || null) as Resumen | null)
        setFormulas((j.formulas || []) as Formula[])
      })
  }

  useEffect(() => {
    let cancelled = false
    cargarDatos()
      .catch(() => { if (!cancelled) toast.error("Error al cargar datos") })
    return () => { cancelled = true }
  }, [])

  function abrirEdicion(f: Formula) {
    setEditFormula(f)
    setEditCosto(String(f.costoKgEstimado ?? ""))
  }

  async function guardarCosto() {
    if (!editFormula) return
    const valor = Number(editCosto)
    if (!(valor >= 0)) {
      toast.error("Ingrese un costo válido en CLP")
      return
    }
    setGuardando(true)
    try {
      const res = await fetch(`/api/alimentacion/formulas/${editFormula.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ costoKgEstimado: valor }),
      })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || "Error al guardar")
        return
      }
      toast.success("Costo actualizado")
      setEditFormula(null)
      await cargarDatos().catch(() => toast.error("Error al recargar datos"))
    } finally {
      setGuardando(false)
    }
  }

  function abrirCrear() {
    setNueva({ nombre: "", tipoAlimento: "", costoKg: "", proteina: "", energia: "" })
    setIngredientes([{ ingrediente: "", porcentaje: "" }])
    setCrearOpen(true)
  }

  async function crearFormula() {
    if (!nueva.nombre.trim()) {
      toast.error("Ingrese el nombre de la fórmula")
      return
    }
    const costo = nueva.costoKg === "" ? null : Number(nueva.costoKg)
    if (nueva.costoKg !== "" && !(Number(nueva.costoKg) >= 0)) {
      toast.error("Costo inválido")
      return
    }
    const ingredientesValidos = ingredientes
      .map(i => ({ ingrediente: i.ingrediente.trim(), porcentaje: Number(i.porcentaje) }))
      .filter(i => i.ingrediente && i.porcentaje > 0)
    if (ingredientesValidos.length === 0) {
      toast.error("Agregue al menos un ingrediente con porcentaje")
      return
    }
    setGuardando(true)
    try {
      const res = await fetch("/api/alimentacion/formulas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nueva.nombre.trim(),
          tipoAlimento: nueva.tipoAlimento || "postura_1",
          costoKgEstimado: costo,
          proteinaBruta: nueva.proteina === "" ? null : Number(nueva.proteina),
          energiaMetabolizable: nueva.energia === "" ? null : Number(nueva.energia),
          ingredientes: ingredientesValidos,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || "Error al crear fórmula")
        return
      }
      toast.success("Fórmula creada")
      setCrearOpen(false)
      await cargarDatos().catch(() => toast.error("Error al recargar datos"))
    } finally {
      setGuardando(false)
    }
  }

  const chartData = serie.map(s => ({ dia: fmtDia(s.dia), kg: s.kg }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alimentación y Nutrición</h1>
          <p className="text-muted-foreground text-sm">Monitoreo de consumo de alimento y formulación de raciones</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Consumo Hoy</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{resumen ? `${resumen.consumoHoyKg.toLocaleString()} kg` : "—"}</p>
            <p className="text-xs text-muted-foreground">{resumen ? `${resumen.kgPor100Aves} kg/100 aves` : ""}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Costo Alimento / Huevo</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{resumen ? clp.format(resumen.costoHuevoCLP) : "—"}</p>
            <p className="text-xs text-muted-foreground">{resumen ? `Alimento: ${clp.format(resumen.costoKg)}/kg` : ""}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Conversión Alimenticia</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">{resumen ? resumen.conversion.toFixed(2) : "—"}</p>
            <p className="text-xs text-muted-foreground">kg alimento / kg huevo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Consumo Diario de Alimento (7 días)</CardTitle></CardHeader>
        <CardContent>
          {serie.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Sin consumo registrado en el período.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis unit=" kg" />
                <Tooltip formatter={(v) => `${v} kg`} />
                <Bar dataKey="kg" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Fórmulas de Alimento</CardTitle>
              <Button variant="outline" size="sm" onClick={abrirCrear}>+ Nueva Fórmula</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-3 font-medium">Nombre</th><th className="p-3 font-medium">Tipo</th><th className="p-3 font-medium">Costo/kg (CLP)</th><th className="p-3 font-medium">Proteína</th><th className="p-3 font-medium">Energía</th><th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {formulas.map(f => (
                  <tr key={f.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 font-medium">{f.nombre}</td>
                    <td className="p-3"><Badge variant="secondary">{TIPO_LABELS[f.tipoAlimento] || f.tipoAlimento}</Badge></td>
                    <td className="p-3">{clp.format(Number(f.costoKgEstimado) || 0)}</td>
                    <td className="p-3">{f.proteinaBruta != null ? `${f.proteinaBruta}%` : "—"}</td>
                    <td className="p-3">{f.energiaMetabolizable != null ? `${f.energiaMetabolizable.toLocaleString()} kcal` : "—"}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" onClick={() => abrirEdicion(f)}>
                        <Pencil className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {formulas.length === 0 && (
                  <tr><td colSpan={6} className="p-6 text-center text-sm text-muted-foreground">Sin fórmulas registradas.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Registro de Consumo Diario</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Sección</th><th className="p-3 font-medium">Fórmula</th><th className="p-3 font-medium">Cantidad</th><th className="p-3 font-medium">Costo (CLP)</th>
                </tr>
              </thead>
              <tbody>
                {registros.map(r => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 text-sm">{fmtDia(r.fecha)}</td>
                    <td className="p-3">{r.seccion}</td>
                    <td className="p-3 text-sm">{r.tipo}</td>
                    <td className="p-3">{r.kg.toLocaleString()} kg</td>
                    <td className="p-3">{clp.format(r.costo)}</td>
                  </tr>
                ))}
                {registros.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">Sin consumo registrado.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editFormula} onOpenChange={(o) => { if (!o) setEditFormula(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Costo de Alimento</DialogTitle></DialogHeader>
          <div className="space-y-2 text-sm">
            <p className="font-medium">{editFormula?.nombre}</p>
            <label className="text-sm font-medium">Costo por kg (CLP)</label>
            <Input type="number" step="1" min={0} value={editCosto} onChange={(e) => setEditCosto(e.target.value)} />
            <p className="text-xs text-muted-foreground">Este valor se usa para calcular el costo alimento/huevo.</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditFormula(null)}>Cancelar</Button>
            <Button onClick={guardarCosto} disabled={guardando}>{guardando ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={crearOpen} onOpenChange={(o) => { if (!o) setCrearOpen(false) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Nueva Fórmula de Alimento</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-sm font-medium">Nombre <span className="text-red-500">*</span></label>
              <Input className="mt-1" value={nueva.nombre} onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} placeholder="Ej: Postura Fase 2 — Hy-Line Brown" />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo de Alimento</label>
              <select className="w-full mt-1 rounded-md border p-2 text-sm bg-background" value={nueva.tipoAlimento} onChange={(e) => setNueva({ ...nueva, tipoAlimento: e.target.value })}>
                <option value="postura_1">Postura</option>
                <option value="recria">Recría</option>
                <option value="cria">Cría</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Costo por kg (CLP)</label>
              <Input type="number" step="1" min={0} className="mt-1" value={nueva.costoKg} onChange={(e) => setNueva({ ...nueva, costoKg: e.target.value })} placeholder="Ej: 385" />
            </div>
            <div>
              <label className="text-sm font-medium">Proteína Bruta (%)</label>
              <Input type="number" step="0.1" className="mt-1" value={nueva.proteina} onChange={(e) => setNueva({ ...nueva, proteina: e.target.value })} placeholder="Ej: 17.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Energía Metabolizable (kcal)</label>
              <Input type="number" className="mt-1" value={nueva.energia} onChange={(e) => setNueva({ ...nueva, energia: e.target.value })} placeholder="Ej: 2850" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Ingredientes (insumos de fábrica)</label>
              <Button variant="outline" size="sm" onClick={() => setIngredientes([...ingredientes, { ingrediente: "", porcentaje: "" }])}>+ Agregar</Button>
            </div>
            <div className="space-y-2">
              {ingredientes.map((ing, i) => (
                <div key={i} className="grid grid-cols-[1fr_140px_auto] gap-2">
                  <Input placeholder="Ingrediente (ej: Maíz)" value={ing.ingrediente} onChange={(e) => setIngredientes(ingredientes.map((x, j) => j === i ? { ...x, ingrediente: e.target.value } : x))} />
                  <Input type="number" step="0.1" min={0} placeholder="%" value={ing.porcentaje} onChange={(e) => setIngredientes(ingredientes.map((x, j) => j === i ? { ...x, porcentaje: e.target.value } : x))} />
                  <Button variant="ghost" size="sm" disabled={ingredientes.length === 1} onClick={() => setIngredientes(ingredientes.filter((_, j) => j !== i))}>✕</Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Los porcentajes deben sumar 100.</p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCrearOpen(false)}>Cancelar</Button>
            <Button onClick={crearFormula} disabled={guardando}>{guardando ? "Guardando..." : "Crear Fórmula"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
