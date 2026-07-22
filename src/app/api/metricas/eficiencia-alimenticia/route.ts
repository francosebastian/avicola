import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const loteId = url.searchParams.get("loteId")

    const consumo = await prisma.consumoAlimentoDiario.findMany({
      where: loteId ? { loteId } : {},
      orderBy: { fecha: "asc" },
    })

    const produccion = await prisma.registroDiario.findMany({
      where: loteId ? { loteId } : {},
      orderBy: { fecha: "asc" },
    })

    const totalAlimento = consumo.reduce((s, c) => s + Number(c.cantidadKg), 0)
    const totalHuevos = produccion.reduce((s, p) => s + Number(p.huevosProducidos ?? 0), 0)
    const conversionAlimenticia = totalHuevos > 0 ? totalAlimento / totalHuevos : 0

    const diario = produccion.map((p) => {
      const c = consumo.find((c) => c.fecha === p.fecha)
      const kg = c ? Number(c.cantidadKg) : 0
      return {
        fecha: p.fecha,
        huevosProducidos: p.huevosProducidos ?? 0,
        consumoKg: kg,
        conversion: kg > 0 && (p.huevosProducidos ?? 0) > 0 ? kg / (p.huevosProducidos ?? 1) : 0,
      }
    })

    return NextResponse.json({
      totalAlimento,
      totalHuevos,
      conversionAlimenticia: Math.round(conversionAlimenticia * 100) / 100,
      diario,
    })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
