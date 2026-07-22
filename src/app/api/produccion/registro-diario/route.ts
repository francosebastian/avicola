import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createRegistroDiarioSchema, updateRegistroDiarioSchema } from "@/lib/validations/produccion"

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
      prisma.registroDiario.findMany({ where, skip, take: limit, orderBy: { fecha: "desc" } }),
      prisma.registroDiario.count({ where }),
    ])

    return NextResponse.json({ data, total, page, limit })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createRegistroDiarioSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const data = await prisma.registroDiario.create({ data: parsed.data as any })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = updateRegistroDiarioSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { id, ...data } = parsed.data as any
    const existing = await prisma.registroDiario.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    }
    const updated = await prisma.registroDiario.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
