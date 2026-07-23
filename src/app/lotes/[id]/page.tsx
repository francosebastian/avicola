"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import Link from "next/link"

interface LoteFull {
  id: string
  codigoLote: string
  lineaGenetica: string
  proveedorPollita: string | null
  cantidadInicial: number
  fechaRecepcion: string
  fechaNacimiento: string | null
  pesoInicialPromedio: number | null
  costoPollitaUnitario: number | null
  estado: string
  galpon: string | null
  seccion: string | null
  edadSemanas: number
  avesVivas: number
  postura: number
  mortalidadAcumulada: number
  huevosTotales: number
  huevosPorAve: number
  eventos: Array<{ id: string; tipoEvento: string; fecha: string; descripcion: string | null; createdBy: string | null }>
}

const posturaCurva = [
  { semana: 18, real: 5, teorica: 5 }, { semana: 20, real: 50, teorica: 48 },
  { semana: 22, real: 85, teorica: 82 }, { semana: 24, real: 92, teorica: 90 },
  { semana: 26, real: 93, teorica: 92 }, { semana: 28, real: 91, teorica: 92 },
  { semana: 30, real: 89, teorica: 91 }, { semana: 32, real: 90, teorica: 90 },
]

export default function LoteDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [lote, setLote] = useState<LoteFull | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/lotes/${id}`)
      .then((r) => r.json())
      .then(setLote)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-72 rounded-lg" />
          <Skeleton className="h-72 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!lote) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Lote no encontrado</p>
        <Link href="/lotes"><Button variant="outline" className="mt-4">Volver a Lotes</Button></Link>
      </div>
    )
  }

  const estadoLabel =
    lote.estado === "postura" ? `Postura (sem 18-90)` :
    lote.estado === "recria" ? `Recría` :
    lote.estado === "cria" ? `Cría` :
    lote.estado === "descarte" ? `Descarte` :
    lote.estado === "cerrado" ? `Cerrado` : lote.estado

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Lote {lote.codigoLote}</h1>
            <Badge className="text-sm">{lote.estado}</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {lote.lineaGenetica}
            {lote.galpon && lote.seccion ? ` · ${lote.galpon} · ${lote.seccion} · ${lote.edadSemanas} semanas` : ` · ${lote.edadSemanas} semanas`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/produccion?loteId=${lote.id}`}>
            <Button variant="outline">Registro Diario</Button>
          </Link>
          <Link href={`/lotes/${lote.id}/eventos`}>
            <Button variant="outline">Eventos</Button>
          </Link>
          <Link href={`/finanzas?loteId=${lote.id}`}>
            <Button>Resumen Económico</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Aves Iniciales</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{lote.cantidadInicial.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Aves Vivas</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{lote.avesVivas.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Postura</CardTitle></CardHeader><CardContent><p className={`text-xl font-bold ${lote.postura >= 90 ? "text-green-700" : "text-amber-600"}`}>{lote.postura}%</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Mortalidad Acum.</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{lote.mortalidadAcumulada}%</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Huevos Totales</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{lote.huevosTotales.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Huevos/Ave Alojada</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{lote.huevosPorAve}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Curva de Postura</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={posturaCurva}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="teorica" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Teórica" />
                <Line type="monotone" dataKey="real" stroke="#166534" strokeWidth={3} name="Real" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Mortalidad Semanal</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { semana: 18, bajas: 12 }, { semana: 20, bajas: 8 }, { semana: 22, bajas: 5 },
                { semana: 24, bajas: 4 }, { semana: 26, bajas: 3 }, { semana: 28, bajas: 6 },
                { semana: 30, bajas: 4 }, { semana: 32, bajas: 3 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bajas" fill="#ef4444" radius={[4, 4, 0, 0]} name="Bajas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Información del Lote</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                ["Código", lote.codigoLote],
                ["Línea Genética", lote.lineaGenetica],
                ["Proveedor Pollitas", lote.proveedorPollita ?? "—"],
                ["Fecha Recepción", new Date(lote.fechaRecepcion).toLocaleDateString("es-CL")],
                ["Fecha Nacimiento", lote.fechaNacimiento ? new Date(lote.fechaNacimiento).toLocaleDateString("es-CL") : "—"],
                ["Edad Actual", `${lote.edadSemanas} semanas`],
                ["Galpón / Sección", lote.galpon && lote.seccion ? `${lote.galpon} / ${lote.seccion}` : "—"],
                ["Costo Pollita Unitario", lote.costoPollitaUnitario ? `$${Number(lote.costoPollitaUnitario).toLocaleString()}` : "—"],
                ["Estado", estadoLabel],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Eventos del Lote</CardTitle></CardHeader>
          <CardContent>
            {lote.eventos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Sin eventos registrados</p>
            ) : (
              <div className="space-y-3">
                {lote.eventos.map((e) => (
                  <div key={e.id} className="flex justify-between items-center p-2 rounded-lg border text-sm">
                    <div>
                      <span className="font-medium capitalize">{e.tipoEvento.replace(/_/g, " ")}</span>
                      {e.descripcion && <p className="text-xs text-muted-foreground">{e.descripcion}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(e.fecha).toLocaleDateString("es-CL")}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
