import "dotenv/config"
import { PrismaClient } from "@/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

const url = process.env.DATABASE_URL!
const adapter = new PrismaPg(url)
const prisma = new PrismaClient({ adapter })

async function main() {
  if ((await prisma.usuario.count()) > 0) {
    console.log("→ Seed ya ejecutado. Omitiendo.")
    return
  }

  console.log("→ Sembrando base de datos...")

  const admin = await prisma.usuario.create({ data: { email: "admin@avicola.cl", nombre: "Admin General", rol: "admin" } })
  const supervisor = await prisma.usuario.create({ data: { email: "supervisor@avicola.cl", nombre: "Pedro López", rol: "supervisor" } })
  const vet = await prisma.usuario.create({ data: { email: "vet@avicola.cl", nombre: "Dr. Mario Vargas", rol: "veterinario" } })
  const bodeguero = await prisma.usuario.create({ data: { email: "bodega@avicola.cl", nombre: "Juan Pérez", rol: "bodeguero" } })
  const galponero = await prisma.usuario.create({ data: { email: "galponero@avicola.cl", nombre: "Carlos Muñoz", rol: "galponero", pin: "1234" } })

  const g1 = await prisma.galpon.create({ data: { nombre: "Galpón 1", tipo: "jaula", capacidadMaxima: 15000 } })
  const g2 = await prisma.galpon.create({ data: { nombre: "Galpón 2", tipo: "jaula", capacidadMaxima: 15000 } })
  const gc = await prisma.galpon.create({ data: { nombre: "Galpón de Crianza", tipo: "piso", capacidadMaxima: 10000 } })

  const g1a = await prisma.seccion.create({ data: { galponId: g1.id, nombre: "Fila A", codigo: "G1-FA", capacidadMaxima: 5000 } })
  const g1b = await prisma.seccion.create({ data: { galponId: g1.id, nombre: "Fila B", codigo: "G1-FB", capacidadMaxima: 5000 } })
  const g1c = await prisma.seccion.create({ data: { galponId: g1.id, nombre: "Fila C", codigo: "G1-FC", capacidadMaxima: 5000 } })
  const g2a = await prisma.seccion.create({ data: { galponId: g2.id, nombre: "Fila A", codigo: "G2-FA", capacidadMaxima: 5000 } })
  const g2b = await prisma.seccion.create({ data: { galponId: g2.id, nombre: "Fila B", codigo: "G2-FB", capacidadMaxima: 5000 } })
  const g2c = await prisma.seccion.create({ data: { galponId: g2.id, nombre: "Fila C", codigo: "G2-FC", capacidadMaxima: 5000 } })
  const gca = await prisma.seccion.create({ data: { galponId: gc.id, nombre: "Fila A", codigo: "GC-FA", capacidadMaxima: 5000 } })
  const gcb = await prisma.seccion.create({ data: { galponId: gc.id, nombre: "Fila B", codigo: "GC-FB", capacidadMaxima: 5000 } })

  for (let sem = 18; sem <= 90; sem++) {
    const pico = sem >= 24 && sem <= 32 ? 95 : sem >= 18 && sem < 24 ? 5 + (sem - 18) * 15 : Math.max(70, 95 - (sem - 32) * 0.4)
    await prisma.curvaEstandar.create({ data: { lineaGenetica: "Hy-Line Brown", semanaVida: sem, posturaEsperada: Math.round(pico * 10) / 10, mortalidadEsperada: Math.max(0.05, 0.1 + (sem - 18) * 0.008), consumoEsperadoGramos: Math.round(100 + sem * 0.5), pesoHuevoEsperado: Math.round((58 + sem * 0.15) * 10) / 10, pesoCorporalEsperado: Math.round((1500 + sem * 12) * 10) / 10 } })
  }

  for (let sem = 18; sem <= 90; sem++) {
    const pico = sem >= 24 && sem <= 32 ? 95 : sem >= 18 && sem < 24 ? 5 + (sem - 18) * 14 : Math.max(68, 95 - (sem - 32) * 0.45)
    await prisma.curvaEstandar.create({ data: { lineaGenetica: "Hy-Line W-80", semanaVida: sem, posturaEsperada: Math.round(pico * 10) / 10, mortalidadEsperada: Math.max(0.05, 0.1 + (sem - 18) * 0.007), consumoEsperadoGramos: Math.round(92 + sem * 0.5), pesoHuevoEsperado: Math.round((56 + sem * 0.12) * 10) / 10, pesoCorporalEsperado: Math.round((1400 + sem * 11) * 10) / 10 } })
  }

  const hoy = new Date()
  const fRecepcion = new Date("2025-12-15")
  const fNacimiento = new Date("2025-12-12")

  const l1 = await prisma.lote.create({ data: { codigoLote: "H-032", seccionId: g1a.id, lineaGenetica: "Hy-Line Brown", proveedorPollita: "Avícola El Carmen", cantidadInicial: 5000, fechaRecepcion: fRecepcion, fechaNacimiento: fNacimiento, pesoInicialPromedio: 35.2, costoPollitaUnitario: 3850, estado: "postura" } })
  const l2 = await prisma.lote.create({ data: { codigoLote: "H-033", seccionId: g1b.id, lineaGenetica: "Hy-Line Brown", proveedorPollita: "Avícola El Carmen", cantidadInicial: 5000, fechaRecepcion: new Date("2026-02-02"), fechaNacimiento: new Date("2026-01-30"), pesoInicialPromedio: 35.0, costoPollitaUnitario: 3850, estado: "postura" } })
  const l3 = await prisma.lote.create({ data: { codigoLote: "H-034", seccionId: g2a.id, lineaGenetica: "Hy-Line W-80", proveedorPollita: "AgroAvícola del Sur", cantidadInicial: 5000, fechaRecepcion: new Date("2026-04-01"), fechaNacimiento: new Date("2026-03-29"), pesoInicialPromedio: 34.5, costoPollitaUnitario: 3700, estado: "recria" } })
  const l4 = await prisma.lote.create({ data: { codigoLote: "H-035", seccionId: g2b.id, lineaGenetica: "Hy-Line Brown", proveedorPollita: "Avícola El Carmen", cantidadInicial: 5000, fechaRecepcion: new Date("2025-07-28"), fechaNacimiento: new Date("2025-07-25"), pesoInicialPromedio: 35.5, costoPollitaUnitario: 3850, estado: "postura" } })
  const l5 = await prisma.lote.create({ data: { codigoLote: "C-001", seccionId: gca.id, lineaGenetica: "Hy-Line W-80", proveedorPollita: "AgroAvícola del Sur", cantidadInicial: 4500, fechaRecepcion: new Date("2026-07-05"), fechaNacimiento: new Date("2026-07-02"), pesoInicialPromedio: 36.0, costoPollitaUnitario: 3400, estado: "cria" } })

  const lotes = [l1, l2, l4]
  for (const l of lotes) {
    for (let d = 30; d >= 0; d--) {
      const fecha = new Date(hoy); fecha.setDate(fecha.getDate() - d)
      const bajas = Math.floor(Math.random() * 5) + 1
      const vivas = 5000 - Math.floor((30 - d) * 3.5) + Math.floor(Math.random() * 20)
      const prod = Math.floor(vivas * (0.88 + Math.random() * 0.07))
      await prisma.registroDiario.create({ data: { loteId: l.id, seccionId: l.seccionId, fecha, avesVivas: Math.max(vivas - bajas, 0), bajasDia: bajas, huevosProducidos: prod, huevosJumbo: Math.floor(prod * 0.15), huevosSuper: Math.floor(prod * 0.36), huevosExtra: Math.floor(prod * 0.30), huevosPrimera: Math.floor(prod * 0.12), huevosSegunda: Math.floor(prod * 0.05), huevosTercera: Math.floor(prod * 0.02), huevosSubproducto: Math.floor(prod * 0.005), consumoAlimentoKg: Math.round(vivas * 0.105 * 10) / 10, consumoAguaLitros: Math.round(vivas * 0.22 * 10) / 10, temperaturaMin: 18 + Math.floor(Math.random() * 3), temperaturaMax: 23 + Math.floor(Math.random() * 5), registradoPor: galponero.id } })
    }
  }

  await prisma.eventoLote.create({ data: { loteId: l1.id, tipoEvento: "vacunacion", fecha: new Date("2026-07-15"), descripcion: "Vacunación Newcastle + Bronquitis", createdBy: vet.id } })
  await prisma.eventoLote.create({ data: { loteId: l1.id, tipoEvento: "cambio_alimento", fecha: new Date("2026-07-01"), descripcion: "Cambio a Postura Fase 2", createdBy: admin.id } })
  await prisma.eventoLote.create({ data: { loteId: l1.id, tipoEvento: "pesaje", fecha: new Date("2026-06-18"), descripcion: "Muestreo de peso corporal — promedio 1,850g", createdBy: supervisor.id } })
  await prisma.eventoLote.create({ data: { loteId: l2.id, tipoEvento: "vacunacion", fecha: new Date("2026-07-18"), descripcion: "Vacunación Newcastle + Bronquitis", createdBy: vet.id } })

  await prisma.formulaAlimento.create({ data: { nombre: "Postura Fase 1 — Hy-Line Brown", tipoAlimento: "postura_1", ingredientes: [{ ingrediente: "Maíz", porcentaje: 60.0 }, { ingrediente: "Soya", porcentaje: 20.0 }, { ingrediente: "Conchuela", porcentaje: 9.0 }, { ingrediente: "Harinilla", porcentaje: 5.0 }, { ingrediente: "Núcleo Ponedora", porcentaje: 2.5 }, { ingrediente: "Fosfato Bicálcico", porcentaje: 1.5 }, { ingrediente: "Sal", porcentaje: 0.5 }, { ingrediente: "Lisina", porcentaje: 0.5 }, { ingrediente: "Metionina", porcentaje: 0.5 }, { ingrediente: "Monsigran", porcentaje: 0.5 }, { ingrediente: "Biomin", porcentaje: 0.5 }, { ingrediente: "Mycofix", porcentaje: 0.5 }], costoKgEstimado: 385.0, proteinaBruta: 17.5, energiaMetabolizable: 2850 } })

  const insumos = ["Maíz", "Soya", "Conchuela", "Nutrameal", "Harinilla", "Núcleo Ponedora", "Núcleo Pollita", "Fosfato Bicálcico", "Sal", "Lisina", "Metionina", "Monsigran", "Biomin", "Mycofix"]
  const stocks = [12500, 8500, 3200, 0, 6200, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const minimos = [2000, 1500, 800, 100, 1000, 100, 100, 100, 100, 50, 50, 50, 50, 50]
  for (let i = 0; i < insumos.length; i++) {
    await prisma.stockInsumo.upsert({
      where: { tipoInsumo: insumos[i] },
      update: { stockActualKg: stocks[i], stockMinimoKg: minimos[i] },
      create: { tipoInsumo: insumos[i], stockActualKg: stocks[i], stockMinimoKg: minimos[i] },
    })
  }

  const formatos = [
    { categoria: "jumbo_xxl", unidadesPorCaja: 100 },
    { categoria: "jumbo", unidadesPorCaja: 100 },
    { categoria: "super", unidadesPorCaja: 100 },
    { categoria: "extra", unidadesPorCaja: 180 },
    { categoria: "primera", unidadesPorCaja: 180 },
    { categoria: "segunda", unidadesPorCaja: 180 },
    { categoria: "tercera", unidadesPorCaja: 180 },
    { categoria: "descarte_x", unidadesPorCaja: 100 },
    { categoria: "trizados", unidadesPorCaja: 100 },
  ]
  for (const f of formatos) {
    await prisma.formatoCaja.upsert({ where: { categoria: f.categoria }, update: f, create: f })
    await prisma.inventarioPacking.upsert({
      where: { categoria: f.categoria },
      update: { stockCajas: 0, stockUnidades: 0 },
      create: { categoria: f.categoria, stockCajas: 0, stockUnidades: 0 },
    })
  }

  const alertas = [{ tipo: "caida_postura", umbralMin: 5, umbralMax: null, canales: ["in_app", "email"] }, { tipo: "mortalidad_diaria", umbralMin: 0.1, umbralMax: null, canales: ["in_app", "email"] }, { tipo: "consumo_alimento", umbralMin: 15, umbralMax: 15, canales: ["in_app"] }, { tipo: "consumo_agua", umbralMin: 20, umbralMax: null, canales: ["in_app", "email", "whatsapp"] }, { tipo: "temperatura", umbralMin: 16, umbralMax: 28, canales: ["in_app", "whatsapp"] }, { tipo: "amoniaco", umbralMin: null, umbralMax: 15, canales: ["in_app"] }, { tipo: "stock_alimento", umbralMin: null, umbralMax: null, canales: ["in_app"] }]
  for (const a of alertas) await prisma.configuracionAlerta.create({ data: { tipoAlerta: a.tipo, umbralMin: a.umbralMin, umbralMax: a.umbralMax, canalNotificacion: a.canales } })

  console.log("✅ Seed completado!")
  console.log(`   ${await prisma.usuario.count()} usuarios, ${await prisma.galpon.count()} galpones, ${await prisma.seccion.count()} secciones, ${await prisma.lote.count()} lotes, ${await prisma.registroDiario.count()} registros, ${await prisma.curvaEstandar.count()} curvas, ${await prisma.formulaAlimento.count()} fórmulas, ${await prisma.configuracionAlerta.count()} alertas`)

  await prisma.$disconnect()
}

main().catch((e) => { console.error("❌ Seed falló:", e); process.exit(1) })
