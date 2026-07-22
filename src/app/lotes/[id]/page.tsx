"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface LoteDetail {
  id: string
  codigoLote: string
  lineaGenetica: string
  cantidadInicial: number
  fechaRecepcion: string
  fechaNacimiento: string | null
  pesoInicialPromedio: number | null
  costoPollitaUnitario: number | null
  estado: string
  proveedorPollita: string | null
  seccion?: { nombre: string; galpon?: { nombre: string } }
}

export default function LoteDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [lote, setLote] = useState<LoteDetail | null>(null)
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
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  if (!lote) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Lote no encontrado</p>
        <Link href="/lotes">
          <Button variant="outline" className="mt-4">
            Volver a Lotes
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Lote {lote.codigoLote}</h1>
            <Badge>{lote.estado}</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {lote.lineaGenetica}
            {lote.seccion?.galpon?.nombre && ` · ${lote.seccion.galpon.nombre}`}
            {lote.seccion?.nombre && ` · ${lote.seccion.nombre}`}
          </p>
        </div>
        <Link href="/lotes">
          <Button variant="outline">Volver</Button>
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">
              Aves Iniciales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {lote.cantidadInicial.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">
              Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold capitalize">{lote.estado}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">
              Fecha Recepción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {new Date(lote.fechaRecepcion).toLocaleDateString("es-CL")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">
              Línea Genética
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{lote.lineaGenetica}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Lote</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              {[
                ["Código", lote.codigoLote],
                ["Línea Genética", lote.lineaGenetica],
                ["Proveedor Pollitas", lote.proveedorPollita ?? "—"],
                ["Fecha Recepción", new Date(lote.fechaRecepcion).toLocaleDateString("es-CL")],
                ["Fecha Nacimiento", lote.fechaNacimiento ? new Date(lote.fechaNacimiento).toLocaleDateString("es-CL") : "—"],
                ["Galpón / Sección", lote.seccion?.galpon?.nombre && lote.seccion?.nombre ? `${lote.seccion.galpon.nombre} / ${lote.seccion.nombre}` : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                ["Aves Iniciales", lote.cantidadInicial.toLocaleString()],
                ["Peso Inicial Prom.", lote.pesoInicialPromedio ? `${lote.pesoInicialPromedio} g` : "—"],
                ["Costo Pollita Unit.", lote.costoPollitaUnitario ? `$${lote.costoPollitaUnitario.toLocaleString()}` : "—"],
                ["Estado", lote.estado],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
