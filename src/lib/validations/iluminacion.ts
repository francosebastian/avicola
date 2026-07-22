import { z } from "zod"

export const createProgramaIluminacionSchema = z.object({
  loteId: z.string().uuid("Lote inválido"),
  semanaVida: z.number().int().nonnegative("Semana de vida inválida"),
  horasLuz: z.number().nonnegative("Horas de luz inválidas"),
  intensidadLux: z.number().int().nonnegative().optional(),
  horaEncendido: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM").optional(),
  horaApagado: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM").optional(),
  tipoPeriodo: z.enum(["cria", "recria", "postura"]).default("postura"),
})

export const updateProgramaIluminacionSchema = z.object({
  horasLuz: z.number().nonnegative().optional(),
  intensidadLux: z.number().int().nonnegative().optional(),
  horaEncendido: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  horaApagado: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  tipoPeriodo: z.enum(["cria", "recria", "postura"]).optional(),
})

export const listProgramasIluminacionSchema = z.object({
  loteId: z.string().uuid().optional(),
  semanaVida: z.coerce.number().int().nonnegative().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const createRegistroIluminacionDiarioSchema = z.object({
  loteId: z.string().uuid("Lote inválido"),
  seccionId: z.string().uuid("Sección inválida").optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  horasLuzReales: z.number().nonnegative().optional(),
  horaEncendidoReal: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  horaApagadoReal: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  intensidadLux: z.number().int().nonnegative().optional(),
  observaciones: z.string().optional(),
})

export const updateRegistroIluminacionDiarioSchema = z.object({
  horasLuzReales: z.number().nonnegative().optional(),
  horaEncendidoReal: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  horaApagadoReal: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  intensidadLux: z.number().int().nonnegative().optional(),
  observaciones: z.string().optional(),
})

export const listRegistrosIluminacionDiarioSchema = z.object({
  loteId: z.string().uuid().optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
