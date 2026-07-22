import { z } from "zod"

export const createRegistroDiarioSchema = z.object({
  loteId: z.string().uuid("Lote inválido"),
  seccionId: z.string().uuid("Sección inválida"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  avesVivas: z.number().int().nonnegative().optional(),
  bajasDia: z.number().int().nonnegative().optional(),
  huevosProducidos: z.number().int().nonnegative().optional(),
  huevosJumbo: z.number().int().nonnegative().default(0).optional(),
  huevosSuper: z.number().int().nonnegative().default(0).optional(),
  huevosExtra: z.number().int().nonnegative().default(0).optional(),
  huevosPrimera: z.number().int().nonnegative().default(0).optional(),
  huevosSegunda: z.number().int().nonnegative().default(0).optional(),
  huevosTercera: z.number().int().nonnegative().default(0).optional(),
  huevosSubproducto: z.number().int().nonnegative().default(0).optional(),
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
  huevosJumbo: z.number().int().nonnegative().optional(),
  huevosSuper: z.number().int().nonnegative().optional(),
  huevosExtra: z.number().int().nonnegative().optional(),
  huevosPrimera: z.number().int().nonnegative().optional(),
  huevosSegunda: z.number().int().nonnegative().optional(),
  huevosTercera: z.number().int().nonnegative().optional(),
  huevosSubproducto: z.number().int().nonnegative().optional(),
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
