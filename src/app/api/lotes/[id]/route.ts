import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateLoteSchema, changeEstadoSchema } from "@/lib/validations/lotes"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const lote = await prisma.lote.findUnique({
      where: { id },
      include: {
        seccion: { include: { galpon: { select: { nombre: true } } } },
        registroDiario: { orderBy: { fecha: "desc" }, take: 1 },
        eventosLote: { orderBy: { fecha: "desc" }, take: 10 },
        costosLote: { select: { monto: true } },
      },
    })
    if (!lote) return NextResponse.json({ error: "No encontrado" }, { status: 404 })

    const ultimo = lote.registroDiario[0]
    const totalHuevos = await prisma.registroDiario.aggregate({
      where: { loteId: id },
      _sum: { huevosProducidos: true },
    })
    const totalBajas = await prisma.registroDiario.aggregate({
      where: { loteId: id },
      _sum: { bajasDia: true },
    })
    const totalCostos = lote.costosLote.reduce((s, c) => s + Number(c.monto), 0)
    const hoy = new Date()
    const diffSemanas = Math.max(0, Math.floor((hoy.getTime() - new Date(lote.fechaRecepcion).getTime()) / (7 * 24 * 60 * 60 * 1000)))

    const huevosProducidos = Number(totalHuevos._sum.huevosProducidos ?? 0)
    const bajasTotal = Number(totalBajas._sum.bajasDia ?? 0)
    const avesVivas = Math.max(0, (lote.cantidadInicial ?? 0) - bajasTotal)
    const postura = ultimo?.avesVivas ? Math.round((ultimo.huevosProducidos ?? 0) / ultimo.avesVivas * 1000) / 10 : 0
    const mortalidad = lote.cantidadInicial > 0 ? Math.round(bajasTotal / lote.cantidadInicial * 1000) / 10 : 0
    const huevosPorAve = lote.cantidadInicial > 0 ? Math.round(huevosProducidos / lote.cantidadInicial * 10) / 10 : 0

    return NextResponse.json({
      id: lote.id,
      codigoLote: lote.codigoLote,
      lineaGenetica: lote.lineaGenetica,
      proveedorPollita: lote.proveedorPollita,
      cantidadInicial: lote.cantidadInicial,
      fechaRecepcion: lote.fechaRecepcion,
      fechaNacimiento: lote.fechaNacimiento,
      pesoInicialPromedio: lote.pesoInicialPromedio,
      costoPollitaUnitario: lote.costoPollitaUnitario,
      estado: lote.estado,
      fechaCierre: lote.fechaCierre,
      galpon: lote.seccion?.galpon?.nombre ?? null,
      seccion: lote.seccion?.nombre ?? null,
      edadSemanas: diffSemanas,
      avesVivas,
      postura,
      mortalidadAcumulada: mortalidad,
      huevosTotales: huevosProducidos,
      huevosPorAve,
      costoTotal: totalCostos,
      eventos: lote.eventosLote.map((e) => ({
        id: e.id,
        tipoEvento: e.tipoEvento,
        fecha: e.fecha,
        descripcion: e.descripcion,
        createdBy: e.createdBy,
      })),
    })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = updateLoteSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    const existing = await prisma.lote.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    const data = await prisma.lote.update({ where: { id }, data: parsed.data as any })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = changeEstadoSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    const existing = await prisma.lote.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    const data = await prisma.lote.update({ where: { id }, data: { estado: parsed.data.estado } })
    await prisma.eventoLote.create({ data: { loteId: id, tipoEvento: "cambio_estado", fecha: new Date().toISOString().split("T")[0], descripcion: `Estado cambiado a: ${parsed.data.estado}` } as any })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
