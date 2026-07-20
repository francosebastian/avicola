"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProduccionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Registro Diario de Producción</h1>
          <p className="text-muted-foreground text-sm">Registro por sección — Lunes 20 Julio 2026</p>
        </div>
        <Button>Guardar Registro</Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Seleccionar Sección</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Galpón</label>
                <select className="w-full mt-1 rounded-md border p-2 text-sm bg-background">
                  <option>Galpón 1</option>
                  <option>Galpón 2</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Sección</label>
                <select className="w-full mt-1 rounded-md border p-2 text-sm bg-background">
                  <option>Fila A — Lote H-032</option>
                  <option>Fila B — Lote H-033</option>
                  <option>Fila C — Lote H-030</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Resumen del Lote H-032</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Línea:</span><span className="font-medium">Hy-Line Brown</span>
              <span className="text-muted-foreground">Edad:</span><span className="font-medium">32 semanas</span>
              <span className="text-muted-foreground">Aves iniciales:</span><span className="font-medium">5,000</span>
              <span className="text-muted-foreground">Aves vivas:</span><span className="font-medium">4,885</span>
              <span className="text-muted-foreground">Postura esperada:</span><span className="font-medium">91.2%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Registro de Datos — Fila A</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium">Aves Vivas</label>
              <Input type="number" defaultValue={4885} className="mt-1 text-lg" />
            </div>
            <div>
              <label className="text-sm font-medium">Bajas del Día</label>
              <Input type="number" defaultValue={3} className="mt-1 text-lg" />
            </div>
            <div>
              <label className="text-sm font-medium">Huevos Producidos</label>
              <Input type="number" defaultValue={4520} className="mt-1 text-lg" />
            </div>
            <div>
              <label className="text-sm font-medium">Consumo Alimento (kg)</label>
              <Input type="number" defaultValue={525} className="mt-1 text-lg" />
            </div>
            <div>
              <label className="text-sm font-medium">Consumo Agua (litros)</label>
              <Input type="number" defaultValue={1050} className="mt-1 text-lg" />
            </div>
            <div>
              <label className="text-sm font-medium">Temp. Mínima (°C)</label>
              <Input type="number" defaultValue={18.5} className="mt-1 text-lg" />
            </div>
            <div>
              <label className="text-sm font-medium">Temp. Máxima (°C)</label>
              <Input type="number" defaultValue={25.2} className="mt-1 text-lg" />
            </div>
            <div>
              <label className="text-sm font-medium">Lectura Medidor Agua</label>
              <Input type="number" defaultValue={145.3} className="mt-1 text-lg" />
            </div>
          </div>

          <h3 className="text-sm font-medium mt-6 mb-3">Clasificación de Huevos</h3>
          <div className="grid grid-cols-7 gap-4">
            <div><label className="text-xs text-muted-foreground">Jumbo</label><Input type="number" defaultValue={678} className="mt-1" /></div>
            <div><label className="text-xs text-muted-foreground">Súper</label><Input type="number" defaultValue={1627} className="mt-1" /></div>
            <div><label className="text-xs text-muted-foreground">Extra</label><Input type="number" defaultValue={1356} className="mt-1" /></div>
            <div><label className="text-xs text-muted-foreground">Primera</label><Input type="number" defaultValue={542} className="mt-1" /></div>
            <div><label className="text-xs text-muted-foreground">Segunda</label><Input type="number" defaultValue={226} className="mt-1" /></div>
            <div><label className="text-xs text-muted-foreground">Tercera</label><Input type="number" defaultValue={91} className="mt-1" /></div>
            <div><label className="text-xs text-muted-foreground">Subproducto</label><Input type="number" defaultValue={0} className="mt-1" /></div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium">Observaciones</label>
            <textarea className="w-full mt-1 rounded-md border p-2 text-sm bg-background" rows={3} placeholder="Ej: aves tranquilas, sin novedades..." />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
