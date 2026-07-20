"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart, Line, BarChart, Bar, ComposedChart, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceArea, ReferenceLine,
} from "recharts"

const dataPostura = [
  { semana: 18, real: 5, teorica: 5 }, { semana: 20, real: 48, teorica: 48 },
  { semana: 22, real: 82, teorica: 82 }, { semana: 24, real: 91, teorica: 90 },
  { semana: 26, real: 93, teorica: 92 }, { semana: 28, real: 92, teorica: 92 },
  { semana: 30, real: 90, teorica: 91 }, { semana: 32, real: 89, teorica: 90 },
  { semana: 34, real: 88, teorica: 89 }, { semana: 36, real: 87, teorica: 88 },
  { semana: 38, real: 86, teorica: 87 }, { semana: 40, real: 85, teorica: 86 },
]

const dataMortalidad = [
  { semana: "Sem 18", real: 0.2, acumulada: 0.2, esperada: 0.3 },
  { semana: "Sem 20", real: 0.3, acumulada: 0.5, esperada: 0.5 },
  { semana: "Sem 22", real: 0.1, acumulada: 0.6, esperada: 0.8 },
  { semana: "Sem 24", real: 0.4, acumulada: 1.0, esperada: 1.0 },
  { semana: "Sem 26", real: 0.2, acumulada: 1.2, esperada: 1.2 },
  { semana: "Sem 28", real: 0.3, acumulada: 1.5, esperada: 1.4 },
  { semana: "Sem 30", real: 0.5, acumulada: 2.0, esperada: 1.6 },
  { semana: "Sem 32", real: 0.2, acumulada: 2.2, esperada: 1.8 },
  { semana: "Sem 34", real: 0.3, acumulada: 2.5, esperada: 2.0 },
  { semana: "Sem 36", real: 0.4, acumulada: 2.9, esperada: 2.3 },
]

const dataEficiencia = [
  { semana: "20", conversion: 1.8, pesoHuevo: 58, consumo: 105 },
  { semana: "22", conversion: 1.95, pesoHuevo: 60, consumo: 112 },
  { semana: "24", conversion: 2.05, pesoHuevo: 62, consumo: 118 },
  { semana: "26", conversion: 2.08, pesoHuevo: 63, consumo: 120 },
  { semana: "28", conversion: 2.1, pesoHuevo: 63.5, consumo: 122 },
  { semana: "30", conversion: 2.12, pesoHuevo: 64, consumo: 125 },
  { semana: "32", conversion: 2.08, pesoHuevo: 63, consumo: 120 },
  { semana: "34", conversion: 2.15, pesoHuevo: 64.5, consumo: 128 },
]

const dataClasificacion = [
  { name: "Jumbo", value: 15, color: "#166534" },
  { name: "Super", value: 36, color: "#22c55e" },
  { name: "Extra", value: 30, color: "#86efac" },
  { name: "Primera", value: 12, color: "#fbbf24" },
  { name: "Segunda", value: 5, color: "#f97316" },
  { name: "Tercera", value: 2, color: "#ef4444" },
]

const dataPeso = [
  { semana: 20, real: 58.2, minimo: 56, maximo: 60, objetivo: 58 },
  { semana: 22, real: 60.5, minimo: 58, maximo: 62, objetivo: 60 },
  { semana: 24, real: 61.8, minimo: 59, maximo: 63, objetivo: 61 },
  { semana: 26, real: 63.0, minimo: 60, maximo: 64, objetivo: 62 },
  { semana: 28, real: 63.5, minimo: 61, maximo: 65, objetivo: 63 },
  { semana: 30, real: 64.2, minimo: 61, maximo: 65, objetivo: 63 },
  { semana: 32, real: 63.8, minimo: 61, maximo: 65, objetivo: 63 },
  { semana: 34, real: 64.5, minimo: 62, maximo: 66, objetivo: 64 },
]

const dataProyeccion = [
  { mes: "Ene", real: 120000, proyectado: 120000 },
  { mes: "Feb", real: 115000, proyectado: 118000 },
  { mes: "Mar", real: 125000, proyectado: 122000 },
  { mes: "Abr", real: 118000, proyectado: 120000 },
  { mes: "May", real: 130000, proyectado: 125000 },
  { mes: "Jun", real: 128000, proyectado: 128000 },
  { mes: "Jul", real: null, proyectado: 130000 },
  { mes: "Ago", real: null, proyectado: 132000 },
  { mes: "Sep", real: null, proyectado: 135000 },
  { mes: "Oct", real: null, proyectado: 133000 },
  { mes: "Nov", real: null, proyectado: 136000 },
  { mes: "Dic", real: null, proyectado: 140000 },
]

