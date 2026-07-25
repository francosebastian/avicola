import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET() {
  try {
    const lotes = await prisma.lote.findMany({
      where: { estado: { in: ["recepcion", "cria", "recria"] } },
      include: { seccion: { include: { galpon: true } } },
    })

    const resultados: Array<{ codigoLote: string; resultado: string }> = []

    for (const lote of lotes) {
      const hoy = new Date()
      const recepcion = new Date(lote.fechaRecepcion)
      const semanas = Math.floor((hoy.getTime() - recepcion.getTime()) / (7 * 24 * 60 * 60 * 1000))
      let nuevoEstado: string | null = null
      let evento = ""
      let nuevaSeccionId: string | null = null

      if (semanas >= 1 && lote.estado === "recepcion") {
        nuevoEstado = "cria"
        evento = `Cron: Cambio automático a fase Cría (semana ${semanas})`
      } else if (semanas >= 6 && lote.estado === "cria") {
        nuevoEstado = "recria"
        evento = `Cron: Cambio automático a fase Recría (semana ${semanas})`
      } else if (semanas >= 17 && lote.estado === "recria") {
        const seccionLibre = await prisma.seccion.findFirst({
          where: {
            galponId: lote.seccion?.galponId,
            tipo: "produccion",
            activo: true,
            lotes: { none: { estado: { in: ["recepcion", "cria", "recria", "postura"] } } },
          },
        })
        if (!seccionLibre) {
          resultados.push({ codigoLote: lote.codigoLote, resultado: "ERROR: No hay sección de producción libre" })
          continue
        }
        nuevoEstado = "postura"
        nuevaSeccionId = seccionLibre.id
        evento = `Cron: Cambio a Postura (semana ${semanas}) — Asignado a ${seccionLibre.nombre}`
      }

      if (nuevoEstado) {
        await prisma.lote.update({
          where: { id: lote.id },
          data: { estado: nuevoEstado, ...(nuevaSeccionId ? { seccionId: nuevaSeccionId } : {}) },
        })
        await prisma.eventoLote.create({
          data: {
            loteId: lote.id,
            tipoEvento: "avance_fase",
            fecha: hoy.toISOString().split("T")[0],
            descripcion: evento,
          },
        })
        resultados.push({ codigoLote: lote.codigoLote, resultado: evento })
      } else {
        resultados.push({ codigoLote: lote.codigoLote, resultado: `Sin cambios (${lote.estado}, ${semanas} semanas)` })
      }
    }

    return NextResponse.json({
      fecha: new Date().toISOString(),
      procesados: lotes.length,
      resultados,
    })
  } catch (error: any) {
    console.error("[CRON] error:", error?.message || error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
