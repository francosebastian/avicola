import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createProgramaIluminacionSchema } from "@/lib/validations/iluminacion"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const loteId = searchParams.get("loteId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where = loteId ? { loteId } : {}

    const [data, total] = await Promise.all([
      prisma.programaIluminacion.findMany({ where, skip, take: limit, orderBy: { id: "desc" } }),
      prisma.programaIluminacion.count({ where }),
    ])

    return NextResponse.json({ data, total, page, limit })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createProgramaIluminacionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const data = await prisma.programaIluminacion.create({ data: parsed.data as any })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
