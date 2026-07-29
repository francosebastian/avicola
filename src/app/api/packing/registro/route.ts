import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createSchema = z.object({
  loteId: z.string().uuid(),
  seccionId: z.string().uuid(),
  fecha: z.string().optional(),
  huevosRotosKg: z.number().nonnegative().default(0).optional(),
  descarteXUnidades: z.number().int().nonnegative().default(0).optional(),
  trizadosUnidades: z.number().int().nonnegative().default(0).optional(),
  cajasJumboXxl: z.number().int().nonnegative().default(0).optional(),
  cajasJumbo: z.number().int().nonnegative().default(0).optional(),
  cajasSuper: z.number().int().nonnegative().default(0).optional(),
  cajasExtra: z.number().int().nonnegative().default(0).optional(),
  cajasPrimera: z.number().int().nonnegative().default(0).optional(),
  cajasSegunda: z.number().int().nonnegative().default(0).optional(),
  cajasTercera: z.number().int().nonnegative().default(0).optional(),
})

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const loteId = url.searchParams.get("loteId")
    const fecha = url.searchParams.get("fecha")
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "20")
    const where: any = {}
    if (loteId) where.loteId = loteId
    if (fecha) where.fecha = new Date(fecha)

    const [data, total] = await Promise.all([
      prisma.registroPacking.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { fecha: "desc" } }),
      prisma.registroPacking.count({ where }),
    ])

    return NextResponse.json({ data, total })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const data = {
      ...parsed.data,
      loteId: parsed.data.loteId,
      fecha: parsed.data.fecha ? new Date(parsed.data.fecha) : new Date(),
    }

    const registro = await prisma.registroPacking.create({ data: data as any })

    // Update inventario packing
    const cats = [
      { key: "cajasJumboXxl", cat: "jumbo_xxl" },
      { key: "cajasJumbo", cat: "jumbo" },
      { key: "cajasSuper", cat: "super" },
      { key: "cajasExtra", cat: "extra" },
      { key: "cajasPrimera", cat: "primera" },
      { key: "cajasSegunda", cat: "segunda" },
      { key: "cajasTercera", cat: "tercera" },
    ]
    for (const { key, cat } of cats) {
      const cajas = (parsed.data as any)[key] ?? 0
      if (cajas > 0) {
        const fmt = await prisma.formatoCaja.findUnique({ where: { categoria: cat } })
        const uds = (fmt?.unidadesPorCaja ?? 180) * cajas
        await prisma.inventarioPacking.upsert({
          where: { categoria: cat },
          update: { stockCajas: { increment: cajas }, stockUnidades: { increment: uds } },
          create: { categoria: cat, stockCajas: cajas, stockUnidades: uds },
        })
      }
    }

    return NextResponse.json(registro, { status: 201 })
  } catch (error: any) {
    console.error("[PACKING] error:", error?.message || error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
