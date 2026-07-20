"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

const categorias = ["Alimento", "Insumos", "Huevos", "Empaques"] as const
type Categoria = typeof categorias[number]

const productos = [
  { nombre: "Postura Premium", almacen: "Alimento A", stock: 4200, minimo: 1000, categoria: "Alimento" as Categoria },
  { nombre: "Recría Inicial", almacen: "Alimento A", stock: 800, minimo: 500, categoria: "Alimento" as Categoria },
  { nombre: "Núcleo Mineral", almacen: "Alimento B", stock: 150, minimo: 200, categoria: "Alimento" as Categoria },
  { nombre: "Vacuna Newcastle", almacen: "Insumos Vet", stock: 3400, minimo: 500, categoria: "Insumos" as Categoria },
  { nombre: "Amoxicilina", almacen: "Insumos Vet", stock: 12, minimo: 20, categoria: "Insumos" as Categoria },
  { nombre: "Jeringas 5ml", almacen: "Insumos Vet", stock: 200, minimo: 100, categoria: "Insumos" as Categoria },
  { nombre: "Desinfectante Yodo", almacen: "Limpieza", stock: 45, minimo: 30, categoria: "Insumos" as Categoria },
  { nombre: "Huevo Jumbo", almacen: "Cuarto Frío", stock: 2400, minimo: 500, categoria: "Huevos" as Categoria },
  { nombre: "Huevo Super", almacen: "Cuarto Frío", stock: 5800, minimo: 500, categoria: "Huevos" as Categoria },
  { nombre: "Huevo Extra", almacen: "Cuarto Frío", stock: 4850, minimo: 500, categoria: "Huevos" as Categoria },
  { nombre: "Huevo Segunda", almacen: "Cuarto Frío", stock: 320, minimo: 200, categoria: "Huevos" as Categoria },
  { nombre: "Envase Maple 30", almacen: "Empaques", stock: 1200, minimo: 300, categoria: "Empaques" as Categoria },
  { nombre: "Caja Cartón 360", almacen: "Empaques", stock: 85, minimo: 100, categoria: "Empaques" as Categoria },
  { nombre: "Stickers Lote", almacen: "Empaques", stock: 5000, minimo: 1000, categoria: "Empaques" as Categoria },
  { nombre: "Separadores", almacen: "Empaques", stock: 2500, minimo: 500, categoria: "Empaques" as Categoria },
  { nombre: "Bandeja Poliestireno", almacen: "Empaques", stock: 3000, minimo: 800, categoria: "Empaques" as Categoria },
  { nombre: "Guantes Latex", almacen: "Insumos Vet", stock: 50, minimo: 40, categoria: "Insumos" as Categoria },
  { nombre: "Cal Avícola", almacen: "Alimento A", stock: 2500, minimo: 800, categoria: "Alimento" as Categoria },
  { nombre: "Premezcla Vitaminas", almacen: "Alimento A", stock: 180, minimo: 100, categoria: "Alimento" as Categoria },
  { nombre: "Harina de Soja", almacen: "Alimento B", stock: 5000, minimo: 2000, categoria: "Alimento" as Categoria },
  { nombre: "Maíz Molido", almacen: "Alimento B", stock: 8000, minimo: 3000, categoria: "Alimento" as Categoria },
  { nombre: "Huevo Tercera", almacen: "Cuarto Frío", stock: 160, minimo: 100, categoria: "Huevos" as Categoria },
  { nombre: "Huevo Primera", almacen: "Cuarto Frío", stock: 1500, minimo: 300, categoria: "Huevos" as Categoria },
  { nombre: "Pipetas Desparasitante", almacen: "Insumos Vet", stock: 28, minimo: 30, categoria: "Insumos" as Categoria },
]

const movimientos = [
  { fecha: "20 Jul 2026", tipo: "Entrada", producto: "Postura Premium", cantidad: 2000, responsable: "Carlos Ruiz" },
  { fecha: "20 Jul 2026", tipo: "Salida", producto: "Huevo Jumbo", cantidad: 960, responsable: "Luis Gómez" },
  { fecha: "19 Jul 2026", tipo: "Entrada", producto: "Maíz Molido", cantidad: 5000, responsable: "Carlos Ruiz" },
  { fecha: "19 Jul 2026", tipo: "Salida", producto: "Huevo Super", cantidad: 1200, responsable: "Luis Gómez" },
  { fecha: "19 Jul 2026", tipo: "Salida", producto: "Núcleo Mineral", cantidad: 50, responsable: "Pedro Jiménez" },
  { fecha: "18 Jul 2026", tipo: "Entrada", producto: "Envase Maple 30", cantidad: 500, responsable: "Ana Martínez" },
  { fecha: "18 Jul 2026", tipo: "Salida", producto: "Huevo Extra", cantidad: 800, responsable: "Luis Gómez" },
  { fecha: "17 Jul 2026", tipo: "Salida", producto: "Postura Premium", cantidad: 525, responsable: "Pedro Jiménez" },
]

export default function InventarioPage() {
  const [tab, setTab] = useState<Categoria>("Alimento")
  const filtered = productos.filter(p => p.categoria === tab)

  const totalProductos = productos.length
  const stockBajo = productos.filter(p => p.stock <= p.minimo).length
  const almacenes = [...new Set(productos.map(p => p.almacen))].length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventarios Multi-Almacén</h1>
        <p className="text-muted-foreground text-sm">Control de stock, movimientos y alertas de reposición</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Productos</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{totalProductos}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Stock Bajo</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-red-600">{stockBajo}</p><p className="text-xs text-muted-foreground">Requieren reposición</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Almacenes</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{almacenes}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {categorias.map(c => (
              <button
                key={c}
                onClick={() => setTab(c)}
                className={`px-4 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                  tab === c ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Nombre</th><th className="p-3 font-medium">Almacén</th>
                <th className="p-3 font-medium">Stock Actual</th><th className="p-3 font-medium">Stock Mínimo</th><th className="p-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const bajo = p.stock <= p.minimo
                return (
                  <tr key={i} className={`border-b last:border-0 hover:bg-muted/50 ${bajo ? "bg-red-50" : ""}`}>
                    <td className="p-3 font-medium">{p.nombre}</td>
                    <td className="p-3 text-sm">{p.almacen}</td>
                    <td className="p-3">{p.stock.toLocaleString()}</td>
                    <td className="p-3">{p.minimo.toLocaleString()}</td>
                    <td className="p-3">
                      {bajo ? (
                        <Badge variant="destructive">Stock Bajo</Badge>
                      ) : (
                        <Badge variant="secondary">Normal</Badge>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Movimientos Recientes</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Fecha</th><th className="p-3 font-medium">Tipo</th><th className="p-3 font-medium">Producto</th>
                <th className="p-3 font-medium">Cantidad</th><th className="p-3 font-medium">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((m, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 text-sm">{m.fecha}</td>
                  <td className="p-3">
                    <Badge variant={m.tipo === "Entrada" ? "secondary" : "default"}>{m.tipo}</Badge>
                  </td>
                  <td className="p-3 font-medium">{m.producto}</td>
                  <td className="p-3">{m.cantidad.toLocaleString()}</td>
                  <td className="p-3 text-sm">{m.responsable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
