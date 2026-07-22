import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createConsumoAlimentoDiarioSchema } from "@/lib/validations/alimentacion"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const loteId = searchParams.get("loteId")
    const desde = searchParams.get("desde")
    const hasta = searchParams.get("hasta")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = {}
    if (loteId) where.loteId = loteId
    if (desde || hasta) {
      where.fecha = {}
      if (desde) where.fecha.gte = new Date(desde)
      if (hasta) where.fecha.lte = new Date(hasta)
    }

    const [data, total] = await Promise.all([
      prisma.consumoAlimentoDiario.findMany({ where, skip, take: limit, orderBy: { fecha: "desc" } }),
      prisma.consumoAlimentoDiario.count({ where }),
    ])

    return NextResponse.json({ data, total, page, limit })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createConsumoAlimentoDiarioSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const data = await prisma.consumoAlimentoDiario.create({ data: parsed.data as any })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
