import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createLoteSchema } from "@/lib/validations/lotes"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const estado = searchParams.get("estado")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "100")
    const where = estado ? { estado } : {}

    const lotes = await prisma.lote.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        seccion: { include: { galpon: { select: { nombre: true } } } },
        registroDiario: { orderBy: { fecha: "desc" }, take: 1 },
      },
    })

    const today = new Date()
    const data = lotes.map((l) => {
      const fechaRecepcion = new Date(l.fechaRecepcion)
      const diffWeeks = Math.floor((today.getTime() - fechaRecepcion.getTime()) / (7 * 24 * 60 * 60 * 1000))
      const ultimoRegistro = l.registroDiario[0]
      const avesVivas = ultimoRegistro?.avesVivas ?? 0
      const postura = avesVivas > 0
        ? Math.round((ultimoRegistro.huevosProducidos ?? 0) / avesVivas * 1000) / 10
        : 0

      return {
        id: l.id,
        codigoLote: l.codigoLote,
        lineaGenetica: l.lineaGenetica,
        cantidadInicial: l.cantidadInicial,
        avesVivas,
        estado: l.estado,
        fechaRecepcion: l.fechaRecepcion,
        edadSemanas: diffWeeks,
        postura,
        galpon: l.seccion?.galpon?.nombre ?? null,
        seccion: l.seccion?.nombre ?? null,
      }
    })

    const total = await prisma.lote.count({ where })
    return NextResponse.json({ data, total, page, limit })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createLoteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const data = {
      ...parsed.data,
      estado: "recepcion",
      fechaRecepcion: new Date(parsed.data.fechaRecepcion),
      fechaNacimiento: parsed.data.fechaNacimiento ? new Date(parsed.data.fechaNacimiento) : undefined,
      pesoInicialPromedio: parsed.data.pesoInicialPromedio ?? undefined,
      costoPollitaUnitario: parsed.data.costoPollitaUnitario ?? undefined,
    }

    const lote = await prisma.lote.create({ data: data as any })
    return NextResponse.json(lote, { status: 201 })
  } catch (error: any) {
    console.error("[LOTE] error:", error?.message || error)
    return NextResponse.json({ error: error?.message || "Error interno" }, { status: 500 })
  }
}
