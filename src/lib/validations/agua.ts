import { z } from "zod"

export const createConsumoAguaSchema = z.object({
  loteId: z.string().uuid("Lote inválido"),
  seccionId: z.string().uuid("Sección inválida").optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  lecturaMedidor: z.number().nonnegative().optional(),
  litrosConsumidos: z.number().nonnegative().optional(),
  avesPeriodo: z.number().int().nonnegative().optional(),
  observaciones: z.string().optional(),
})

export const updateConsumoAguaSchema = z.object({
  lecturaMedidor: z.number().nonnegative().optional(),
  litrosConsumidos: z.number().nonnegative().optional(),
  avesPeriodo: z.number().int().nonnegative().optional(),
  observaciones: z.string().optional(),
})

export const listConsumosAguaSchema = z.object({
  loteId: z.string().uuid().optional(),
  seccionId: z.string().uuid().optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
