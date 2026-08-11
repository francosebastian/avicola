import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const dias = Math.min(Math.max(parseInt(searchParams.get("dias") || "14") || 14, 1), 90)
    const lecturas = Math.min(Math.max(parseInt(searchParams.get("lecturas") || "7") || 7, 1), 30)

    const desde = new Date()
    desde.setDate(desde.getDate() - dias)
    desde.setHours(0, 0, 0, 0)

    const [registros, curvas] = await Promise.all([
      prisma.registroDiario.findMany({
        where: { fecha: { gte: desde } },
        include: {
          lote: { select: { lineaGenetica: true, fechaRecepcion: true } },
          seccion: { select: { nombre: true, galpon: { select: { nombre: true } } } },
        },
        orderBy: { fecha: "asc" },
      }),
      prisma.curvaEstandar.findMany(),
    ])

    const feedPorLinea = new Map<string, Map<number, number>>()
    for (const c of curvas) {
      let bySem = feedPorLinea.get(c.lineaGenetica)
      if (!bySem) {
        bySem = new Map()
        feedPorLinea.set(c.lineaGenetica, bySem)
      }
      bySem.set(c.semanaVida, Number(c.consumoEsperadoGramos) || 0)
    }

    function esperadoAveMl(linea: string, fecha: Date, recepcion: Date) {
      const diasDiff = Math.floor((fecha.getTime() - recepcion.getTime()) / 86400000)
      const semana = Math.min(Math.max(Math.floor(diasDiff / 7), 18), 90)
      const feed = feedPorLinea.get(linea)?.get(semana) ?? 110
      return feed * 2
    }

    const porFecha = new Map<string, { realTotal: number; esperadoTotal: number; aves: number }>()
    for (const r of registros) {
      const key = r.fecha.toISOString().split("T")[0]
      const aves = r.avesVivas || 0
      const realL = Number(r.consumoAguaLitros) || 0
      const espL = (aves * esperadoAveMl(r.lote.lineaGenetica, r.fecha, r.lote.fechaRecepcion)) / 1000

      const acc = porFecha.get(key) || { realTotal: 0, esperadoTotal: 0, aves: 0 }
      acc.realTotal += realL
      acc.esperadoTotal += espL
      acc.aves += aves
      porFecha.set(key, acc)
    }

    const fechas = [...porFecha.keys()].sort()
    const serie = fechas.map(key => {
      const acc = porFecha.get(key)!
      return {
        fecha: key,
        realMl: acc.aves ? Math.round((acc.realTotal / acc.aves) * 1000) : 0,
        esperadoMl: acc.aves ? Math.round((acc.esperadoTotal / acc.aves) * 1000) : 0,
        realTotalL: Math.round(acc.realTotal),
        esperadoTotalL: Math.round(acc.esperadoTotal),
        aves: acc.aves,
      }
    })

    const lecturasFechas = new Set(fechas.slice(-lecturas))
    const lecturasRows = registros
      .filter(r => lecturasFechas.has(r.fecha.toISOString().split("T")[0]))
      .map(r => {
        const aves = r.avesVivas || 0
        const realL = Number(r.consumoAguaLitros) || 0
        return {
          id: r.id,
          fecha: r.fecha.toISOString().split("T")[0],
          seccion: `${r.seccion.galpon.nombre} - ${r.seccion.nombre}`,
          litrosAveMl: aves ? Math.round((realL / aves) * 1000) : 0,
          totalL: Math.round(realL),
          esperadoMl: esperadoAveMl(r.lote.lineaGenetica, r.fecha, r.lote.fechaRecepcion),
          aves,
        }
      })
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || a.seccion.localeCompare(b.seccion))

    const ultimo = serie[serie.length - 1]
    const resumen = {
      fecha: ultimo?.fecha ?? null,
      promedioHoyMl: ultimo?.realMl ?? 0,
      esperadoHoyMl: ultimo?.esperadoMl ?? 0,
      totalHoyL: ultimo?.realTotalL ?? 0,
      diferenciaMl: (ultimo?.realMl ?? 0) - (ultimo?.esperadoMl ?? 0),
      alerta: ultimo ? ultimo.realMl < ultimo.esperadoMl * 0.8 : false,
    }

    return NextResponse.json({ serie, lecturas: lecturasRows, resumen })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
