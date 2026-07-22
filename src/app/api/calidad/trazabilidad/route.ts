import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createTrazabilidadSchema } from "@/lib/validations/calidad"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const codigoEnvase = searchParams.get("codigoEnvase")
    const loteId = searchParams.get("loteId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = {}
    if (codigoEnvase) where.codigoEnvase = { contains: codigoEnvase }
    if (loteId) where.loteId = loteId

    const [data, total] = await Promise.all([
      prisma.trazabilidad.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.trazabilidad.count({ where }),
    ])

    return NextResponse.json({ data, total, page, limit })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createTrazabilidadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const data = await prisma.trazabilidad.create({ data: parsed.data as any })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
