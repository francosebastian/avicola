"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const lineasGeneticas = [
  { linea: "Hy-Line Brown", picoPostura: "24-26 sem", picoPorcentaje: "94-96%", persistencia: "Alta", huevos: "335-345", pesoHuevo: "62-64g" },
  { linea: "Lohmann LSL", picoPostura: "24-26 sem", picoPorcentaje: "93-95%", persistencia: "Muy alta", huevos: "340-350", pesoHuevo: "60-62g" },
  { linea: "ISA Brown", picoPostura: "24-26 sem", picoPorcentaje: "93-95%", persistencia: "Alta", huevos: "330-340", pesoHuevo: "62-65g" },
  { linea: "Bovans Brown", picoPostura: "25-27 sem", picoPorcentaje: "92-94%", persistencia: "Alta", huevos: "325-335", pesoHuevo: "63-66g" },
  { linea: "Dekalb White", picoPostura: "23-25 sem", picoPorcentaje: "94-96%", persistencia: "Muy alta", huevos: "345-355", pesoHuevo: "58-60g" },
]

const usuarios = [
  { email: "admin@avicola.com", nombre: "Admin Sistema", rol: "Administrador", activo: true },
  { email: "juan.perez@avicola.com", nombre: "Juan Pérez", rol: "Supervisor", activo: true },
  { email: "maria.garcia@avicola.com", nombre: "María García", rol: "Veterinario", activo: true },
  { email: "carlos.lopez@avicola.com", nombre: "Carlos López", rol: "Operario", activo: true },
  { email: "ana.martinez@avicola.com", nombre: "Ana Martínez", rol: "Operario", activo: false },
  { email: "luis.gomez@avicola.com", nombre: "Luis Gómez", rol: "Encargado Galpón", activo: true },
  { email: "pedro.jimenez@avicola.com", nombre: "Pedro Jiménez", rol: "Encargado Alimento", activo: true },
]

const umbralesGlobales = [
  { parametro: "Temperatura máxima galpón", valor: "28°C", accion: "Ventilación + alarma" },
  { parametro: "Temperatura mínima galpón", valor: "16°C", accion: "Calefacción" },
  { parametro: "Humedad relativa", valor: "50-70%", accion: "Ventilación" },
  { parametro: "NH₃ máximo", valor: "10 ppm", accion: "Ventilación forzada" },
  { parametro: "Consumo agua mínimo", valor: "176 L/ave/día (-20%)", accion: "Revisar bebederos" },
  { parametro: "Mortalidad diaria máxima", valor: "0.5%", accion: "Evaluación sanitaria" },
  { parametro: "Postura bajo objetivo", valor: "5% por 2 días", accion: "Revisar alimento/salud" },
  { parametro: "Stock mínimo alimento", valor: "3 días de consumo", accion: "Pedido urgente" },
]

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración del Sistema</h1>
        <p className="text-muted-foreground text-sm">Parámetros globales, líneas genéticas y usuarios</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Líneas Genéticas</CardTitle>
          <Button variant="outline" size="sm">+ Nueva Línea</Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Línea</th><th className="p-3 font-medium">Pico de Postura</th><th className="p-3 font-medium">% Pico</th>
                <th className="p-3 font-medium">Persistencia</th><th className="p-3 font-medium">Huevos/Año</th><th className="p-3 font-medium">Peso Huevo</th>
              </tr>
            </thead>
            <tbody>
              {lineasGeneticas.map((l, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 font-medium">{l.linea}</td>
                  <td className="p-3 text-sm">{l.picoPostura}</td>
                  <td className="p-3">{l.picoPorcentaje}</td>
                  <td className="p-3"><Badge variant={l.persistencia === "Muy alta" ? "default" : "secondary"}>{l.persistencia}</Badge></td>
                  <td className="p-3">{l.huevos}</td>
                  <td className="p-3">{l.pesoHuevo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Usuarios y Roles</CardTitle>
          <Button variant="outline" size="sm">+ Invitar Usuario</Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Email</th><th className="p-3 font-medium">Nombre</th><th className="p-3 font-medium">Rol</th><th className="p-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 text-sm">{u.email}</td>
                  <td className="p-3 font-medium">{u.nombre}</td>
                  <td className="p-3">
                    <Badge variant={u.rol === "Administrador" ? "default" : u.rol === "Supervisor" ? "secondary" : "outline"}>{u.rol}</Badge>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1.5 text-sm ${u.activo ? "text-green-600" : "text-muted-foreground"}`}>
                      <span className={`size-2 rounded-full ${u.activo ? "bg-green-500" : "bg-gray-300"}`} />
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Alertas — Umbrales Globales</CardTitle>
          <Button variant="outline" size="sm">Editar Umbrales</Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-3 font-medium">Parámetro</th><th className="p-3 font-medium">Valor / Umbral</th><th className="p-3 font-medium">Acción Automática</th>
              </tr>
            </thead>
            <tbody>
              {umbralesGlobales.map((u, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 font-medium">{u.parametro}</td>
                  <td className="p-3"><Badge variant="secondary">{u.valor}</Badge></td>
                  <td className="p-3 text-sm text-muted-foreground">{u.accion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
