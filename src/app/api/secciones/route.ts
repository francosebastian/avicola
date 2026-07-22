import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const secciones = await prisma.seccion.findMany({
      where: { activo: true },
      include: { galpon: { select: { nombre: true } } },
      orderBy: [{ galpon: { nombre: "asc" } }, { nombre: "asc" }],
    })
    return NextResponse.json(secciones)
  } catch {
    return NextResponse.json({ error: "Error al cargar secciones" }, { status: 500 })
  }
}
