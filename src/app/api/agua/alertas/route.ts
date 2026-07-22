import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const hoy = new Date()
    const ayerDate = new Date(hoy)
    ayerDate.setDate(ayerDate.getDate() - 1)

    const [consumosHoy, consumosAyer] = await Promise.all([
      prisma.consumoAgua.findMany({ where: { fecha: hoy.toISOString().split("T")[0] as any } }),
      prisma.consumoAgua.findMany({ where: { fecha: ayerDate.toISOString().split("T")[0] as any } }),
    ])

    const alertas: any[] = []
    for (const hoyReg of consumosHoy) {
      const ayerReg = consumosAyer.find((c) => c.loteId === hoyReg.loteId)
      if (ayerReg && Number(ayerReg.litrosConsumidos) > 0) {
        const actual = Number(hoyReg.litrosConsumidos)
        const previo = Number(ayerReg.litrosConsumidos)
        const caida = ((previo - actual) / previo) * 100
        if (caida > 20) {
          alertas.push({
            tipo: "CAIDA_CONSUMO",
            nivel: "CRITICO",
            mensaje: `Caída del ${caida.toFixed(1)}% en consumo de agua`,
            loteId: hoyReg.loteId,
            seccionId: hoyReg.seccionId,
            consumoActual: actual,
            consumoAnterior: previo,
          })
        }
      }
    }

    return NextResponse.json({ alertas })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
