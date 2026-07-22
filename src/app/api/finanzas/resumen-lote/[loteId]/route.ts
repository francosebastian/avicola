import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: Promise<{ loteId: string }> }) {
  try {
    const { loteId } = await params

    const [costos, produccion] = await Promise.all([
      prisma.costoLote.findMany({ where: { loteId } }),
      prisma.registroDiario.findMany({ where: { loteId } }),
    ])

    const totalCostos = costos.reduce((sum: number, c: any) => sum + Number(c.monto || 0), 0)
    const totalHuevos = produccion.reduce((sum: number, p: any) => sum + Number(p.huevosProducidos || 0), 0)
    const costoPorHuevo = totalHuevos > 0 ? totalCostos / totalHuevos : 0

    const lote = await prisma.lote.findUnique({ where: { id: loteId } })

    const data = {
      loteId,
      lote: lote ? { codigoLote: lote.codigoLote, lineaGenetica: lote.lineaGenetica } : null,
      totalCostos,
      totalHuevos,
      costoPorHuevo,
      cantidadRegistros: costos.length,
      cantidadDiasProduccion: produccion.length,
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
