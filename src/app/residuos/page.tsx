"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const gallinazaData = [
  { fecha: "20 Jul 2026", tipo: "Gallinaza húmeda", cantidad: 0.8, disposicion: "Venta a productor", ingreso: 24.00 },
  { fecha: "18 Jul 2026", tipo: "Gallinaza seca", cantidad: 1.2, disposicion: "Venta a productor", ingreso: 60.00 },
  { fecha: "15 Jul 2026", tipo: "Gallinaza húmeda", cantidad: 0.9, disposicion: "Compostaje", ingreso: 0 },
  { fecha: "13 Jul 2026", tipo: "Gallinaza seca", cantidad: 1.0, disposicion: "Venta a productor", ingreso: 50.00 },
  { fecha: "10 Jul 2026", tipo: "Gallinaza húmeda", cantidad: 0.7, disposicion: "Compostaje", ingreso: 0 },
  { fecha: "08 Jul 2026", tipo: "Gallinaza seca", cantidad: 1.1, disposicion: "Venta a productor", ingreso: 55.00 },
  { fecha: "05 Jul 2026", tipo: "Gallinaza húmeda", cantidad: 0.85, disposicion: "Venta a productor", ingreso: 25.50 },
]

const avesMuertasData = [
  { fecha: "20 Jul 2026", tipo: "Mortalidad rutina", cantidad: 3, disposicion: "Compostaje", costo: 0 },
  { fecha: "19 Jul 2026", tipo: "Mortalidad rutina", cantidad: 2, disposicion: "Compostaje", costo: 0 },
  { fecha: "18 Jul 2026", tipo: "Sacrificio sanitario", cantidad: 5, disposicion: "Incinaración", costo: 15.00 },
  { fecha: "17 Jul 2026", tipo: "Mortalidad rutina", cantidad: 4, disposicion: "Compostaje", costo: 0 },
  { fecha: "15 Jul 2026", tipo: "Mortalidad rutina", cantidad: 3, disposicion: "Compostaje", costo: 0 },
  { fecha: "12 Jul 2026", tipo: "Sacrificio sanitario", cantidad: 8, disposicion: "Incinaración", costo: 24.00 },
  { fecha: "10 Jul 2026", tipo: "Mortalidad rutina", cantidad: 2, disposicion: "Compostaje", costo: 0 },
]

const huevoSubproductoData = [
  { fecha: "20 Jul 2026", tipo: "Huevo roto/claro", cantidad: 180, disposicion: "Venta a panificadora", ingreso: 45.00 },
  { fecha: "19 Jul 2026", tipo: "Huevo sucio", cantidad: 120, disposicion: "Venta a panificadora", ingreso: 24.00 },
  { fecha: "18 Jul 2026", tipo: "Huevo roto/claro", cantidad: 200, disposicion: "Venta a panificadora", ingreso: 50.00 },
  { fecha: "17 Jul 2026", tipo: "Huevo sucio", cantidad: 95, disposicion: "Lavado y reclasificación", ingreso: 0 },
  { fecha: "15 Jul 2026", tipo: "Huevo roto/claro", cantidad: 160, disposicion: "Venta a panificadora", ingreso: 40.00 },
  { fecha: "12 Jul 2026", tipo: "Huevo sucio", cantidad: 140, disposicion: "Venta a panificadora", ingreso: 28.00 },
]

export default function ResiduosPage() {
  const totalGallinazaMes = 12.5
  const totalAvesMuertas = 45
  const totalIngreso = huevoSubproductoData.reduce((s, r) => s + (r.ingreso || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestión de Residuos y Subproductos</h1>
        <p className="text-muted-foreground text-sm">Registro de gallinaza, mortalidad y huevo subproducto</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Gallinaza Mes</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{totalGallinazaMes} ton</p><p className="text-xs text-muted-foreground">7 registros en julio</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Aves Muertas Mes</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-amber-600">{totalAvesMuertas}</p><p className="text-xs text-muted-foreground">0.31% del total</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Ingreso Subproducto</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-green-700">${totalIngreso.toLocaleString()}</p><p className="text-xs text-muted-foreground">Venta huevo subproducto</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Gallinaza</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Tipo</th><th className="p-3 font-medium">Cantidad (ton)</th><th className="p-3 font-medium">Disposición</th><th className="p-3 font-medium">Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {gallinazaData.map((g, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 text-sm">{g.fecha}</td>
                  <td className="p-3"><Badge variant="secondary">{g.tipo}</Badge></td>
                  <td className="p-3">{g.cantidad} t</td>
                  <td className="p-3 text-sm">{g.disposicion}</td>
                  <td className="p-3">{g.ingreso > 0 ? `$${g.ingreso.toFixed(2)}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Aves Muertas</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Tipo</th><th className="p-3 font-medium">Cantidad</th><th className="p-3 font-medium">Disposición</th><th className="p-3 font-medium">Costo</th>
              </tr>
            </thead>
            <tbody>
              {avesMuertasData.map((a, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 text-sm">{a.fecha}</td>
                  <td className="p-3">
                    <Badge variant={a.tipo === "Sacrificio sanitario" ? "destructive" : "secondary"}>{a.tipo}</Badge>
                  </td>
                  <td className="p-3">{a.cantidad}</td>
                  <td className="p-3 text-sm">{a.disposicion}</td>
                  <td className="p-3">{a.costo > 0 ? `$${a.costo.toFixed(2)}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Huevo Subproducto</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Tipo</th><th className="p-3 font-medium">Cantidad (uds)</th><th className="p-3 font-medium">Disposición</th><th className="p-3 font-medium">Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {huevoSubproductoData.map((h, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 text-sm">{h.fecha}</td>
                  <td className="p-3"><Badge variant="outline">{h.tipo}</Badge></td>
                  <td className="p-3">{h.cantidad}</td>
                  <td className="p-3 text-sm">{h.disposicion}</td>
                  <td className="p-3">{h.ingreso > 0 ? `$${h.ingreso.toFixed(2)}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
