import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateLoteSchema, changeEstadoSchema } from "@/lib/validations/lotes"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await prisma.lote.findUnique({ where: { id } })
    if (!data) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = updateLoteSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    const existing = await prisma.lote.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    const data = await prisma.lote.update({ where: { id }, data: parsed.data as any })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = changeEstadoSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    const existing = await prisma.lote.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    const data = await prisma.lote.update({ where: { id }, data: { estado: parsed.data.estado } })
    await prisma.eventoLote.create({ data: { loteId: id, tipoEvento: "cambio_estado", fecha: new Date().toISOString().split("T")[0], descripcion: `Estado cambiado a: ${parsed.data.estado}` } as any })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
