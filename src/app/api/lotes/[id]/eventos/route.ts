import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createEventoSchema = z.object({
  tipoEvento: z.string().min(1),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  descripcion: z.string().optional(),
  fotoUrl: z.string().optional(),
  createdBy: z.string().optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "20")

    const where = { loteId: id }
    const [data, total] = await Promise.all([
      prisma.eventoLote.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { fecha: "desc" } }),
      prisma.eventoLote.count({ where }),
    ])

    return NextResponse.json({ data, total, page, limit })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = createEventoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const data = await prisma.eventoLote.create({ data: { ...parsed.data, loteId: id } as any })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
