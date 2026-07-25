import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const galpones = await prisma.galpon.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
    })
    return NextResponse.json(galpones)
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
