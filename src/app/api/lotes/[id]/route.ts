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
        eventosLote: { orderBy: { fecha: "desc" }, take: 10 },
        costosLote: { select: { monto: true } },
      },
    })
    if (!lote) return NextResponse.json({ error: "No encontrado" }, { status: 404 })

    const [registros, curvas] = await Promise.all([
      prisma.registroDiario.findMany({ where: { loteId: id }, orderBy: { fecha: "asc" } }),
      prisma.curvaEstandar.findMany({ where: { lineaGenetica: lote.lineaGenetica }, orderBy: { semanaVida: "asc" } }),
    ])

    const totalHuevos = registros.reduce((s, r) => s + (r.huevosProducidos ?? 0), 0)
    const bajasTotal = registros.reduce((s, r) => s + (r.bajasDia ?? 0), 0)
    const totalCostos = lote.costosLote.reduce((s, c) => s + Number(c.monto), 0)
    const hoy = new Date()
    const diffSemanas = Math.max(0, Math.floor((hoy.getTime() - new Date(lote.fechaRecepcion).getTime()) / (7 * 24 * 60 * 60 * 1000)))

    const ultimo = registros[registros.length - 1]
    const avesVivas = Math.max(0, (lote.cantidadInicial ?? 0) - bajasTotal)
    const postura = ultimo?.avesVivas ? Math.round((ultimo.huevosProducidos ?? 0) / ultimo.avesVivas * 1000) / 10 : 0
    const mortalidad = lote.cantidadInicial > 0 ? Math.round(bajasTotal / lote.cantidadInicial * 1000) / 10 : 0
    const huevosPorAve = lote.cantidadInicial > 0 ? Math.round(totalHuevos / lote.cantidadInicial * 10) / 10 : 0

    const curvaMap = new Map<number, { postura: number; mortalidad: number }>()
    for (const c of curvas) {
      curvaMap.set(c.semanaVida, { postura: Number(c.posturaEsperada) || 0, mortalidad: Number(c.mortalidadEsperada) || 0 })
    }
    const semanaDe = (fecha: Date) => Math.max(0, Math.floor((fecha.getTime() - new Date(lote.fechaRecepcion).getTime()) / (7 * 24 * 60 * 60 * 1000)))

    const porSemana = new Map<number, { huevos: number; aves: number; bajas: number }>()
    for (const r of registros) {
      const sem = semanaDe(r.fecha)
      const acc = porSemana.get(sem) || { huevos: 0, aves: 0, bajas: 0 }
      acc.huevos += r.huevosProducidos ?? 0
      acc.aves += r.avesVivas ?? 0
      acc.bajas += r.bajasDia ?? 0
      porSemana.set(sem, acc)
    }
    const semanasOrdenadas = [...porSemana.keys()].sort()
    const posturaCurva = semanasOrdenadas.map(sem => {
      const acc = porSemana.get(sem)!
      const teorica = curvaMap.get(sem)?.postura
      return {
        semana: sem,
        real: acc.aves ? Math.round((acc.huevos / acc.aves) * 1000) / 10 : 0,
        teorica: teorica != null ? teorica : null,
      }
    })
    const mortalidadSemanal = semanasOrdenadas.map(sem => ({ semana: sem, bajas: porSemana.get(sem)!.bajas }))

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
      huevosTotales: totalHuevos,
      huevosPorAve,
      costoTotal: totalCostos,
      posturaCurva,
      mortalidadSemanal,
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