const dataConsumoAgua = [
  { dia: "07 Jul", litros: 228 }, { dia: "09 Jul", litros: 218 },
  { dia: "11 Jul", litros: 230 }, { dia: "13 Jul", litros: 222 },
  { dia: "15 Jul", litros: 225 }, { dia: "17 Jul", litros: 208 },
  { dia: "19 Jul", litros: 212 }, { dia: "21 Jul", litros: 215 },
  { dia: "23 Jul", litros: 220 }, { dia: "25 Jul", litros: 224 },
  { dia: "27 Jul", litros: 218 }, { dia: "29 Jul", litros: 226 },
  { dia: "31 Jul", litros: 230 }, { dia: "02 Ago", litros: 228 },
]

const dataAmbiental = Array.from({ length: 24 }, (_, i) => ({
  hora: `${String(i).padStart(2, "0")}:00`,
  temperatura: 24 + Math.sin(i / 3) * 2.5 + (Math.random() - 0.5),
  humedad: 62 + Math.cos(i / 5) * 8 + (Math.random() - 0.5) * 2,
  amoniaco: 2.5 + Math.sin(i / 6) * 1.2 + (Math.random() - 0.5) * 0.5,
}))

export default function GraficosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Centro de Gráficos</h1>
        <p className="text-muted-foreground text-sm">Visualización avanzada de indicadores productivos</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>CHART-001: Curva de Postura</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dataPostura}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="teorica" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Teórica" />
                <Line type="monotone" dataKey="real" stroke="#166534" strokeWidth={3} name="Real" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>CHART-002: Mortalidad</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={dataMortalidad}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis domain={[0, 4]} unit="%" />
                <Tooltip />
                <Legend />
                <Bar dataKey="real" fill="var(--color-chart-5)" name="Mortalidad Semanal" radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="acumulada" stroke="#ef4444" strokeWidth={2} name="Acumulada" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="esperada" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Esperada" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>CHART-003: Eficiencia Alimenticia</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={dataEficiencia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis yAxisId="left" domain={[1.5, 2.5]} label={{ value: "Conversión", angle: -90, position: "left" }} />
                <YAxis yAxisId="right" orientation="right" domain={[50, 70]} label={{ value: "Peso (g)", angle: 90, position: "right" }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="conversion" fill="var(--color-chart-1)" name="Conversión" radius={[2, 2, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="pesoHuevo" stroke="#f59e0b" strokeWidth={2} name="Peso Huevo (g)" dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>CHART-004: Clasificación de Huevo</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={dataClasificacion} cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={2} dataKey="value">
                  {dataClasificacion.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>CHART-005: Peso del Huevo</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dataPeso}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis domain={[54, 68]} unit=" g" />
                <Tooltip />
                <Legend />
                <ReferenceArea y1={56} y2={60} fill="rgba(34,197,94,0.08)" />
                <ReferenceLine y={56} stroke="#22c55e" strokeDasharray="5 5" />
                <ReferenceLine y={60} stroke="#22c55e" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="real" stroke="var(--color-chart-3)" strokeWidth={3} name="Peso Real" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="objetivo" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Objetivo" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>CHART-006: Proyección de Producción</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={dataProyeccion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis unit=" huevos" />
                <Tooltip formatter={(v) => v ? `${Number(v).toLocaleString()} uds` : "—"} />
                <Legend />
                <Area type="monotone" dataKey="proyectado" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Proyectado" />
                <Area type="monotone" dataKey="real" stroke="#166534" fill="#166534" fillOpacity={0.3} name="Real" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>CHART-007: Consumo de Agua</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dataConsumoAgua}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis domain={[180, 250]} unit=" L" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="litros" stroke="var(--color-chart-2)" strokeWidth={3} name="L/ave/día" dot={{ r: 4 }} />
                <ReferenceLine y={220} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Esperado", position: "right" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>CHART-008: Variables Ambientales</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dataAmbiental}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" tick={{ fontSize: 10 }} interval={3} />
                <YAxis yAxisId="temp" domain={[15, 35]} label={{ value: "°C", angle: -90, position: "left" }} />
                <YAxis yAxisId="other" orientation="right" domain={[0, 80]} label={{ value: "% / ppm", angle: 90, position: "right" }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="temp" type="monotone" dataKey="temperatura" stroke="#ef4444" strokeWidth={2} name="Temperatura °C" dot={false} />
                <Line yAxisId="other" type="monotone" dataKey="humedad" stroke="#3b82f6" strokeWidth={2} name="Humedad %" dot={false} />
                <Line yAxisId="other" type="monotone" dataKey="amoniaco" stroke="#f59e0b" strokeWidth={2} name="NH₃ ppm" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
