import { z } from "zod"

export const createRegistroDiarioSchema = z.object({
  loteId: z.string().uuid("Lote inválido").optional(),
  seccionId: z.string().uuid("Sección inválida"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)").optional(),
  avesVivas: z.number().int().nonnegative().optional(),
  bajasDia: z.number().int().nonnegative().optional(),
  huevosProducidos: z.number().int().nonnegative().optional(),
  consumoAlimentoKg: z.number().nonnegative().optional(),
  consumoAguaLitros: z.number().nonnegative().optional(),
  temperaturaMin: z.number().optional(),
  temperaturaMax: z.number().optional(),
  observaciones: z.string().optional(),
})

export const updateRegistroDiarioSchema = z.object({
  avesVivas: z.number().int().nonnegative().optional(),
  bajasDia: z.number().int().nonnegative().optional(),
  huevosProducidos: z.number().int().nonnegative().optional(),
  consumoAlimentoKg: z.number().nonnegative().optional(),
  consumoAguaLitros: z.number().nonnegative().optional(),
  temperaturaMin: z.number().optional(),
  temperaturaMax: z.number().optional(),
  observaciones: z.string().optional(),
})

export const listRegistrosDiariosSchema = z.object({
  loteId: z.string().uuid().optional(),
  seccionId: z.string().uuid().optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
