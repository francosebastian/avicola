import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const packingFieldMap = [
  { key: "jumbo_xxl", field: "cajasJumboXxl" },
  { key: "jumbo", field: "cajasJumbo" },
  { key: "super", field: "cajasSuper" },
  { key: "extra", field: "cajasExtra" },
  { key: "primera", field: "cajasPrimera" },
  { key: "segunda", field: "cajasSegunda" },
  { key: "tercera", field: "cajasTercera" },
  { key: "descarte_x", field: "cajasDescarteX" },
  { key: "trizados", field: "cajasTrizados" },
]

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const fechaStr = searchParams.get("fecha") || new Date().toISOString().split("T")[0]
    const fecha = new Date(`${fechaStr}T00:00:00`)
    const next = new Date(fecha)
    next.setDate(next.getDate() + 1)

    const [registros, despachos, inventario] = await Promise.all([
      prisma.registroPacking.findMany({ where: { fecha: { gte: fecha, lt: next } } }),
      prisma.despacho.findMany({ where: { fecha: { gte: fecha, lt: next } }, include: { detalle: true } }),
      prisma.inventarioPacking.findMany(),
    ])

    const regs = registros as unknown as Array<Record<string, number>>
    const items = packingFieldMap.map(({ key, field }) => {
      const entradas = regs.reduce((s, r) => s + (r[field] || 0), 0)
      const salidas = despachos.reduce(
        (s, d) => s + d.detalle.reduce((a, x) => a + (x.categoria === key ? x.cantidadCajas : 0), 0),
        0
      )
      const cierre = inventario.find(i => i.categoria === key)?.stockCajas ?? 0
      const apertura = Math.max(0, cierre - entradas + salidas)
      return { categoria: key, apertura, entradas, salidas, cierre, diferencia: cierre - apertura }
    })

    return NextResponse.json({ fecha: fechaStr, items })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
