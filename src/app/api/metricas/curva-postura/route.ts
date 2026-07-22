import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const loteId = url.searchParams.get("loteId")

    if (!loteId) {
      return NextResponse.json({ error: "loteId requerido" }, { status: 400 })
    }

    const registros = await prisma.registroDiario.findMany({
      where: { loteId },
      orderBy: { fecha: "asc" },
      select: { fecha: true, huevosProducidos: true, avesVivas: true },
    })

    const data = registros.map((r) => ({
      fecha: r.fecha,
      posturaReal: r.avesVivas ? Math.round((r.huevosProducidos ?? 0) / r.avesVivas * 1000) / 10 : 0,
    }))

    return NextResponse.json({ data, total: data.length })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
