"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function NuevoLotePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nuevo Lote</h1>
          <p className="text-muted-foreground text-sm">Registro de recepción de pollitas BB</p>
        </div>
        <Link href="/lotes">
          <Button variant="outline">Cancelar</Button>
        </Link>
      </div>

      <Card>
        <CardHeader><CardTitle>Información General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Código del Lote <span className="text-red-500">*</span></label>
              <Input placeholder="Ej: H-036" className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">Autogenerado o manual. Único en el sistema.</p>
            </div>
            <div>
              <label className="text-sm font-medium">Línea Genética <span className="text-red-500">*</span></label>
              <select className="w-full mt-1 rounded-md border p-2 text-sm bg-background">
                <option>Hy-Line Brown</option>
                <option>Hy-Line W36</option>
                <option>Lohmann LSL</option>
                <option>Lohmann Brown</option>
                <option>ISA Brown</option>
                <option>Bovans White</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Proveedor de Pollitas</label>
              <Input placeholder="Nombre del proveedor" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Costo por Pollita ($)</label>
              <Input type="number" placeholder="Ej: 3850" className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recepción</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Fecha de Recepción <span className="text-red-500">*</span></label>
              <Input type="date" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Fecha de Nacimiento</label>
              <Input type="date" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Cantidad Inicial <span className="text-red-500">*</span></label>
              <Input type="number" placeholder="Ej: 5000" className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Peso Inicial Promedio (g)</label>
              <Input type="number" step="0.1" placeholder="Ej: 35.2" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Edad a la Recepción (días)</label>
              <Input type="number" placeholder="Ej: 1 (pollita BB)" className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Ubicación</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Galpón <span className="text-red-500">*</span></label>
              <select className="w-full mt-1 rounded-md border p-2 text-sm bg-background">
                <option>Galpón 1</option>
                <option>Galpón 2</option>
                <option>Galpón 3</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Sección <span className="text-red-500">*</span></label>
              <select className="w-full mt-1 rounded-md border p-2 text-sm bg-background">
                <option>Fila A</option>
                <option>Fila B</option>
                <option>Fila C</option>
                <option>Ala Norte</option>
                <option>Ala Sur</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Observaciones</label>
            <textarea className="w-full mt-1 rounded-md border p-2 text-sm bg-background" rows={3} placeholder="Ej: pollitas de buena calidad, peso homogéneo..." />
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
          <Button variant="outline">Cancelar</Button>
        </Link>
        <Button>Crear Lote</Button>
      </div>
    </div>
  )
}
