import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createRegistroPackingSchema } from "@/lib/validations/packing"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const loteId = searchParams.get("loteId")
    const fecha = searchParams.get("fecha")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = {}
    if (loteId) where.loteId = loteId
    if (fecha) where.fecha = new Date(fecha)

    const [data, total] = await Promise.all([
      prisma.registroPacking.findMany({ where, skip, take: limit, orderBy: { fecha: "desc" } }),
      prisma.registroPacking.count({ where }),
    ])

    return NextResponse.json({ data, total, page, limit })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createRegistroPackingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const data = await prisma.registroPacking.create({ data: parsed.data as any })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
