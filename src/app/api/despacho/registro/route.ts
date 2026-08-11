import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createDespachoSchema } from "@/lib/validations/despacho"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const desde = searchParams.get("desde")
    const hasta = searchParams.get("hasta")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = {}
    if (desde || hasta) {
      where.fecha = {}
      if (desde) where.fecha.gte = new Date(desde)
      if (hasta) where.fecha.lte = new Date(hasta)
    }

    const [data, total] = await Promise.all([
      prisma.despacho.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fecha: "desc" },
        include: { detalle: true },
      }),
      prisma.despacho.count({ where }),
    ])

    return NextResponse.json({ data, total, page, limit })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createDespachoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { detalle, ...despachoData } = parsed.data

    const data = await prisma.$transaction(async (tx) => {
      const detalleConUds = await Promise.all(detalle.map(async (item) => {
        const fmt = await tx.formatoCaja.findUnique({ where: { categoria: item.categoria } })
        const uds = fmt?.unidadesPorCaja ?? 100
        return { ...item, cantidadUnidades: item.cantidadCajas * uds }
      }))

      const despacho = await tx.despacho.create({
        data: {
          ...despachoData,
          detalle: { create: detalleConUds },
        },
        include: { detalle: true },
      })

      for (const item of detalle) {
        const inv = await tx.inventarioPacking.findUnique({ where: { categoria: item.categoria } })
        if (!inv || inv.stockCajas < item.cantidadCajas) {
          throw new Error(`Stock insuficiente para ${item.categoria}`)
        }
        const fmt = await tx.formatoCaja.findUnique({ where: { categoria: item.categoria } })
        const uds = fmt?.unidadesPorCaja ?? 100
        await tx.inventarioPacking.update({
          where: { categoria: item.categoria },
          data: {
            stockCajas: { decrement: item.cantidadCajas },
            stockUnidades: { decrement: item.cantidadCajas * uds },
          },
        })
      }

      return despacho
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error interno"
    const status = msg.startsWith("Stock insuficiente") ? 400 : 500
    return NextResponse.json({ error: msg }, { status })
  }
}
