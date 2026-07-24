import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Ciclo de vida: recepcion(0) → cria(1-5) → recria(6-16) → postura(17-90+) → descarte → cerrado

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lote = await prisma.lote.findUnique({
      where: { id },
      include: { seccion: { include: { galpon: true } } },
    })
    if (!lote) return NextResponse.json({ error: "No encontrado" }, { status: 404 })

    const hoy = new Date()
    const recepcion = new Date(lote.fechaRecepcion)
    const semanas = Math.floor((hoy.getTime() - recepcion.getTime()) / (7 * 24 * 60 * 60 * 1000))
    let nuevoEstado = lote.estado
    let evento = ""

    if (semanas < 1 && lote.estado === "recepcion") {
      nuevoEstado = "cria"
      evento = "Cambio automático a fase Cría (semana 1)"
    } else if (semanas >= 6 && lote.estado === "cria") {
      nuevoEstado = "recria"
      evento = "Cambio automático a fase Recría (semana 6)"
    } else if (semanas >= 17 && lote.estado === "recria") {
      // Buscar sección de producción libre en el mismo galpón
      const seccionLibre = await prisma.seccion.findFirst({
        where: {
          galponId: lote.seccion.galponId,
          tipo: "produccion",
          activo: true,
          lotes: { none: { estado: { in: ["recepcion", "cria", "recria", "postura"] } } },
        },
      })
      if (!seccionLibre) {
        return NextResponse.json({ error: "No hay secciones de producción libres en este galpón" }, { status: 400 })
      }
      await prisma.lote.update({ where: { id }, data: { seccionId: seccionLibre.id } })
      nuevoEstado = "postura"
      evento = `Cambio automático a fase Postura (semana 17) — Asignado a ${seccionLibre.nombre}`
    } else {
      return NextResponse.json({ message: "El lote ya está en la fase correcta para su edad", estado: lote.estado }, { status: 200 })
    }

    await prisma.lote.update({ where: { id }, data: { estado: nuevoEstado } })
    await prisma.eventoLote.create({
      data: { loteId: id, tipoEvento: "avance_fase", fecha: hoy.toISOString().split("T")[0], descripcion: evento },
    })

    return NextResponse.json({ message: evento, estadoAnterior: lote.estado, estadoNuevo: nuevoEstado })
  } catch (error: any) {
    console.error("[AVANZAR_FASE] error:", error?.message || error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
