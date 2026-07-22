import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createConfiguracionAlertaSchema } from "@/lib/validations/alertas"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const leida = searchParams.get("leida")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = {}
    if (leida === "true") where.leida = true
    if (leida === "false") where.leida = false

    const [data, total] = await Promise.all([
      prisma.configuracionAlerta.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.configuracionAlerta.count({ where }),
    ])

    return NextResponse.json({ data, total, page, limit })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createConfiguracionAlertaSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const data = await prisma.configuracionAlerta.create({ data: parsed.data as any })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
