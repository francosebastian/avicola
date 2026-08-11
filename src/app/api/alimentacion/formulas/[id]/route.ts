import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateFormulaAlimentoSchema } from "@/lib/validations/alimentacion"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = updateFormulaAlimentoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const existing = await prisma.formulaAlimento.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    }
    const updated = await prisma.formulaAlimento.update({ where: { id }, data: parsed.data })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
