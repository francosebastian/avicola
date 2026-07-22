import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const fecha = searchParams.get("fecha")
    const where = fecha ? { fecha: new Date(fecha) } : {}

    const data = await prisma.despacho.findFirst({ where, orderBy: { fecha: "desc" } })
    if (!data) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 })
    }
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
