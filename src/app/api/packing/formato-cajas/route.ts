import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateFormatoCajaSchema } from "@/lib/validations/packing"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.formatoCaja.findMany({ skip, take: limit, orderBy: { categoria: "asc" } }),
      prisma.formatoCaja.count(),
    ])

    return NextResponse.json({ data, total, page, limit })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = updateFormatoCajaSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { id, ...data } = parsed.data as any
    const existing = await prisma.formatoCaja.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    }
    const updated = await prisma.formatoCaja.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
