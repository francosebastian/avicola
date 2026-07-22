import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createLoteSchema } from "@/lib/validations/lotes"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const estado = searchParams.get("estado")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit
    const where = estado ? { estado } : {}

    const [data, total] = await Promise.all([
      prisma.lote.findMany({
        where, skip, take: limit, orderBy: { createdAt: "desc" },
        include: { seccion: { include: { galpon: { select: { nombre: true } } } } },
      }),
      prisma.lote.count({ where }),
    ])

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
