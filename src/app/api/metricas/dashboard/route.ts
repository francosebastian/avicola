import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [registrosHoy, lotes, packingHoy] = await Promise.all([
      prisma.registroDiario.findMany({ where: { fecha: { gte: today, lt: tomorrow } as any } }),
      prisma.lote.findMany(),
      prisma.registroPacking.findMany({ where: { fecha: { gte: today, lt: tomorrow } as any } }),
    ])

    const totalHuevosHoy = registrosHoy.reduce((s, r) => s + (r.huevosProducidos ?? 0), 0)

    const ultimosRegistros = await Promise.all(
      lotes.map((l) =>
        prisma.registroDiario.findFirst({ where: { loteId: l.id }, orderBy: { fecha: "desc" } })
      )
    )
    const avesVivas = ultimosRegistros.reduce((s, r) => s + (r?.avesVivas ?? 0), 0)
    const avesIniciales = lotes.reduce((s, l) => s + (l.cantidadInicial ?? 0), 0)

    const mortalidadAcumulada = avesIniciales > 0 ? ((avesIniciales - avesVivas) / avesIniciales) * 100 : 0

    const posturaHoy = registrosHoy.length > 0
      ? registrosHoy.reduce((s, r) => s + (r.avesVivas ? (r.huevosProducidos ?? 0) / r.avesVivas * 100 : 0), 0) / registrosHoy.length
      : 0

    const clasificacionHoy: Record<string, number> = {
      jumbo: packingHoy.reduce((s, p) => s + (p.cajasJumbo ?? 0), 0),
      super: packingHoy.reduce((s, p) => s + (p.cajasSuper ?? 0), 0),
      extra: packingHoy.reduce((s, p) => s + (p.cajasExtra ?? 0), 0),
      primera: packingHoy.reduce((s, p) => s + (p.cajasPrimera ?? 0), 0),
      segunda: packingHoy.reduce((s, p) => s + (p.cajasSegunda ?? 0), 0),
      tercera: packingHoy.reduce((s, p) => s + (p.cajasTercera ?? 0), 0),
    }

    return NextResponse.json({
      posturaHoy: Math.round(posturaHoy * 100) / 100,
      totalHuevosHoy,
      avesVivas,
      mortalidadAcumulada: Math.round(mortalidadAcumulada * 100) / 100,
      clasificacionHoy,
      lotesActivos: lotes.filter((l) => l.estado === "postura").length,
      totalLotes: lotes.length,
    })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
