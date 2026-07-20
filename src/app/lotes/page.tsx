"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const lotes = [
  { codigo: "H-032", linea: "Hy-Line Brown", galpon: "Galpón 1", seccion: "Fila A", edad: 32, aves: 4885, postura: 92.5, estado: "postura" },
  { codigo: "H-033", linea: "Hy-Line Brown", galpon: "Galpón 1", seccion: "Fila B", edad: 24, aves: 4920, postura: 89.1, estado: "postura" },
  { codigo: "H-034", linea: "Lohmann LSL", galpon: "Galpón 2", seccion: "Ala Norte", edad: 16, aves: 5000, postura: 0, estado: "recria" },
  { codigo: "H-035", linea: "Hy-Line Brown", galpon: "Galpón 2", seccion: "Ala Sur", edad: 52, aves: 4750, postura: 86.2, estado: "postura" },
  { codigo: "H-030", linea: "ISA Brown", galpon: "Galpón 1", seccion: "Fila C", edad: 78, aves: 4200, postura: 78.0, estado: "postura" },
]

export default function LotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Lotes</h1>
          <p className="text-muted-foreground text-sm">Ciclo de vida completo: recepción → cría → recría → postura → descarte</p>
        </div>
        <Button>+ Nuevo Lote</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Lotes Activos</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">5</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Aves</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">23,755</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Edad Promedio</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">40.4 sem</p></CardContent></Card>
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
              {lotes.map((l) => (
                <tr key={l.codigo} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 font-medium">{l.codigo}</td>
                  <td className="p-3">{l.linea}</td>
                  <td className="p-3 text-sm">{l.galpon} / {l.seccion}</td>
                  <td className="p-3">{l.edad} sem</td>
                  <td className="p-3">{l.aves.toLocaleString()}</td>
                  <td className="p-3">{l.postura > 0 ? `${l.postura}%` : "—"}</td>
                  <td className="p-3"><Badge variant={l.estado === "postura" ? "default" : "secondary"}>{l.estado}</Badge></td>
                  <td className="p-3"><Button variant="ghost" size="sm">Ver</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
