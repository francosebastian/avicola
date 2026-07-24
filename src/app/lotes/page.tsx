"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface LoteRow {
  id: string
  codigoLote: string
  lineaGenetica: string
  cantidadInicial: number
  estado: string
  edadSemanas: number
  postura: number
  galpon: string | null
  seccion: string | null
}

export default function LotesPage() {
  const [lotes, setLotes] = useState<LoteRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/lotes")
      .then((r) => r.json())
      .then((res) => setLotes(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const activos = lotes.filter((l) => l.estado !== "cerrado")
  const totalAves = lotes.reduce((s, l) => s + l.cantidadInicial, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Lotes</h1>
          <p className="text-muted-foreground text-sm">
            Ciclo de vida completo: recepción → cría → recría → postura → descarte
          </p>
        </div>
        <Link href="/lotes/nuevo">
          <Button>+ Nuevo Lote</Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Lotes Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activos.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Aves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalAves.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Edad Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {lotes.length > 0
                ? Math.round(lotes.reduce((s, l) => s + l.edadSemanas, 0) / lotes.length) + " sem"
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Código</th>
                <th className="p-3 font-medium">Línea Genética</th>
                <th className="p-3 font-medium">Galpón / Sección</th>
                <th className="p-3 font-medium">Edad</th>
                <th className="p-3 font-medium">Aves</th>
                <th className="p-3 font-medium">Postura</th>
                <th className="p-3 font-medium">Estado</th>
                <th className="p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {lotes.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-muted-foreground">
                    No hay lotes registrados
                  </td>
                </tr>
              )}
              {lotes.map((l) => (
                <tr key={l.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 font-medium">{l.codigoLote}</td>
                  <td className="p-3">{l.lineaGenetica}</td>
                  <td className="p-3 text-sm">
                    {l.galpon && l.seccion ? `${l.galpon} / ${l.seccion}` : "—"}
                  </td>
                  <td className="p-3">{l.edadSemanas} sem</td>
                  <td className="p-3">{l.cantidadInicial.toLocaleString()}</td>
                  <td className="p-3">
                    {l.postura > 0 ? `${l.postura}%` : "—"}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        l.estado === "postura" ? "default" :
                        l.estado === "recepcion" || l.estado === "cria" ? "secondary" :
                        l.estado === "recria" ? "outline" :
                        l.estado === "descarte" ? "destructive" : "secondary"
                      }
                    >
                      {l.estado}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Link href={`/lotes/${l.id}`}>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
