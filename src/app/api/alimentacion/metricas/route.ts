import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const dias = Math.min(Math.max(parseInt(searchParams.get("dias") || "7") || 7, 1), 30)

    const desde = new Date()
    desde.setDate(desde.getDate() - dias)
    desde.setHours(0, 0, 0, 0)

    const [registros, formulas, curvas] = await Promise.all([
      prisma.registroDiario.findMany({
        where: { fecha: { gte: desde } },
        include: {
          lote: { select: { lineaGenetica: true, fechaRecepcion: true } },
          seccion: { select: { nombre: true, galpon: { select: { nombre: true } } } },
        },
        orderBy: { fecha: "asc" },
      }),
      prisma.formulaAlimento.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
      prisma.curvaEstandar.findMany(),
    ])

    const costoKg = formulas.length ? Number(formulas[0].costoKgEstimado) || 0 : 0
    const formulaNombre = formulas[0]?.nombre || "Alimento"

    const pesoHuevoPorLinea = new Map<string, Map<number, number>>()
    for (const c of curvas) {
      let bySem = pesoHuevoPorLinea.get(c.lineaGenetica)
      if (!bySem) {
        bySem = new Map()
        pesoHuevoPorLinea.set(c.lineaGenetica, bySem)
      }
      bySem.set(c.semanaVida, Number(c.pesoHuevoEsperado) || 0)
    }

    function pesoHuevoKg(linea: string, fecha: Date, recepcion: Date) {
      const diasDiff = Math.floor((fecha.getTime() - recepcion.getTime()) / 86400000)
      const semana = Math.min(Math.max(Math.floor(diasDiff / 7), 18), 90)
      return (pesoHuevoPorLinea.get(linea)?.get(semana) ?? 60) / 1000
    }

    const porFecha = new Map<string, { kg: number; huevos: number; aves: number; huevoKg: number; costo: number }>()
    const registrosRows: Array<{ id: string; fecha: string; seccion: string; tipo: string; kg: number; costo: number }> = []

    for (const r of registros) {
      const key = r.fecha.toISOString().split("T")[0]
      const kg = Number(r.consumoAlimentoKg) || 0
      const huevos = r.huevosProducidos || 0
      const aves = r.avesVivas || 0
      const peso = pesoHuevoKg(r.lote.lineaGenetica, r.fecha, r.lote.fechaRecepcion)

      const acc = porFecha.get(key) || { kg: 0, huevos: 0, aves: 0, huevoKg: 0, costo: 0 }
      acc.kg += kg
      acc.huevos += huevos
      acc.aves += aves
      acc.huevoKg += huevos * peso
      acc.costo += kg * costoKg
      porFecha.set(key, acc)

      registrosRows.push({
        id: r.id,
        fecha: key,
        seccion: `${r.seccion.galpon.nombre} - ${r.seccion.nombre}`,
        tipo: formulaNombre,
        kg: Math.round(kg),
        costo: Math.round(kg * costoKg),
      })
    }

    const fechas = [...porFecha.keys()].sort()
    const serie = fechas.map(key => ({ dia: key, kg: Math.round(porFecha.get(key)!.kg) }))
    const registrosSorted = registrosRows.sort((a, b) => b.fecha.localeCompare(a.fecha) || a.seccion.localeCompare(b.seccion))

    const lastKey = fechas[fechas.length - 1]
    const ultimo = lastKey ? porFecha.get(lastKey) : undefined
    const resumen = {
      fecha: lastKey ?? null,
      consumoHoyKg: ultimo ? Math.round(ultimo.kg) : 0,
      huevosHoy: ultimo?.huevos ?? 0,
      avesHoy: ultimo?.aves ?? 0,
      costoKg,
      costoHuevoCLP: ultimo && ultimo.huevos ? Math.round(ultimo.costo / ultimo.huevos) : 0,
      conversion: ultimo && ultimo.huevoKg ? Math.round((ultimo.kg / ultimo.huevoKg) * 100) / 100 : 0,
      kgPor100Aves: ultimo && ultimo.aves ? Math.round((ultimo.kg / ultimo.aves) * 10000) / 100 : 0,
    }

    return NextResponse.json({ serie, registros: registrosSorted, resumen, formulas })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
