import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createFormulaAlimentoSchema } from "@/lib/validations/alimentacion"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.formulaAlimento.findMany({ skip, take: limit, orderBy: { nombre: "asc" } }),
      prisma.formulaAlimento.count(),
    ])

    return NextResponse.json({ data, total, page, limit })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createFormulaAlimentoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const data = await prisma.formulaAlimento.create({ data: parsed.data as any })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
